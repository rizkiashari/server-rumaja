const joi = require("joi");
const { Penyedia, Review } = require("../../models");
const { errorResponse, successRes } = require("../helper/response");

exports.addReviewPencari = async (req, res) => {
  try {
    const userLogin = req.user;

    const dataReview = req.body;

    if (userLogin.role_id === 3) {
      const dataPenyedia = await Penyedia.findOne({
        where: {
          user_id: userLogin.id,
        },
      });

      const schema = joi.object({
        ulasan_detail: joi.string().required(),
        id_pencari: joi.number().required(),
        rating: joi.number().required(),
        periode_awal_kerja: joi.string().required(),
        periode_akhir_kerja: joi.string().required(),
      });

      const { error } = schema.validate(dataReview);

      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }

      const newReview = new Review({
        ulasan_detail_pencari: dataReview.ulasan_detail,
        id_pencari: dataReview.id_pencari,
        id_penyedia: dataPenyedia.id,
        rating: dataReview.rating,
        periode_awal_kerja: +new Date(dataReview.periode_awal_kerja) / 1000,
        periode_akhir_kerja: +new Date(dataReview.periode_akhir_kerja) / 1000,
        createdAt: Math.floor(+new Date() / 1000),
      });

      await newReview.save();

      return successRes(res, 200, "SUCCESS_ADD_REVIEW_PENCARI");
    }

    if (userLogin.role_id === 2) {
      return successRes(res, 200, "SUCCESS_ADD_REVIEW_PENYEDIA");
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
