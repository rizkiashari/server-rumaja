const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../../models");
const { errorResponse } = require("../helper/response");
const { Op } = require("sequelize");

const env = dotenv.config().parsed;

exports.getAllUser = async (req, res) => {
  const { search } = req.query;
  const headers = req.header("Authorization");
  try {
    if (!headers) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (user.role !== 1) {
        return errorResponse(res, 403, "YOUR_NOT_ADMIN");
      } else {
        const users = await User.findAll({
          where: {
            [Op.or]: [
              {
                name_user: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                email: {
                  [Op.like]: `%${search}%`,
                },
              },
            ],
          },
          attributes: { exclude: ["password", "updatedAt"] },
        });

        res.status(200).send({
          code: 200,
          status: true,
          data: users,
          message: "Get all user success",
        });
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
