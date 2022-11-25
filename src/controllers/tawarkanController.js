const joi = require("joi");
const uuid = require("uuid");
const { Penyedia, Pencari, Riwayat, Lowongan, User, Bidang_Kerja } = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");
const riwayat = require("../../models/riwayat");

// Done
exports.tawarkanPekerjaan = async (req, res) => {
  try {
    const dataTerima = req.body;

    const schema = joi.object({
      status_riwayat: joi
        .string()
        .required()
        .valid("diproses", "bekerja", "selesai", "ditolak"),
      info_riwayat: joi.string().required().valid("applied", "hired"),
      catatan_riwayat_penyedia: joi.string().required(),
      waktu_mulai_kerja: joi.string().required(),
      tanggal_mulai_kerja: joi.string().required(),
      id_pencari: joi.number().required(),
      id_lowongan: joi.number().required(),
    });

    const { error } = schema.validate(dataTerima);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.create({
      uuid_riwayat: uuid.v4(),
      status: dataTerima.status_riwayat,
      info_riwayat: dataTerima.info_riwayat,
      catatan_riwayat_penyedia: dataTerima.catatan_riwayat_penyedia,
      waktu_mulai_kerja: dataTerima.waktu_mulai_kerja,
      tanggal_mulai_kerja: Math.floor(new Date(dataTerima.tanggal_mulai_kerja) / 1000),
      id_pencari: dataTerima.id_pencari,
      id_lowongan: dataTerima.id_lowongan,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_TAWARKAN_PEKERJAAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};


exports.getAllTawarkan = async (req, res) => {
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
        info_riwayat: "hired",
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
              as: "bidang_kerja"
            },
            {
              model: User,
              as: "users",
              attributes: ["nama_user", "photo_profile", "domisili_kota", "domisili_provinsi"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    
    successResWithData(res, 200, "GET_ALL_TAWARKAN_PENCARI_SUCCESS", dataRiwayat);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getAllTawarkan = async (req, res) => {
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
        info_riwayat: "hired",
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
              as: "bidang_kerja"
            },
            {
              model: User,
              as: "users",
              attributes: ["nama_user", "photo_profile", "domisili_kota", "domisili_provinsi"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    
    successResWithData(res, 200, "GET_ALL_TAWARKAN_PENCARI_SUCCESS", dataRiwayat);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};