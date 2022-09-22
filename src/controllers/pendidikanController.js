const joi = require("joi");
const dotenv = require("dotenv");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User, Pendidikan } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");
const env = dotenv.config().parsed;

exports.addPendidikan = async (req, res) => {
  try {
    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    const dataPendidikan = req.body;

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (!data) {
        return errorResponse(res, 403, "TOKEN_INVALID");
      } else {
        const user = await User.findOne({
          where: {
            id: data.id,
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const schema = joi.object({
          nama: joi.string().required(),
          jurusan: joi.string().required(),
          tahun_awal: joi.string().required(),
          tahun_akhir: joi.string().required(),
        });

        const { error } = schema.validate(dataPendidikan);

        if (error) {
          return errorResponse(res, 400, error.details[0].message);
        }

        const newPendidikan = new Pendidikan({
          nama: dataPendidikan.nama,
          uuid_pendidikan: uuid.v4(),
          user_id: user.id,
          jurusan: dataPendidikan.jurusan,
          tahun_awal: dataPendidikan.tahun_awal,
          tahun_akhir: dataPendidikan.tahun_akhir,
          createdAt: Math.floor(+new Date() / 1000),
        });

        await newPendidikan.save();

        successRes(res, 200, "ADD_PENDIDIKAN_SUCCESS");
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.listAllPendidikan = async (req, res) => {
  try {
    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (!data) {
        return errorResponse(res, 403, "TOKEN_INVALID");
      } else {
        const user = await User.findOne({
          where: {
            id: data.id,
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const listPendidikan = await Pendidikan.findAll({
          where: {
            user_id: user.id,
          },
          attributes: {
            exclude: ["updatedAt"],
          },
        });

        successResWithData(res, 200, "LIST_PENDIDIKAN_SUCCESS", listPendidikan);

        res.status(200).send({
          code: 200,
          message: "LIST_ALL_PENDIDIKAN_SUCCESS",
          data: listPendidikan,
        });
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.editPendidikan = async (req, res) => {
  try {
    const headers = req.header("Authorization");
    const { uuid_pendidikan } = req.params;
    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (!data) {
        return errorResponse(res, 403, "TOKEN_INVALID");
      } else {
        const user = await User.findOne({
          where: {
            id: data.id,
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const pendidikan = await Pendidikan.findOne({
          where: {
            uuid_pendidikan,
          },
          attributes: {
            exclude: ["updatedAt"],
          },
        });

        if (!pendidikan) {
          return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
        }

        await Pendidikan.update(req.body, {
          where: {
            uuid_pendidikan,
          },
        });

        successRes(res, 200, "EDIT_PENDIDIKAN_SUCCESS");
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.deletePendidikan = async (req, res) => {
  try {
    const headers = req.header("Authorization");
    const { uuid_pendidikan } = req.params;
    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (!data) {
        return errorResponse(res, 403, "TOKEN_INVALID");
      } else {
        const user = await User.findOne({
          where: {
            id: data.id,
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const pendidikan = await Pendidikan.findOne({
          where: {
            uuid_pendidikan,
          },
          attributes: {
            exclude: ["updatedAt"],
          },
        });

        if (!pendidikan) {
          return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
        }

        await Pendidikan.destroy({
          where: {
            uuid_pendidikan,
          },
        });

        successRes(res, 200, "DELETE_PENDIDIKAN_SUCCESS");
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
