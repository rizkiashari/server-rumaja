const joi = require("joi");
const uuid = require("uuid");
const { Penyedia, Pencari, Riwayat, Lowongan, Bidang_Kerja, User } = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");

// Penyedia
// Done
exports.tolakLamaran = async (req, res) => {
  try {
    const dataTolak = req.body;
    const { uuid_riwayat } = req.params;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
      },
    });

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      catatan_riwayat_penyedia: joi.string().required(),
    });

    const { error } = schema.validate(dataTolak);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.update(
      {
        status: dataTolak.status_riwayat,
        catatan_riwayat_penyedia: dataTolak.catatan_riwayat_penyedia,
      },
      {
        where: {
          id: dataRiwayat.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_TOLAK_LAMARAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.terimaLamaran = async (req, res) => {
  try {
    const dataTerima = req.body;
    const { uuid_riwayat } = req.params;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
      },
    });

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      catatan_riwayat_penyedia: joi.string().required(),
      waktu_mulai_kerja: joi.string().required(),
      tanggal_mulai_kerja: joi.string().required(),
    });

    const { error } = schema.validate(dataTerima);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.update(
      {
        status: dataTerima.status_riwayat,
        catatan_riwayat_penyedia: dataTerima.catatan_riwayat_penyedia,
        waktu_mulai_kerja: dataTerima.waktu_mulai_kerja,
        tanggal_mulai_kerja: Math.floor(+new Date(dataTerima.tanggal_mulai_kerja) / 1000),
      },
      {
        where: {
          id: dataRiwayat.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_TERIMA_LAMARAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Pencari
// Done
exports.appliedPekerjaan = async (req, res) => {
  try {
    const lamaran = req.body;

    const userLogin = req.user;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!dataPencari) {
      return errorResponse(res, 400, "PENCARI_NOT_FOUND");
    }

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      info_riwayat: joi.string().required().valid("applied", "hired"),
      id_lowongan: joi.number().required(),
    });

    const { error } = schema.validate(lamaran);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.create({
      uuid_riwayat: uuid.v4(),
      status: lamaran.status_riwayat,
      info_riwayat: lamaran.info_riwayat,
      id_pencari: +dataPencari.id,
      id_lowongan: lamaran.id_lowongan,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_APPLIED_PEKERJAAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};


exports.getAllApplied = async (req, res) => {
  try {
    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const dataRiwayat = await Riwayat.findAll({
      where: {
        id_pencari: pencari.id,
        info_riwayat: "applied",
      },
      include: [
        {
          model: Lowongan,
          as: "lowongan",
          attributes: ["id", "gaji", "skala_gaji"],
        },
        {
          model: Pencari,
          as: "pencari",
          attributes: ["id_user"],
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
            },
            {
              model: User,
              as: "users",
              attributes: [
                "nama_user",
                "photo_profile",
                "domisili_kota",
                "domisili_provinsi",
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    successResWithData(
      res,
      200,
      "GET_ALL_LAMARAN_PENCARI_SUCCESS",
      dataRiwayat
    );
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};