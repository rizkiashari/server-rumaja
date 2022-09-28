const joi = require("joi");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { User, Penyedia } = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");

const env = dotenv.config().parsed;

exports.getAllUser = async (req, res) => {
  const { search } = req.query;
  const headers = req.header("Authorization");
  try {
    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
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

        successResWithData(res, 200, "SUCCESS_GET_ALL_USER", users);
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.updateUserPenyedia = async (req, res) => {
  try {
    const headers = req.header("Authorization");
    const dataPenyedia = req.body;
    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
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
      });

      if (!dataUser) {
        return errorResponse(res, 404, "USER_NOT_FOUND");
      }

      const schema = joi.object({
        name_user: joi.string().min(3).required(),
        gender: joi.string().required(),
        email: joi.string().email().required(),
        nomor_wa: joi.string().min(10).max(17).required(),
        alamat_rumah: joi.string().required(),
        domisili: joi.string().required(),
        tentang: joi.string().required(),
        tanggal_lahir: joi.string().required(),
        photo_profile: joi.string().optional(),
      });

      const { error } = schema.validate(dataPenyedia);

      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }

      await dataUser.update(
        {
          name_user: dataPenyedia.name_user,
          email: dataPenyedia.email,
          nomor_wa: dataPenyedia.nomor_wa,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      await Penyedia.create({
        user_id: user.id,
        domisili: dataPenyedia.domisili,
        photo_profile: dataPenyedia.photo_profile,
        header_profile: dataPenyedia.header_profile,
        gender: dataPenyedia.gender,
        alamat_rumah: dataPenyedia.alamat_rumah,
        tanggal_lahir: dataPenyedia.tanggal_lahir,
        tentang: dataPenyedia.tentang,
        createdAt: Math.floor(+new Date() / 1000),
      });

      successRes(res, 200, "SUCCESS_UPDATE_USER_PENYEDIA");
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
