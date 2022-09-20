const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../../models");

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
      name_user: joi.string().min(5).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      role: joi.number().required(),
    });

    const { error } = schema.validate(dataUser);

    if (error) {
      return res.status(428).send({
        code: 428,
        status: false,
        message: error.details[0].message,
      });
    }

    const isEmail = await isEmailExist(email);

    if (isEmail) {
      return res.status(409).send({
        code: 409,
        status: false,
        message: "Email already exist",
      });
    }

    let salt = await bcrypt.genSalt(+env.SALT);
    let hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      uuid_user: uuid.v4(),
      name_user: dataUser.name_user,
      email,
      password: hash,
      role_id: dataUser.role,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newUser.save();

    res.status(200).send({
      code: 200,
      status: true,
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
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
      return res.status(404).send({
        code: 404,
        status: false,
        message: "USER_NOT_FOUND",
      });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(428).send({
        code: 428,
        status: false,
        message: "PASSWORD_NOT_MATCH",
      });
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

    res.status(200).send({
      code: 200,
      status: true,
      message: "USER_LOGIN_SUCCESS",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
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
      return res.status(404).send({
        code: 404,
        status: false,
        message: "TOKEN_NOT_FOUND",
      });
    }

    await Token.destroy({
      where: {
        token: refreshToken,
      },
    });

    res.status(200).send({
      code: 200,
      status: true,
      message: "USER_LOGOUT_SUCCESS",
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
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
      return res.status(404).send({
        code: 404,
        status: false,
        message: "TOKEN_NOT_FOUND",
      });
    }

    jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).send({
          code: 403,
          status: false,
          message: "TOKEN_EXPIRED",
        });
      }

      const payload = {
        id: user.id,
        role: user.role,
      };
      const accessToken = await generateAccessToken(payload);

      res.status(200).send({
        code: 200,
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        access_token: accessToken,
      });
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
};
