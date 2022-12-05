const joi = require("joi");
const uuid = require("uuid");
const {
  Pencari,
  Riwayat,
  Lowongan,
  Penyedia,
  Bidang_Kerja,
  User,
  Pengalaman,
  Ulasan,
} = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");

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

    successResWithData(res, 200, "GET_ALL_TAWARKAN_PENCARI_SUCCESS", newDataRiwayat);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getAllTawaranTerkirim = async (req, res) => {
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
            info_riwayat: "hired",
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

exports.getDaftarTawaranTerkirim = async (req, res) => {
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
        info_riwayat: "hired",
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
                "uuid_user",
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
