const joi = require("joi");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Pekerjaan, Penyedia } = require("../../models");

exports.addPekerjaan = async (req, res) => {
  try {
    const dataPekerjaan = req.body;

    const headers = req.header("Authorization");

    if (!headers) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const token = headers.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return errorResponse(res, 403, "TOKEN_EXPIRED");
      }

      if (user.role !== 3) {
        return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
      }

      const dataPenyedia = await Penyedia.findOne({
        where: {
          user_id: user.id,
        },
      });

      console.log(dataPenyedia);

      const schema = joi.object({
        posisi_kerja: joi.string().min(3).required(),
        perkiraan_gaji: joi.string().required(),
        kualifikasi: joi.string().min(8).required(),
        id_bidang_kerja: joi.number().required(),
        deskripsi_kerja: joi.string().required(),
        lokasi_kerja: joi.string().optional(),
        lamar_sebelum_tgl: joi.string().required(),
      });

      const { error } = schema.validate(dataPekerjaan);
      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }

      const newPekerjaan = new Pekerjaan({
        uuid_kerja: uuid.v4(),
        posisi_kerja: dataPekerjaan.posisi_kerja,
        perkiraan_gaji: dataPekerjaan.perkiraan_gaji,
        kualifikasi: dataPekerjaan.kualifikasi,
        id_penyedia: dataPenyedia.id,
        id_bidang_kerja: dataPekerjaan.id_bidang_kerja,
        deskripsi_kerja: dataPekerjaan.deskripsi_kerja,
        lokasi_kerja: dataPekerjaan.lokasi_kerja,
        isSave: false,
        lamar_sebelum_tgl: dataPekerjaan.lamar_sebelum_tgl,
        createdAt: Math.floor(+new Date() / 1000),
      });

      await newPekerjaan.save();

      successRes(res, 200, "SUCCESS_ADD_PEKERJAAN");
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
