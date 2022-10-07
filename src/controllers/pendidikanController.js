const joi = require("joi");
const dotenv = require("dotenv");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User, Pendidikan, Pencari } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");
const env = dotenv.config().parsed;

exports.addPendidikan = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPendidikan = req.body;

    const pencari = await Pencari.findOne({
      where: {
        user_id: userLogin.id,
      },
    });

    if (!pencari) {
      return errorResponse(res, 404, "PENCARI_NOT_FOUND");
    }

    const schema = joi.object({
      nama: joi.string().required(),
      jurusan: joi.string().required(),
      tahun_awal: joi.string().required(),
      tahun_akhir: joi.string().required(),
    });

    const { error } = schema.validate(dataPendidikan);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const newPendidikan = new Pendidikan({
      nama: dataPendidikan.nama,
      uuid_pendidikan: uuid.v4(),
      id_pencari: pencari.id,
      jurusan: dataPendidikan.jurusan,
      tahun_awal: dataPendidikan.tahun_awal,
      tahun_akhir: dataPendidikan.tahun_akhir,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newPendidikan.save();

    successRes(res, 200, "ADD_PENDIDIKAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.listsAllPendidikan = async (req, res) => {
  try {
    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        user_id: userLogin.id,
      },
    });

    if (!pencari) {
      return errorResponse(res, 404, "PENCARI_NOT_FOUND");
    }

    const listsPendidikan = await Pendidikan.findAll({
      where: {
        id_pencari: pencari.id,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    successResWithData(res, 200, "LIST_ALL_PENDIDIKAN_SUCCESS", listsPendidikan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.getPendidikanByUUID = async (req, res) => {
  try {
    const userLogin = req.user;
    const { uuid_pendidikan } = req.params;

    const pencari = await Pencari.findOne({
      where: {
        user_id: userLogin.id,
      },
    });

    if (!pencari) {
      return errorResponse(res, 404, "PENCARI_NOT_FOUND");
    }

    const dataPendidikan = await Pendidikan.findOne({
      where: {
        uuid_pendidikan: uuid_pendidikan,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!dataPendidikan) {
      return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
    }

    successResWithData(res, 200, "LIST_PENDIDIKAN", dataPendidikan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.editPendidikan = async (req, res) => {
  try {
    const { uuid_pendidikan } = req.params;

    const pendidikan = await Pendidikan.findOne({
      where: {
        uuid_pendidikan,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!pendidikan) {
      return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
    }

    await Pendidikan.update(req.body, {
      where: {
        uuid_pendidikan,
      },
    });

    successRes(res, 200, "EDIT_PENDIDIKAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.deletePendidikan = async (req, res) => {
  try {
    const { uuid_pendidikan } = req.params;

    const pendidikan = await Pendidikan.findOne({
      where: {
        uuid_pendidikan,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!pendidikan) {
      return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
    }

    await Pendidikan.destroy({
      where: {
        uuid_pendidikan,
      },
    });

    successRes(res, 200, "DELETE_PENDIDIKAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
