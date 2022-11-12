const joi = require("joi");
const { Penyedia, Pencari, Riwayat, Lowongan } = require("../../models");
const {
  errorResponse,
  successResWithData,
  successRes,
} = require("../helper/response");
const { Op } = require("sequelize");

exports.tolakLamaran = async (req, res) => {
  try {
    const dataTolak = req.body;

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      info_riwayat: joi.string().required().valid("applied", "hired"),
      catatan_riwayat: joi.string().required(),
      id_pencari: joi.number().required(),
      id_lowongan: joi.number().required(),
    });

    const { error } = schema.validate(dataTolak);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.create(
      {
        status: dataTolak.status_riwayat,
        info_riwayat: dataTolak.info_riwayat,
        catatan_riwayat: dataTolak.catatan_riwayat,
        id_pencari: dataTolak.id_pencari,
        id_lowongan: dataTolak.id_lowongan,
        createdAt: Math.floor(+new Date() / 1000),
      },
      {
        where: {
          id: dataTolak.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_TOLAK_LAMARAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.tawarkanPekerjaan = async (req, res) => {
  try {
    const dataTerima = req.body;

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      info_riwayat: joi.string().required().valid("applied", "hired"),
      catatan_riwayat: joi.string().required(),
      waktu_mulai_kerja: joi.string().required(),
      tanggal_mulai_kerja: joi.string().required(),
      id_pencari: joi.number().required(),
      id_lowongan: joi.number().required(),
    });

    const { error } = schema.validate(dataTerima);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.create(
      {
        status: dataTerima.status_riwayat,
        info_riwayat: dataTerima.info_riwayat,
        catatan_riwayat: dataTerima.catatan_riwayat,
        waktu_mulai_kerja: dataTerima.waktu_mulai_kerja,
        tanggal_mulai_kerja: Math.floor(
          new Date(dataTerima.tanggal_mulai_kerja) / 1000
        ),
        id_pencari: dataTerima.id_pencari,
        id_lowongan: dataTerima.id_lowongan,
        createdAt: Math.floor(+new Date() / 1000),
      },
      {
        where: {
          id: dataTerima.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_TAWARK");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
