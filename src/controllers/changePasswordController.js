const { User } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const joi = require("joi");
const bcrypt = require("bcrypt");

const env = dotenv.config().parsed;

exports.findEmailResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const dataUser = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
    });

    const { error } = schema.validate(dataUser);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 400, "EMAIL_NOT_FOUND");
    }

    const resetPassword = jwt.sign({ email }, env.JWT_RESET_PASSWORD_SECRET);

    await user.update({ resetPassword });

    successResWithData(res, 200, "SUCCESS_FIND_EMAIL", { link: resetPassword });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { resetPassword, password } = req.body;

    const schema = joi.object({
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate({ password });

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const user = await User.findOne({ where: { resetPassword } });

    if (!user) {
      return errorResponse(res, 400, "DATA_NOT_FOUND");
    }

    let salt = await bcrypt.genSalt(+env.SALT);
    let hash = await bcrypt.hash(password, salt);

    await user.update({ password: hash, resetPassword: null });

    successRes(res, 200, "SUCCESS_CHANGE_PASSWORD");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
