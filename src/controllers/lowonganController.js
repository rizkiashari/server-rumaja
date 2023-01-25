const joi = require("joi");
const uuid = require("uuid");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const {
  Lowongan,
  Penyedia,
  Bidang_Kerja,
  Simpan_Lowongan,
  Pencari,
  Riwayat,
  User,
} = require("../../models");
const { Op } = require("sequelize");

// Penyedia
// Done
exports.addLowongan = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataLowongan = req.body;

    if (userLogin.id_role !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const dataPenyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!dataPenyedia) {
      return errorResponse(res, 404, "PENYEDIA_NOT_FOUND");
    }

    const schema = joi.object({
      gaji: joi.number().required(),
      skala_gaji: joi.string().valid("hari", "minggu", "bulan").required(),
      kualifikasi: joi.string().required(),
      fasilitas: joi.string().required(),
      id_bidang_kerja: joi.number().required(),
      deskripsi_lowongan: joi.string().required(),
      kota_lowongan: joi.string().required(),
      provinsi_lowongan: joi.string().required(),
      alamat_lengkap: joi.string().required(),
    });

    const { error } = schema.validate(dataLowongan);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const newPekerjaan = new Lowongan({
      uuid_lowongan: uuid.v4(),
      gaji: +dataLowongan.gaji,
      skala_gaji: dataLowongan.skala_gaji,
      kualifikasi: dataLowongan.kualifikasi,
      isPublish: true,
      deskripsi_lowongan: dataLowongan.deskripsi_lowongan,
      fasilitas: dataLowongan.fasilitas,
      kota_lowongan: dataLowongan.kota_lowongan,
      provinsi_lowongan: dataLowongan.provinsi_lowongan,
      alamat_lengkap: dataLowongan.alamat_lengkap,
      id_bidang_kerja: dataLowongan.id_bidang_kerja,
      id_penyedia: dataPenyedia.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newPekerjaan.save();

    successRes(res, 200, "SUCCESS_ADD_LOWONGAN");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.editLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;

    const dataPekerja = await Lowongan.findOne({
      where: {
        uuid_lowongan,
      },
    });

    if (!dataPekerja) {
      return errorResponse(res, 404, "LOWONGAN_NOT_FOUND");
    }

    await Lowongan.update(req.body, {
      where: {
        uuid_lowongan,
      },
    });

    successRes(res, 200, "SUCCESS_EDIT_LOWONGAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getAllLowongan = async (req, res) => {
  try {
    const userLogin = req.user;

    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const dataPenyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const { bidang_kerja, jenis_gaji, urutan, publish } = req.query;

    if (userLogin.id_role !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const tempUrutan = [];

    if (urutan === "terbaru") {
      tempUrutan = ["id", "DESC"];
    }

    if (urutan === "gaji") {
      tempUrutan = ["gaji", "DESC"];
    }

    if (!bidang_kerja && !jenis_gaji) {
      const totalRows = await Lowongan.count({
        where: {
          isPublish: publish === "publish" ? 1 : 0,
          id_penyedia: dataPenyedia.id,
        },
      });
      const totalPage = Math.ceil(totalRows / limit);

      const dataLowongan = await Lowongan.findAll({
        where: {
          isPublish: publish === "publish" ? 1 : 0,
          id_penyedia: dataPenyedia.id,
        },
        include: [
          {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: ["nama_bidang", "detail_bidang", "id"],
          },
        ],
        attributes: {
          exclude: ["updatedAt"],
        },
        limit: [(page - 1) * +limit, +limit],
        order: [urutan ? tempUrutan : ["id", "DESC"]],
      });

      const newLowongan = dataLowongan.map((item) => {
        return {
          ...item.dataValues,
          bidang_kerja: {
            ...item.bidang_kerja.dataValues,
            photo:
              item.bidang_kerja.id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : item.bidang_kerja.id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : item.bidang_kerja.id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
          },
        };
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_LOWONGAN", {
        lowongan: newLowongan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    } else {
      const totalRows = await Lowongan.count({
        where: {
          isPublish: publish === "publish" ? 1 : 0,
          id_penyedia: dataPenyedia.id,
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              skala_gaji: {
                [Op.eq]: jenis_gaji,
              },
            },
          ],
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const dataLowongan = await Lowongan.findAll({
        where: {
          isPublish: publish === "publish" ? 1 : 0,
          id_penyedia: dataPenyedia.id,
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              skala_gaji: {
                [Op.eq]: jenis_gaji,
              },
            },
          ],
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        limit: [(page - 1) * +limit, +limit],
        order: [urutan ? tempUrutan : ["id", "DESC"]],
      });

      const newLowongan = dataLowongan.map((item) => {
        return {
          ...item.dataValues,
          bidang_kerja: {
            ...item.bidang_kerja.dataValues,
            photo:
              item.bidang_kerja.id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : item.bidang_kerja.id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : item.bidang_kerja.id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
          },
        };
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_LOWONGAN", {
        lowongan: newLowongan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.deleteLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;

    const dataLowongan = await Lowongan.findOne({
      where: {
        uuid_lowongan,
      },
    });

    if (!dataLowongan) {
      return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
    }

    await Lowongan.destroy({
      where: {
        uuid_lowongan,
      },
    });

    successRes(res, 200, "SUCCESS_DELETE_PEKERJAAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.publishLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;

    const dataLowongan = await Lowongan.findOne({
      where: {
        uuid_lowongan,
      },
    });

    if (!dataLowongan) {
      return errorResponse(res, 404, "LOWONGAN_NOT_FOUND");
    }

    if (dataLowongan.isPublish) {
      await Lowongan.update(
        {
          isPublish: false,
        },
        {
          where: {
            uuid_lowongan,
          },
        }
      );

      successRes(res, 200, "SUCCESS_UNPUBLISH_LOWONGAN");
    } else {
      await Lowongan.update(
        {
          isPublish: true,
        },
        {
          where: {
            uuid_lowongan,
          },
        }
      );

      successRes(res, 200, "SUCCESS_PUBLISH_LOWONGAN");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
// End

// Pencari
// Done
exports.saveLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;
    const userLogin = req.user;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (userLogin.id_role === 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENCARI");
    }

    const dataLowongan = await Lowongan.findOne({
      where: {
        uuid_lowongan,
      },
      include: [
        {
          model: Simpan_Lowongan,
          as: "simpan_lowongan",
        },
      ],
    });

    if (!dataLowongan) {
      return errorResponse(res, 404, "LOWONGAN_NOT_FOUND");
    }

    // if (dataLowongan.simpan_lowongan) {
    //   return errorResponse(res, 403, "LOWONGAN_ALREADY_SAVED");
    // }

    await Simpan_Lowongan.create({
      uuid_simpan: uuid.v4(),
      id_pencari: dataPencari.id,
      id_lowongan: dataLowongan.id,
      isSave: true,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "SUCCESS_SAVE_LOWONGAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.deleteSaveLowongan = async (req, res) => {
  try {
    const { uuid_simpan } = req.params;
    const userLogin = req.user;

    if (userLogin.id_role === 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENCARI");
    }

    const dataSimpan = await Simpan_Lowongan.findOne({
      where: {
        uuid_simpan,
      },
    });

    if (!dataSimpan) {
      return errorResponse(res, 404, "LOWONGAN_TERSIMPAN_NOT_FOUND");
    }

    await Simpan_Lowongan.destroy({
      where: {
        uuid_simpan,
      },
    });

    successRes(res, 200, "SUCCESS_DELETE_SAVE_LOWONGAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.rekomendasiLowongan = async (req, res) => {
  try {
    const { bidang_kerja, gaji } = req.query;

    const userLogin = req.user;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;

    const totalRows = await Lowongan.count({
      where: {
        [Op.and]: [
          {
            id_bidang_kerja: {
              [Op.eq]: `${bidang_kerja ? +bidang_kerja : ""}`,
            },
          },
          {
            gaji: {
              [Op.gte]: `${gaji ? +gaji : ""}`,
            },
          },
        ],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const dataLowongan = await Lowongan.findAll({
      attributes: {
        exclude: ["updatedAt", "id_bidang_kerja"],
      },
      include: [
        {
          model: Bidang_Kerja,
          as: "bidang_kerja",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            id_bidang_kerja: {
              [Op.eq]: `${bidang_kerja ? +bidang_kerja : ""}`,
            },
          },
          {
            gaji: {
              [Op.gte]: `${gaji ? +gaji : ""}`,
            },
          },
          {
            isPublish: true,
          },
        ],
      },
      limit: [(page - 1) * +limit, +limit],
      order: [["id", "DESC"]],
    });

    const newLowongan = await Promise.all(
      dataLowongan.map(async (lowongan) => {
        const dataSimpan = await Simpan_Lowongan.findOne({
          where: {
            id_pencari: dataPencari.id,
            id_lowongan: lowongan.id,
          },
        });

        return {
          ...lowongan.dataValues,
          simpan_lowongan: dataSimpan ? dataSimpan.dataValues : null,
        };
      })
    );

    successResWithData(res, 200, "SUCCESS_GET_REKOMENDASI_LOWONGAN", {
      lowongan: newLowongan,
      totalPage,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getLowonganByBidangKerja = async (req, res) => {
  try {
    const userLogin = req.user;
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    const { bidang_kerja } = req.params;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const { jenis_gaji, urutan } = req.query;

    let tempUrutan = [];

    if (urutan === "Terbaru") {
      tempUrutan = ["id", "DESC"];
    }

    if (urutan === "GajiTertinggi") {
      tempUrutan = ["gaji", "DESC"];
    }

    if (!jenis_gaji) {
      const totalRows = await Lowongan.count({
        where: {
          id_bidang_kerja: bidang_kerja,
          isPublish: true,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const dataLowongan = await Lowongan.findAll({
        attributes: {
          exclude: ["updatedAt", "id_bidang_kerja"],
        },
        where: {
          id_bidang_kerja: bidang_kerja,
          isPublish: true,
        },
        include: [
          {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        limit: [(page - 1) * +limit, +limit],
        order: [urutan ? tempUrutan : ["id", "ASC"]],
      });

      const newLowongan = await Promise.all(
        dataLowongan.map(async (lowongan) => {
          const dataSimpan = await Simpan_Lowongan.findOne({
            where: {
              id_pencari: dataPencari.id,
              id_lowongan: lowongan.id,
            },

            attributes: {
              exclude: ["updatedAt", "id_pencari", "id_lowongan"],
            },
          });

          return {
            ...lowongan.dataValues,
            simpan_lowongan: dataSimpan ? dataSimpan.dataValues : null,
          };
        })
      );

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
        lowongan: newLowongan,
        totalPage,
        page,
        limit,
        totalRows,
      });
    } else {
      if (jenis_gaji) {
        const totalRows = await Lowongan.count({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: jenis_gaji,
                },
              },
              {
                isPublish: true,
              },
            ],
          },
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataLowongan = await Lowongan.findAll({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: jenis_gaji,
                },
              },
              {
                isPublish: true,
              },
            ],
          },
          attributes: {
            exclude: ["updatedAt", "id_bidang_kerja"],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          limit: [(page - 1) * +limit, +limit],
          order: [urutan ? tempUrutan : ["id", "ASC"]],
        });

        const newLowongan = await Promise.all(
          dataLowongan.map(async (lowongan) => {
            const dataSimpan = await Simpan_Lowongan.findOne({
              where: {
                id_pencari: dataPencari.id,
                id_lowongan: lowongan.id,
              },
              attributes: {
                exclude: ["updatedAt", "id_pencari", "id_lowongan"],
              },
            });

            return {
              ...lowongan.dataValues,
              simpan_lowongan: dataSimpan ? dataSimpan.dataValues : null,
            };
          })
        );

        successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
          lowongan: newLowongan,
          totalPage,
          page,
          limit,
          totalRows,
        });
      } else {
        const totalRows = await Lowongan.count({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                isPublish: true,
              },
              {
                [Op.or]: [
                  {
                    skala_gaji: {
                      [Op.eq]: jenis_gaji,
                    },
                  },
                ],
              },
            ],
          },
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataLowongan = await Lowongan.findAll({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                isPublish: true,
              },
              {
                [Op.or]: [
                  {
                    skala_gaji: {
                      [Op.eq]: jenis_gaji,
                    },
                  },
                ],
              },
            ],
          },
          attributes: {
            exclude: ["updatedAt", "id_bidang_kerja"],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          limit: [(page - 1) * +limit, +limit],
          order: [urutan ? tempUrutan : ["id", "ASC"]],
        });

        const newLowongan = await Promise.all(
          dataLowongan.map(async (lowongan) => {
            const dataSimpan = await Simpan_Lowongan.findOne({
              where: {
                id_pencari: dataPencari.id,
                id_lowongan: lowongan.id,
              },
              attributes: {
                exclude: ["updatedAt", "id_pencari", "id_lowongan"],
              },
            });

            return {
              ...lowongan.dataValues,
              simpan_lowongan: dataSimpan ? dataSimpan.dataValues : null,
            };
          })
        );

        successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
          lowongan: newLowongan,
          totalPage,
          page,
          limit,
          totalRows,
        });
      }
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getSaveLowongan = async (req, res) => {
  try {
    const userLogin = req.user;
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const { bidang_kerja, skala_gaji, urutan } = req.query;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    let tempUrutan = [];

    if (urutan === "Terbaru") {
      tempUrutan = ["id", "DESC"];
    }
    if (urutan === "GajiTertinggi") {
      tempUrutan = ["gaji", "DESC"];
    }

    if (!bidang_kerja && !skala_gaji) {
      const totalRows = await Simpan_Lowongan.count({});

      const totalPage = Math.ceil(totalRows / limit);

      const dataSimpanLowongan = await Lowongan.findAll({
        attributes: {
          exclude: ["updatedAt", "id_bidang_kerja"],
        },
        include: [
          {
            model: Simpan_Lowongan,
            as: "simpan_lowongan",
            attributes: {
              exclude: ["createdAt", "updatedAt", "id"],
            },
            where: {
              id_pencari: dataPencari.id,
            },
          },
          {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        limit: [(page - 1) * +limit, +limit],
        order: [urutan ? tempUrutan : ["id", "ASC"]],
      });
      successResWithData(res, 200, "SUCCESS_GET_SAVE_PEKERJAAN", {
        lowongan: dataSimpanLowongan,
        totalPage,
        page,
        limit,
        totalRows,
      });
    } else {
      if (bidang_kerja && skala_gaji) {
        const totalRows = await Lowongan.count({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: skala_gaji,
                },
              },
            ],
          },
          include: [
            {
              model: Simpan_Lowongan,
              as: "simpan_lowongan",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id"],
              },
              where: {
                id_pencari: dataPencari.id,
              },
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataSimpanLowongan = await Lowongan.findAll({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: skala_gaji,
                },
              },
            ],
          },
          include: [
            {
              model: Simpan_Lowongan,
              as: "simpan_lowongan",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id"],
              },
              where: {
                id_pencari: dataPencari.id,
              },
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          order: [urutan ? tempUrutan : ["id", "ASC"]],
          attributes: {
            exclude: ["updatedAt", "id_bidang_kerja"],
          },
          limit: [(page - 1) * +limit, +limit],
        });
        successResWithData(res, 200, "SUCCESS_GET_SAVE_PEKERJAAN", {
          lowongan: dataSimpanLowongan,
          totalPage,
          page,
          limit,
          totalRows,
        });
      } else {
        const totalRows = await Lowongan.count({
          where: {
            [Op.or]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: skala_gaji,
                },
              },
            ],
          },
          include: [
            {
              model: Simpan_Lowongan,
              as: "simpan_lowongan",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id"],
              },
              where: {
                id_pencari: dataPencari.id,
              },
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataSimpanLowongan = await Lowongan.findAll({
          where: {
            [Op.or]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                skala_gaji: {
                  [Op.eq]: skala_gaji,
                },
              },
            ],
          },
          include: [
            {
              model: Simpan_Lowongan,
              as: "simpan_lowongan",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id"],
              },
              where: {
                id_pencari: dataPencari.id,
              },
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          order: [urutan ? tempUrutan : ["id", "ASC"]],
          attributes: {
            exclude: ["updatedAt", "id_bidang_kerja"],
          },
          limit: [(page - 1) * +limit, +limit],
        });
        successResWithData(res, 200, "SUCCESS_GET_SAVE_PEKERJAAN", {
          lowongan: dataSimpanLowongan,
          totalPage,
          page,
          limit,
          totalRows,
        });
      }
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
// End

// Global
// Done
exports.listsLayanan = async (req, res) => {
  try {
    const dataLayanan = await Bidang_Kerja.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_LISTS_LAYANAN", dataLayanan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getByUUIDLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;
    const userLogin = req.user;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (userLogin.id_role === 2) {
      const dataLowongan = await Lowongan.findOne({
        where: {
          uuid_lowongan,
        },
        attributes: {
          exclude: ["updatedAt", "id_bidang_kerja", "id_penyedia"],
        },
        include: [
          {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: ["nama_bidang", "detail_bidang", "id"],
          },
          {
            model: Penyedia,
            as: "penyedia",
            attributes: ["id"],
            include: [
              {
                model: User,
                as: "users",
                attributes: ["nama_user", "nomor_wa", "photo_profile", "uuid_user"],
              },
            ],
          },
        ],
      });

      if (!dataLowongan) {
        return errorResponse(res, 404, "LOWONGAN_NOT_FOUND");
      }

      const riwayat = await Riwayat.findOne({
        where: {
          id_lowongan: dataLowongan.id,
          id_pencari: dataPencari.id,
        },
        attributes: [
          "waktu_mulai_kerja",
          "tanggal_mulai_kerja",
          "catatan_riwayat_penyedia",
          "createdAt",
        ],
      });

      const simpanLowongan = await Simpan_Lowongan.findOne({
        where: {
          id_lowongan: dataLowongan.id,
          id_pencari: dataPencari.id,
        },
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      });

      const mergeLowongan = {
        ...dataLowongan.dataValues,
        bidang_kerja: {
          ...dataLowongan.bidang_kerja.dataValues,
          photo:
            dataLowongan.bidang_kerja.id === 1
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
              : dataLowongan.bidang_kerja.id === 2
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
              : dataLowongan.bidang_kerja.id === 3
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
              : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
        },
        simpan_lowongan: simpanLowongan,
        riwayat: riwayat,
      };

      successResWithData(res, 200, "LIST_LOWONGAN", mergeLowongan);
    } else {
      const dataLowongan = await Lowongan.findOne({
        where: {
          uuid_lowongan,
        },
        attributes: {
          exclude: ["updatedAt", "id_bidang_kerja"],
        },
        include: [
          {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: ["nama_bidang", "detail_bidang", "id"],
          },
        ],
      });

      if (!dataLowongan) {
        return errorResponse(res, 404, "LOWONGAN_NOT_FOUND");
      }

      const newLowongan = {
        ...dataLowongan.dataValues,
        bidang_kerja: {
          ...dataLowongan.bidang_kerja.dataValues,
          photo:
            dataLowongan.bidang_kerja.id === 1
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
              : dataLowongan.bidang_kerja.id === 2
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
              : dataLowongan.bidang_kerja.id === 3
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
              : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
        },
      };

      successResWithData(res, 200, "DETAIL_LOWONGAN", newLowongan);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
