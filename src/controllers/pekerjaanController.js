const joi = require("joi");
const uuid = require("uuid");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Pekerjaan, Penyedia } = require("../../models");
const { Op } = require("sequelize");

exports.getAllPekerjaan = async (req, res) => {
  try {
    const userLogin = req.user;

    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const { deadline, domisili, bidang_kerja, gaji, search } = req.query;

    if (userLogin.role_id !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    if (!domisili && !bidang_kerja && !gaji && !deadline && !search) {
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
                [Op.eq]: domisili,
              },
            },
            {
              gaji: {
                [Op.gte]: gaji,
              },
            },
            {
              lamar_sebelum_tgl: {
                [Op.gte]: +new Date(deadline).getTime() / 1000,
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
                [Op.eq]: domisili,
              },
            },
            {
              gaji: {
                [Op.gte]: gaji,
              },
            },
            {
              lamar_sebelum_tgl: {
                [Op.gte]: +new Date(deadline).getTime() / 1000,
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
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getAllPekerjanWithLimit = async (req, res) => {
  try {
    const userLogin = req.user;
    const { limit } = req.params;

    if (userLogin.role_id !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const dataPekerjaan = await Pekerjaan.findAll({
      attributes: {
        exclude: ["updatedAt"],
      },
      limit: +limit,
      order: [["id", "DESC"]],
    });

    successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJAAN", dataPekerjaan);
  } catch (error) {
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

exports.addPekerjaan = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPekerjaan = req.body;

    if (userLogin.role_id !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const dataPenyedia = await Penyedia.findOne({
      where: {
        user_id: userLogin.id,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!dataPenyedia) {
      return errorResponse(res, 404, "PENYEDIA_NOT_FOUND");
    }

    const schema = joi.object({
      gaji: joi.number().required(),
      skala_gaji: joi.string().valid("Hari", "Bulan", "Tahun").required(),
      fasilitas: joi.string().required(),
      kualifikasi: joi.string().required(),
      id_bidang_kerja: joi.number().required(),
      deskripsi_kerja: joi.string().required(),
      lokasi_kerja_provinsi: joi.number().required(),
      lokasi_kerja_kota: joi.number().required(),
      lamar_sebelum_tgl: joi.string().required(),
    });

    const { error } = schema.validate(dataPekerjaan);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const deadline = new Date(dataPekerjaan.lamar_sebelum_tgl).getTime() / 1000;

    const newPekerjaan = new Pekerjaan({
      uuid_kerja: uuid.v4(),
      gaji: dataPekerjaan.gaji,
      skala_gaji: dataPekerjaan.skala_gaji,
      kualifikasi: dataPekerjaan.kualifikasi,
      id_penyedia: dataPenyedia.id,
      id_bidang_kerja: dataPekerjaan.id_bidang_kerja,
      deskripsi_kerja: dataPekerjaan.deskripsi_kerja,
      lokasi_kerja_provinsi: dataPekerjaan.lokasi_kerja_provinsi,
      lokasi_kerja_kota: dataPekerjaan.lokasi_kerja_kota,
      isSave: false,
      lamar_sebelum_tgl: +deadline,
      createdAt: Math.floor(+new Date() / 1000),
      fasilitas: dataPekerjaan.fasilitas,
    });

    await newPekerjaan.save();

    successRes(res, 200, "SUCCESS_ADD_PEKERJAAN");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.editPekerjaan = async (req, res) => {
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

    await Pekerjaan.update(req.body, {
      where: {
        uuid_kerja,
      },
    });

    successRes(res, 200, "SUCCESS_EDIT_PEKERJAAN");
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
    const { bidang_kerja, kota } = req.query;

    const dataPekerjaan = await Pekerjaan.findAll({
      where: {
        [Op.or]: [
          {
            id_bidang_kerja: {
              [Op.eq]: `${bidang_kerja ? +bidang_kerja : ""}`,
            },
          },
          {
            lokasi_kerja_kota: {
              [Op.eq]: `${kota ? +kota : ""}`,
            },
          },
        ],
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_REKOMENDASI_PEKERJAAN", dataPekerjaan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
