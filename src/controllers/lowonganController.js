const joi = require("joi");
const uuid = require("uuid");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Lowongan, Penyedia, Bidang_Kerja } = require("../../models");
const { Op } = require("sequelize");

// Penyedia

exports.addLowongan = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPekerjaan = req.body;

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
      skala_gaji: joi.string().valid("hari", "bulan", "tahun").required(),
      kualifikasi: joi.string().required(),
      fasilitas: joi.string().required(),
      id_bidang_kerja: joi.number().required(),
      deskripsi_lowongan: joi.string().required(),
      kota_lowongan: joi.number().required(),
      provinsi_lowongan: joi.number().required(),
    });

    const { error } = schema.validate(dataPekerjaan);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const newPekerjaan = new Lowongan({
      uuid_lowongan: uuid.v4(),
      gaji: +dataPekerjaan.gaji,
      skala_gaji: dataPekerjaan.skala_gaji,
      kualifikasi: dataPekerjaan.kualifikasi,
      isSave: false,
      isPublish: false,
      deskripsi_lowongan: dataPekerjaan.deskripsi_lowongan,
      fasilitas: dataPekerjaan.fasilitas,
      kota_lowongan: dataPekerjaan.kota_lowongan,
      provinsi_lowongan: dataPekerjaan.provinsi_lowongan,
      id_bidang_kerja: dataPekerjaan.id_bidang_kerja,
      id_penyedia: dataPenyedia.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newPekerjaan.save();

    successRes(res, 200, "SUCCESS_ADD_");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.editLowongan = async (req, res) => {
  try {
    const { uuid_lowongan } = req.params;

    const dataPekerja = await Lowongan.findOne({
      where: {
        uuid_lowongan,
      },
    });

    if (!dataPekerja) {
      return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
    }

    await Lowongan.update(req.body, {
      where: {
        uuid_lowongan,
      },
    });

    successRes(res, 200, "SUCCESS_EDIT_PEKERJAAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getAllPekerjaan = async (req, res) => {
  try {
    const userLogin = req.user;

    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const { kota, bidang_kerja, gaji, search } = req.query;

    if (userLogin.role_id !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    if (!kota && !bidang_kerja && !gaji && !search) {
      const totalRows = await Pekerjaan.count();

      const totalPage = Math.ceil(totalRows / limit);

      const dataPekerjaan = await Pekerjaan.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        limit: [(page - 1) * +limit, +limit],
        order: [["id", "DESC"]],
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
        pekerjaan: dataPekerjaan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    } else {
      const totalRows = await Pekerjaan.count({
        where: {
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              lokasi_kerja_kota: {
                [Op.eq]: kota,
              },
            },
            {
              gaji: {
                [Op.gte]: gaji,
              },
            },
            {
              kualifikasi: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              deskripsi_kerja: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              fasilitas: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const dataPekerjaan = await Pekerjaan.findAll({
        where: {
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              lokasi_kerja_kota: {
                [Op.eq]: kota,
              },
            },
            {
              gaji: {
                [Op.lte]: gaji,
              },
            },
            {
              kualifikasi: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              deskripsi_kerja: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              fasilitas: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        limit: [(page - 1) * +limit, +limit],
        order: [["id", "DESC"]],
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
        pekerjaan: dataPekerjaan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getByUUIDPekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

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
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.deletePekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

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
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
// End

// Pencari
exports.savePekerjaan = async (req, res) => {
  try {
    const { uuid_kerja } = req.params;

    const dataPekerjaan = await Pekerjaan.findOne({
      where: {
        uuid_kerja,
      },
    });

    if (!dataPekerjaan) {
      return errorResponse(res, 404, "PEKERJAAN_NOT_FOUND");
    }

    if (dataPekerjaan.isSave === true) {
      await Pekerjaan.update(
        {
          isSave: false,
        },
        {
          where: {
            uuid_kerja,
          },
        }
      );

      successRes(res, 200, "SUCCESS_UNSAVE_PEKERJAAN");
    } else {
      await Pekerjaan.update(
        {
          isSave: true,
        },
        {
          where: {
            uuid_kerja,
          },
        }
      );

      successRes(res, 200, "SUCCESS_SAVE_PEKERJAAN");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.rekomendasiPekerjaan = async (req, res) => {
  try {
    const { bidang_kerja, gaji } = req.query;

    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;

    const totalRows = await Pekerjaan.count();

    const totalPage = Math.ceil(totalRows / limit);

    const dataPekerjaan = await Pekerjaan.findAll({
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
      limit: [(page - 1) * +limit, +limit],
      order: [["id", "DESC"]],
    });

    successResWithData(res, 200, "SUCCESS_GET_REKOMENDASI_PEKERJAAN", {
      pekerjaan: dataPekerjaan,
      totalPage,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getPekerjaanByBidangKerja = async (req, res) => {
  try {
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    const { bidang_kerja } = req.params;

    const { kota, provinsi, jenis_gaji, urutan, search } = req.query;

    let tempUrutan = [];

    if (urutan === "Terbaru") {
      tempUrutan = ["id", "DESC"];
    }
    if (urutan === "Terdekat") {
      tempUrutan = ["lokasi_kerja_kota", "DESC"];
    }
    if (urutan === "GajiTertinggi") {
      tempUrutan = ["gaji", "DESC"];
    }

    if (!kota && !provinsi && !jenis_gaji && !search) {
      const totalRows = await Pekerjaan.count();

      const totalPage = Math.ceil(totalRows / limit);

      const dataPekerjaan = await Pekerjaan.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        where: {
          id_bidang_kerja: bidang_kerja,
        },
        limit: [(page - 1) * +limit, +limit],
        order: [urutan ? tempUrutan : ["id", "DESC"]],
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
        pekerjaan: dataPekerjaan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    } else {
      const totalRows = await Pekerjaan.count({
        where: {
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              lokasi_kerja_kota: {
                [Op.eq]: kota,
              },
            },
            {
              lokasi_kerja_provinsi: {
                [Op.eq]: provinsi,
              },
            },
            {
              kualifikasi: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              deskripsi_kerja: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              fasilitas: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const dataPekerjaan = await Pekerjaan.findAll({
        where: {
          [Op.or]: [
            {
              id_bidang_kerja: {
                [Op.eq]: bidang_kerja,
              },
            },
            {
              lokasi_kerja_kota: {
                [Op.eq]: kota,
              },
            },
            {
              lokasi_kerja_provinsi: {
                [Op.eq]: provinsi,
              },
            },
            {
              kualifikasi: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              deskripsi_kerja: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              fasilitas: {
                [Op.like]: `%${search}%`,
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

      successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", {
        pekerjaan: dataPekerjaan,
        totalPage,
        page,
        limit,
        totalRows,
        totalPage,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// End

// Global
exports.listsLayanan = async (req, res) => {
  try {
    const dataLayanan = await Bidang_Kerja.findAll({
      attributes: ["id", "name_bidang"],
    });

    successResWithData(res, 200, "SUCCESS_GET_LISTS_LAYANAN", dataLayanan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
