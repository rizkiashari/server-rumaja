const joi = require("joi");
const { Op } = require("sequelize");
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
  Progres,
  Notifikasi,
} = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");

// Penyedia
// Done
exports.tawarkanPekerjaan = async (req, res) => {
  try {
    const dataTerima = req.body;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        id_pencari: dataTerima.id_pencari,
        id_lowongan: dataTerima.id_lowongan,
        status: {
          [Op.or]: ["diproses", "bekerja"],
        },
        info_riwayat: {
          [Op.or]: ["applied", "hired"],
        },
      },
    });

    if (dataRiwayat) {
      return errorResponse(res, 428, "PENCARI_ALREADY_HIRED");
    }

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

    const riwayat = await Riwayat.create({
      uuid_riwayat: uuid.v4(),
      status: dataTerima.status_riwayat,
      info_riwayat: dataTerima.info_riwayat,
      catatan_riwayat_penyedia: dataTerima.catatan_riwayat_penyedia,
      waktu_mulai_kerja: dataTerima.waktu_mulai_kerja,
      tanggal_mulai_kerja: Math.floor(new Date(dataTerima.tanggal_mulai_kerja) / 1000),
      id_pencari: dataTerima.id_pencari,
      id_lowongan: dataTerima.id_lowongan,
      createdAt: Math.floor(+new Date() / 1000),
      temp_status: "menunggu_pencari",
    });

    await Progres.create({
      id_riwayat: riwayat.id,
      informasi: "Mengirimkan Tawaran-penyedia",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: riwayat.id,
      informasi: "Menunggu konfirmasi kandidat-penyedia",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Notifikasi.create({
      detail_notifikasi:
        "Penyedia telah mengirimkan tawaran pekerjaan, silahkan cek riwayat pekerjaan anda untuk melihat detailnya-pencari",
      isRead: false,
      id_riwayat: riwayat.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_TAWARKAN_PEKERJAAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
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
        exclude: ["updatedAt", "id_bidang_kerja", "createdAt"],
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

        const createdAtRiwayat = await Riwayat.findAll({
          where: {
            id_lowongan: item.id,
            info_riwayat: "hired",
            status: "diproses",
          },
          attributes: ["createdAt"],
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
          createdAtRiwayat: createdAtRiwayat[0],
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

// Done
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

// Done
exports.getProgressTawaranTerkirim = async (req, res) => {
  try {
    const { id_riwayat } = req.params;
    const { status } = req.query;

    const riwayat = await Riwayat.findOne({
      where: {
        id: id_riwayat,
        info_riwayat: "hired",
        status: status,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: ["id", "gender", "tanggal_lahir"],
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["detail_bidang", "id"],
            },
            {
              model: User,
              as: "users",
              attributes: ["nama_user", "uuid_user"],
            },
            {
              model: Ulasan,
              as: "ulasan",
              attributes: ["id", "rating"],
            },
          ],
        },
      ],
    });

    if (!riwayat) {
      return errorResponse(res, 400, "RIWAYAT_NOT_FOUND");
    }

    const newDataRiwayat = {
      ...riwayat.dataValues,
      pencari: {
        ...riwayat.pencari.dataValues,
        bidang_kerja: {
          detail_bidang: riwayat.pencari.bidang_kerja.detail_bidang,
          photo:
            riwayat.pencari.bidang_kerja.id === 1
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
              : riwayat.pencari.bidang_kerja.id === 2
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
              : riwayat.pencari.bidang_kerja.id === 3
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
              : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
        },
      },
    };

    const dataProgress = await Progres.findAll({
      where: {
        id_riwayat: riwayat.id,
      },
      attributes: {
        exclude: ["id_riwayat", "updatedAt"],
      },
    });

    const newDataProgress = dataProgress.map((item) => {
      const penyedia = item.informasi.split("-");

      if (penyedia[1] === "penyedia") {
        return {
          ...item.dataValues,
        };
      }
    });

    successResWithData(res, 200, "SUCCESS_GET_PROGRESS", {
      riwayat: newDataRiwayat,
      progress: newDataProgress.filter((item) => item !== undefined),
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Pencari
// Done
exports.tolakTawaran = async (req, res) => {
  try {
    const dataTolak = req.body;
    const { uuid_riwayat } = req.params;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
      },
    });

    const schema = joi.object({
      catatan_tolak_pencari: joi.string().required(),
    });

    const { error } = schema.validate(dataTolak);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await Riwayat.update(
      {
        status: "ditolak",
        catatan_tolak_pencari: dataTolak.catatan_tolak_pencari,
      },
      {
        where: {
          id: dataRiwayat.id,
        },
      }
    );

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Kandidat menolak-penyedia",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Anda menolak tawaran-pencari",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Notifikasi.create({
      detail_notifikasi:
        "Maaf, Tawaran Anda ditolak oleh pelamar, silahkan mencari pelamar lainnya-penyedia",
      isRead: false,
      id_riwayat: dataRiwayat.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_TOLAK_TAWARAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.terimaTawaran = async (req, res) => {
  try {
    const { uuid_riwayat } = req.params;

    const userLogin = req.user;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
      },
    });

    if (userLogin.id_role === 2) {
      await Riwayat.update(
        {
          temp_status: "menunggu",
        },
        {
          where: {
            id: dataRiwayat.id,
          },
        }
      );
      await Progres.create({
        id_riwayat: dataRiwayat.id,
        informasi: "Kandidat menerima-penyedia",
        createdAt: Math.floor(+new Date() / 1000),
      });

      await Progres.create({
        id_riwayat: dataRiwayat.id,
        informasi: "Menunggu anda memulai pekerjaan-penyedia",
        createdAt: Math.floor(+new Date() / 1000),
      });

      await Progres.create({
        id_riwayat: dataRiwayat.id,
        informasi: "Konfirmasi terkirim-pencari",
        createdAt: Math.floor(+new Date() / 1000),
      });

      await Progres.create({
        id_riwayat: dataRiwayat.id,
        informasi: "Menunggu penyedia memulai pekerjaan-pencari",
        createdAt: Math.floor(+new Date() / 1000),
      });

      await Notifikasi.create({
        detail_notifikasi:
          "Tawaran anda diterima oleh pelamar, mohon segera memperbarui status tawaran ke halaman progres & segera hubungi kandidat melalui kontak yang tertera-penyedia",
        isRead: false,
        id_riwayat: dataRiwayat.id,
        createdAt: Math.floor(+new Date() / 1000),
      });
    }

    successRes(res, 200, "SUCCESS_TERIMA_TAWARAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.detailTawaranPekerjaan = async (req, res) => {
  try {
    const { uuid_riwayat } = req.params;

    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const riwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
        id_pencari: pencari.id,
        info_riwayat: "hired",
      },
      attributes: {
        exclude: [
          "catatan_riwayat_pencari",
          "info_riwayat",
          "id_lowongan",
          "updatedAt",
          "id_pencari",
        ],
      },
      include: [
        {
          model: Lowongan,
          as: "lowongan",
          attributes: {
            exclude: ["id_penyedia", "updatedAt", "id_bidang_kerja"],
          },
          include: [
            {
              model: Penyedia,
              as: "penyedia",
              attributes: ["id"],
              include: [
                {
                  model: User,
                  as: "users",
                  attributes: ["uuid_user", "nama_user", "nomor_wa", "photo_profile"],
                },
              ],
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["id", "detail_bidang"],
            },
          ],
        },
      ],
    });

    const progresData = await Progres.findAll({
      where: {
        id_riwayat: riwayat?.id,
      },
    });

    const newRiwayat = {
      ...riwayat.dataValues,
      lowongan: {
        ...riwayat.dataValues.lowongan.dataValues,
        penyedia: {
          ...riwayat.dataValues.lowongan.dataValues.penyedia.dataValues,
        },
        bidang_kerja: {
          detail_bidang:
            riwayat.dataValues.lowongan.dataValues.bidang_kerja.detail_bidang,
          photo:
            riwayat.dataValues.lowongan.dataValues.bidang_kerja.id === 1
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
              : riwayat.dataValues.lowongan.dataValues.bidang_kerja.id === 2
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
              : riwayat.dataValues.lowongan.dataValues.bidang_kerja.id === 3
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
              : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
        },
      },
      progres: progresData
        ?.map((item) => {
          const pencari = item.informasi.split("-");
          if (pencari[1] === "pencari") {
            return {
              ...item.dataValues,
              informasi: pencari[0],
            };
          }
        })
        .filter((item) => item !== undefined),
    };

    successResWithData(res, 200, "SUCCESS_GET_DETAIL_TAWARAN_PEKERJAAN", newRiwayat);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getAllTawarkanProses = async (req, res) => {
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
        status: "diproses",
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

exports.dataProgressPencari = async (req, res) => {
  try {
    const userLogin = req.user;
    const { status } = req.query;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const dataRiwayat = await Riwayat.findAll({
      where: {
        id_pencari: pencari.id,
        status: {
          [Op.or]: status === "bekerja" ? ["bekerja"] : ["ditolak", "selesai"],
        },
      },
      attributes: [
        "id",
        "uuid_riwayat",
        "status",
        "createdAt",
        "tanggal_mulai_kerja",
        "id_pencari",
      ],
      include: [
        {
          model: Lowongan,
          as: "lowongan",
          attributes: [
            "id",
            "uuid_lowongan",
            "gaji",
            "skala_gaji",
            "kota_lowongan",
            "provinsi_lowongan",
          ],
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["id", "detail_bidang"],
            },
          ],
        },
      ],
    });

    const newDataRiwayat = dataRiwayat.map((item) => {
      return {
        ...item.dataValues,
        lowongan: {
          ...item.dataValues.lowongan.dataValues,
          bidang_kerja: {
            detail_bidang: item.dataValues.lowongan.dataValues.bidang_kerja.detail_bidang,
            photo:
              item.dataValues.lowongan.dataValues.bidang_kerja.id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : item.dataValues.lowongan.dataValues.bidang_kerja.id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : item.dataValues.lowongan.dataValues.bidang_kerja.id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
          },
        },
      };
    });

    successResWithData(res, 200, "SUCCESS_GET_DATA_PROGRESS_PENCARI", newDataRiwayat);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
