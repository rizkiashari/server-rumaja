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
  Progres,
  Notifikasi,
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

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Maaf, Anda tidak lolos seleksi-pencari",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Anda menolak lamaran-penyedia",
    });

    await Notifikasi.create({
      detail_notifikasi:
        "Maaf, Anda tidak lolos seleksi, Silahkan mencari lowongan lainnya-pencari",
      isRead: false,
      id_riwayat: dataRiwayat.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_TOLAK_LAMARAN");
  } catch (error) {
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

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Selamat, Anda lolos seleksi-pencari",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Anda menerima lamaran pencari-penyedia",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Notifikasi.create({
      detail_notifikasi: "Selamat, Anda lolos seleksi, Silahkan hubungi penyedia-pencari",
      isRead: false,
      id_riwayat: dataRiwayat.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successResWithData(res, 200, "SUCCESS_TERIMA_LAMARAN", {
      uuid: uuid_riwayat,
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getDaftarPelamar = async (req, res) => {
  try {
    const userLogin = req.user;

    const { id_lowongan } = req.params;
    const { status } = req.query;

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

    if (status === "diproses") {
      const riwayat = await Riwayat.findAll({
        where: {
          id_lowongan: dataLowongan.id,
          info_riwayat: "applied",
          status: status,
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
    } else if (status === "bekerja") {
      const riwayat = await Riwayat.findAll({
        where: {
          id_lowongan: dataLowongan.id,
          status: status,
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
    } else {
      const riwayat = await Riwayat.findAll({
        where: {
          id_lowongan: dataLowongan.id,
          [Op.not]: [
            {
              status: ["diproses", "bekerja"],
            },
          ],
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
        attributes: [
          "id",
          "uuid_riwayat",
          "status",
          "createdAt",
          "info_riwayat",
          "tanggal_mulai_kerja",
        ],
        order: [["id", "DESC"]],
      });
      successResWithData(res, 200, "SUCCESS_GET_DAFTAR_PELAMAR", riwayat);
    }
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
            info_riwayat: "applied",
            status: "diproses",
          },
        });

        const createdAtRiwayat = await Riwayat.findAll({
          where: {
            id_lowongan: item.id,
            info_riwayat: "applied",
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

exports.getProgressLamaran = async (req, res) => {
  try {
    const { id_riwayat } = req.params;
    const { status } = req.query;

    console.log(id_riwayat);

    const dataRiwayat = await Riwayat.findOne({
      where: {
        id: id_riwayat,
        info_riwayat: "applied",
        status: status,
      },
      attributes: ["id", "status", "info_riwayat"],
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: {
            exclude: ["id_user", "id_bidang_kerja", "updatedAt"],
          },
          include: [
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

    if (!dataRiwayat) {
      return errorResponse(res, 400, "RIWAYAT_NOT_FOUND");
    }

    const dataProgress = await Progres.findAll({
      where: {
        id_riwayat: dataRiwayat.id,
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_PROGRESS_LAMARAN", {
      riwayat: dataRiwayat,
      progress: dataProgress,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.akhiriPekerjaan = async (req, res) => {
  try {
    const { id_riwayat } = req.params;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat: id_riwayat,
      },
    });

    await Riwayat.update(
      {
        status: "selesai",
        createdAt: Math.floor(+new Date() / 1000),
      },
      {
        where: {
          uuid_riwayat: id_riwayat,
        },
      }
    );

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Pekerjaan telah selesai-penyedia",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: dataRiwayat.id,
      informasi: "Kontrak anda telah diselesaikan-pencari",
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_AKHIRI_PEKERJAAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.dataProgressKerja = async (req, res) => {
  try {
    const { uuid_riwayat } = req.params;

    const dataRiwayat = await Riwayat.findOne({
      where: {
        uuid_riwayat,
      },

      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!dataRiwayat) {
      return errorResponse(res, 400, "RIWAYAT_NOT_FOUND");
    }

    const dataProgress = await Progres.findAll({
      where: {
        id_riwayat: dataRiwayat.id,
      },
      attributes: {
        exclude: ["updatedAt"],
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

    successResWithData(res, 200, "SUCCESS_GET_DATA_PROGRESS", {
      riwayat: dataRiwayat,
      progress: newDataProgress.filter((item) => item !== undefined),
    });
  } catch (error) {
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

    const dataRiwayat = await Riwayat.findOne({
      where: {
        id_pencari: dataPencari.id,
        id_lowongan: lamaran.id_lowongan,
        status: "diproses",
      },
    });

    if (dataRiwayat) {
      return errorResponse(res, 428, "PENCARI_ALREADY_APPLIED");
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

    const riwayat = await Riwayat.create({
      uuid_riwayat: uuid.v4(),
      status: lamaran.status_riwayat,
      info_riwayat: lamaran.info_riwayat,
      id_pencari: +dataPencari.id,
      id_lowongan: lamaran.id_lowongan,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Progres.create({
      id_riwayat: riwayat.id,
      informasi: "Lamaran anda berhasil terkirim-pencari",
      createdAt: Math.floor(+new Date() / 1000),
    });

    await Notifikasi.create({
      detail_notifikasi:
        "Lamaran anda berhasil terkirim, Silahkan cek riwayat lamaran anda-pencari",
      isRead: false,
      id_riwayat: riwayat.id,
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

// All Riwayat Bekerja
exports.getAllProgress = async (req, res) => {
  try {
    const userLogin = req.user;

    const { status } = req.query;

    if (userLogin.id_role === 3) {
      const penyedia = await Penyedia.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const lowonganData = await Lowongan.findAll({
        where: {
          id_penyedia: penyedia.id,
          isPublish: true,
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
              status:
                status === "bekerja"
                  ? "bekerja"
                  : {
                      [Op.or]: ["selesai", "ditolak"],
                    },
            },
          });

          const createdAtRiwayat = await Riwayat.findAll({
            where: {
              id_lowongan: item.id,
              status:
                status === "bekerja"
                  ? "bekerja"
                  : {
                      [Op.or]: ["selesai", "ditolak"],
                    },
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

      return successResWithData(
        res,
        200,
        "GET_ALL_PROGRESS_SUCCESS",
        lowonganWithPelamar.filter((item) => item.jumlah_pelamar > 0)
      );
    } else {
      const pencari = await Pencari.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const riwayatData = await Riwayat.findAll({
        where: {
          id_pencari: pencari.id,
          status:
            status === "bekerja"
              ? "bekerja"
              : {
                  [Op.or]: ["selesai", "ditolak"],
                },
        },
        include: [
          {
            model: Lowongan,
            as: "lowongan",
            attributes: {
              exclude: ["updatedAt", "id_bidang_kerja", "createdAt", "id_penyedia"],
            },
            include: [
              {
                model: Bidang_Kerja,
                as: "bidang_kerja",
                attributes: ["detail_bidang"],
              },
              {
                model: Penyedia,
                as: "penyedia",
                attributes: ["id"],
                include: [
                  {
                    model: User,
                    as: "users",
                    attributes: ["nama_user", "uuid_user"],
                  },
                ],
              },
            ],
          },
        ],
        attributes: {
          exclude: ["updatedAt", "id_lowongan", "id_pencari", "createdAt"],
        },
        order: [["createdAt", "DESC"]],
      });

      return successResWithData(res, 200, "GET_ALL_PROGRESS_SUCCESS", riwayatData);
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
