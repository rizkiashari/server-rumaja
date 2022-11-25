const joi = require("joi");
const { Ulasan, Penyedia, Pencari, Lowongan, User } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");

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

exports.getAllUlasanPencari = async (req, res) => {
  try {
    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const ulasanPencari = await Ulasan.findAll({
      where: {
        id_pencari: pencari.id,
      },
      include: [
        {
          model: Lowongan,
          as: "lowongan",
          attributes: ["id"],
          include: [
            {
              model: Penyedia,
              as: "penyedia",
              attributes: ["id_user"],
              include: [
                {
                  model: User,
                  as: "users",
                  attributes: ["nama_user", "photo_profile"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    const dataUlasan = ulasanPencari.map((ulasan) => {
      return {
        id: ulasan.id,
        id_lowongan: ulasan.lowongan.id,
        id_pencari: ulasan.id_pencari,
        rating: ulasan.rating,
        catatan: ulasan.catatan,
        nama_penyedia: ulasan.lowongan.penyedia.users.nama_user,
        createdAt: ulasan.createdAt,
        photo_profile: ulasan.lowongan.penyedia.users.photo_profile,
      };
    });

    successResWithData(res, 200, "GET_ALL_ULASAN_PENCARI_SUCCESS", dataUlasan);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
