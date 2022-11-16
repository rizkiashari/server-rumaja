const joi = require("joi");
const { Ulasan, Penyedia } = require("../../models");
const { errorResponse, successRes } = require("../helper/response");

exports.addUlasan = async (req, res) => {
  try {
    const userLogin = req.user;

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!penyedia) {
      return errorResponse(res, 400, "YOUR_NOT_PENYEDIA");
    }

    const dataUlasan = req.body;

    const schema = joi.object({
      id_lowongan: joi.number().required(),
      id_pencari: joi.number().required(),
      catatan: joi.string().required(),
      rating: joi.number().required(),
    });

    const { error } = schema.validate(dataUlasan);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const newUlasan = new Ulasan({
      id_lowongan: dataUlasan.id_lowongan,
      id_pencari: dataUlasan.id_pencari,
      rating: dataUlasan.rating,
      catatan: dataUlasan.catatan,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newUlasan.save();

    successRes(res, 200, "ADD_ULASAN_SUCCESS");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
