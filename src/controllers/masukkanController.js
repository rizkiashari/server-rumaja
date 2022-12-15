const joi = require("joi");
const { Masukkan, Penyedia, Pencari, Lowongan, User } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");

exports.addMasukkan = async (req, res) => {
  try {
    const dataMasukkan = req.body;
    const userLogin = req.user;

    const dataPencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const lowongan = await Lowongan.findOne({
      where: {
        id: dataMasukkan.id_lowongan,
      },
      attributes: ["id_penyedia"],
    });

    await Masukkan.create({
      id_pencari: dataPencari.id,
      id_penyedia: lowongan.id_penyedia,
      detail_masukkan: dataMasukkan.detail_masukkan,
      createdAt: Math.floor(+new Date() / 1000),
    });

    successRes(res, 200, "ADD_MASUKKAN_SUCCESS");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
