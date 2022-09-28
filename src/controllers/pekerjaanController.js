const joi = require("joi");
const dotenv = require("dotenv");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Pekerjaan, Penyedia, User } = require("../../models");
const env = dotenv.config().parsed;

exports.getAllPekerjaan = async (req, res) => {
  try {
    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "UNAUTHORIZED");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (user.role !== 3) {
        return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
      }

      const dataPenyedia = await Penyedia.findOne({
        where: {
          user_id: user.id,
        },
      });

      const dataPekerjaan = await Pekerjaan.findAll({
        where: {
          id_penyedia: dataPenyedia.id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", dataPekerjaan);
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getByUUIDPekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

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
          include: {
            model: Penyedia,
            as: "penyedia",
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const dataPekerja = await Pekerjaan.findOne({
          where: {
            uuid_kerja,
          },
          attributes: {
            exclude: ["updatedAt"],
          },
        });

        if (!dataPekerja) {
          return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
        }

        successResWithData(res, 200, "LIST_PEKERJAAN", dataPekerja);
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.addPekerjaan = async (req, res) => {
  try {
    const dataPekerjaan = req.body;

    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (user.role !== 3) {
        return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
      }

      const dataPenyedia = await Penyedia.findOne({
        where: {
          user_id: user.id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
      });

      if (!dataPenyedia) {
        return errorResponse(res, 404, "PENYEDIA_NOT_FOUND");
      }

      const schema = joi.object({
        posisi_kerja: joi.string().min(3).required(),
        range_awal_gaji: joi.string().required(),
        range_akhir_gaji: joi.string().required(),
        fasilitas: joi.string().required(),
        kualifikasi: joi.string().min(8).required(),
        id_bidang_kerja: joi.number().required(),
        deskripsi_kerja: joi.string().required(),
        lokasi_kerja: joi.string().optional(),
        lamar_sebelum_tgl: joi.string().required(),
      });

      const { error } = schema.validate(dataPekerjaan);
      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }

      const newPekerjaan = new Pekerjaan({
        uuid_kerja: uuid.v4(),
        posisi_kerja: dataPekerjaan.posisi_kerja,
        range_awal_gaji: dataPekerjaan.range_awal_gaji,
        range_akhir_gaji: dataPekerjaan.range_akhir_gaji,
        kualifikasi: dataPekerjaan.kualifikasi,
        id_penyedia: dataPenyedia.id,
        id_bidang_kerja: dataPekerjaan.id_bidang_kerja,
        deskripsi_kerja: dataPekerjaan.deskripsi_kerja,
        lokasi_kerja: dataPekerjaan.lokasi_kerja,
        isSave: false,
        lamar_sebelum_tgl: dataPekerjaan.lamar_sebelum_tgl,
        createdAt: Math.floor(+new Date() / 1000),
        fasilitas: dataPekerjaan.fasilitas,
      });

      await newPekerjaan.save();

      successResWithData(res, 200, "SUCCESS_ADD_PEKERJAAN", dataPenyedia);
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.editPekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

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
          include: {
            model: Penyedia,
            as: "penyedia",
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const dataPekerja = await Pekerjaan.findOne({
          where: {
            uuid_kerja,
          },
        });

        if (!dataPekerja) {
          return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
        }

        await Pekerjaan.update(req.body, {
          where: {
            uuid_kerja,
          },
        });

        successRes(res, 200, "SUCCESS_EDIT_PEKERJAAN");
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.deletePekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

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
          include: {
            model: Penyedia,
            as: "penyedia",
          },
        });

        if (!user) {
          return errorResponse(res, 404, "USER_NOT_FOUND");
        }

        const dataPekerja = await Pekerjaan.findOne({
          where: {
            uuid_kerja,
          },
        });

        if (!dataPekerja) {
          return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
        }

        await Pekerjaan.destroy({
          where: {
            uuid_kerja,
          },
        });

        successRes(res, 200, "SUCCESS_DELETE_PEKERJAAN");
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
