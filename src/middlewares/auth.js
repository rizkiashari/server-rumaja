const dotenv = require("dotenv");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../helper/response");
const env = dotenv.config().parsed;

exports.authMiddleware = (req, res, next) => {
  try {
    const headers = req.header("Authorization");
    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      const { id } = decoded;
      const userData = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["password", "updatedAt"],
        },
      });

      if (!userData) {
        return errorResponse(res, 404, "USER_NOT_FOUND");
      }

      req.user = userData;
      next();
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
