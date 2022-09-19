const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { User } = require("../../models");

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
        status: false,
        message: error.details[0].message,
      });
    }

    const isEmail = await isEmailExist(email);

    if (isEmail) {
      return res.status(409).send({
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

    const user = await newUser.save();

    res.status(200).send({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
