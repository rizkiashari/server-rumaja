const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");

const env = dotenv.config().parsed;

const isEmailExist = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    return true;
  }
  return false;
};

const generateAccessToken = async (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_LIFE,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_LIFE,
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataUser = req.body;

    const schema = joi.object({
      name_user: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      role: joi.number().required(),
      nomor_wa: joi.string().min(10).max(17).required(),
    });

    const { error } = schema.validate(dataUser);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const isEmail = await isEmailExist(email);

    if (isEmail) {
      return errorResponse(res, 409, "EMAIL_ALREADY_EXIST");
    }

    let salt = await bcrypt.genSalt(+env.SALT);
    let hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      uuid_user: uuid.v4(),
      name_user: dataUser.name_user,
      email,
      password: hash,
      role_id: dataUser.role,
      nomor_wa: dataUser.nomor_wa,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newUser.save();

    successRes(res, 200, "USER_REGISTER_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return errorResponse(res, 404, "USER_NOT_FOUND");
    }

    const isMatch = await bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 428, "PASSWORD_NOT_MATCH");
    }

    const payload = {
      id: user.id,
      role: user.role_id,
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    await Token.create({
      user_id: user.id,
      token: refreshToken,
      expired_at: new Date().setDate(new Date().getDate() + 60),
    });

    successResWithData(res, 200, "LOGIN_SUCCESS", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const token = await Token.findOne({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      return errorResponse(res, 404, "TOKEN_NOT_FOUND");
    }

    await Token.destroy({
      where: {
        token: refreshToken,
      },
    });

    successRes(res, 200, "LOGOUT_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const token = await Token.findOne({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      return errorResponse(res, 404, "TOKEN_NOT_FOUND");
    }

    jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        Token.destroy({
          where: {
            token: refreshToken,
          },
        });

        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      const payload = {
        id: user.id,
        role: user.role,
      };
      const accessToken = await generateAccessToken(payload);

      successResWithData(res, 200, "REFRESH_TOKEN_SUCCESS", {
        access_token: accessToken,
      });
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      const dataUser = await User.findOne({
        where: {
          id: user.id,
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!dataUser) {
        return errorResponse(res, 404, "USER_NOT_FOUND");
      }

      successResWithData(res, 200, "USER_FOUND", dataUser);
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
