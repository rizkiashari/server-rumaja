const dotenv = require("dotenv");
const { User, Pencari } = require("../../models");
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
      let userData = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["password", "updatedAt", "createdAt"],
        },
      });

      if (!userData) {
        return errorResponse(res, 404, "USER_NOT_FOUND");
      }

      if (userData?.id_role === 2) {
        const { id } = userData;
        let pencari = await Pencari.findOne({
          where: {
            id_user: id,
          },
          attributes: ["id_bidang_kerja"],
        });
        userData = { ...userData.dataValues, ...pencari.dataValues };
      }

      req.user = userData;
      next();
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
