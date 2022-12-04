const joi = require("joi");
const uuid = require("uuid");
const {
  Penyedia,
  Pencari,
  Riwayat,
  Lowongan,
  Bidang_Kerja,
  User,
  Pengalaman,
  Ulasan,
} = require("../../models");
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

exports.getDaftarPelamar = async (req, res) => {
  try {
    const userLogin = req.user;

    const { id_lowongan } = req.params;

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const dataLowongan = await Lowongan.findOne({
      where: {
        id: id_lowongan,
        id_penyedia: penyedia.id,
        isPublish: true,
      },
      attributes: {
        exclude: ["id_penyedia", "id_bidang_kerja", "updatedAt"],
      },
    });

    if (!dataLowongan) {
      return errorResponse(res, 400, "LOWONGAN_NOT_FOUND");
    }

    const riwayat = await Riwayat.findAll({
      where: {
        id_lowongan: dataLowongan.id,
        info_riwayat: "applied",
        status: "diproses",
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: ["id", "id_bidang_kerja", "tanggal_lahir", "gender"],
          include: [
            {
              model: User,
              as: "users",
              attributes: [
                "nama_user",
                "uuid_user",
                "domisili_kota",
                "domisili_provinsi",
              ],
            },
            {
              model: Pengalaman,
              as: "pengalaman",
              attributes: ["id", "nama_pengalaman"],
            },
            {
              model: Ulasan,
              as: "ulasan",
              attributes: ["id", "rating"],
            },
          ],
        },
      ],
      attributes: ["id", "uuid_riwayat", "status", "createdAt", "info_riwayat"],
      order: [["id", "DESC"]],
    });

    successResWithData(res, 200, "SUCCESS_GET_DAFTAR_PELAMAR", riwayat);
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

// Done
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
          attributes: [
            "id",
            "uuid_lowongan",
            "gaji",
            "skala_gaji",
            "id_penyedia",
            "kota_lowongan",
            "provinsi_lowongan",
          ],
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["id", "nama_bidang", "detail_bidang"],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "uuid_riwayat",
        "status",
        "info_riwayat",
        "createdAt",
        "id_pencari",
      ],
      order: [["id", "DESC"]],
    });

    const newDataRiwayat = dataRiwayat.map((item) => {
      const { lowongan } = item;
      const { bidang_kerja } = lowongan;
      const { nama_bidang, detail_bidang, id } = bidang_kerja;
      return {
        ...item.dataValues,
        lowongan: {
          ...lowongan.dataValues,
          bidang_kerja: {
            nama_bidang,
            detail_bidang,
            photo:
              id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
          },
        },
      };
    });

    successResWithData(res, 200, "GET_ALL_LAMARAN_PENCARI_SUCCESS", newDataRiwayat);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getAllPelamar = async (req, res) => {
  try {
    const userLogin = req.user;

    const dataPenyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const lowonganData = await Lowongan.findAll({
      where: {
        id_penyedia: dataPenyedia.id,
      },
      include: [
        {
          model: Bidang_Kerja,
          as: "bidang_kerja",
          attributes: ["id", "nama_bidang", "detail_bidang"],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "id_bidang_kerja"],
      },
    });

    const lowonganWithPelamar = await Promise.all(
      lowonganData.map(async (item) => {
        const { bidang_kerja } = item;
        const { nama_bidang, detail_bidang, id } = bidang_kerja;

        const pelamar = await Riwayat.count({
          where: {
            id_lowongan: item.id,
            info_riwayat: "applied",
            status: "diproses",
          },
        });

        return {
          ...item.dataValues,
          bidang_kerja: {
            nama_bidang,
            detail_bidang,
            photo:
              id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
          },
          jumlah_pelamar: pelamar,
        };
      })
    );

    successResWithData(
      res,
      200,
      "GET_ALL_PELAMAR_SUCCESS",
      lowonganWithPelamar.filter((item) => item.jumlah_pelamar > 0)
    );
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
