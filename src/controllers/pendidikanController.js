const joi = require("joi");
const uuid = require("uuid");
const { Pendidikan, Pencari } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");

// Done
exports.addPendidikan = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPendidikan = req.body;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!pencari) {
      return errorResponse(res, 404, "PENCARI_NOT_FOUND");
    }

    const schema = joi.object({
      nama: joi.string().required(),
      tahun_awal: joi.string().required().max(4),
      tahun_akhir: joi.string().required().max(4),
    });

    const { error } = schema.validate(dataPendidikan);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const newPendidikan = new Pendidikan({
      uuid_pendidikan: uuid.v4(),
      nama_pendidikan: dataPendidikan.nama,
      id_pencari: pencari.id,
      tahun_awal: +dataPendidikan.tahun_awal,
      tahun_akhir: +dataPendidikan.tahun_akhir,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newPendidikan.save();

    successRes(res, 200, "ADD_PENDIDIKAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.listsAllPendidikan = async (req, res) => {
  try {
    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
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
        exclude: ["updatedAt", "createdAt"],
      },
    });

    successResWithData(res, 200, "LIST_ALL_PENDIDIKAN_SUCCESS", listsPendidikan);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getPendidikanByUUID = async (req, res) => {
  try {
    const userLogin = req.user;
    const { uuid_pendidikan } = req.params;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
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
        exclude: ["updatedAt", "createdAt"],
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

// Done
exports.editPendidikan = async (req, res) => {
  try {
    const { uuid_pendidikan } = req.params;

    const pendidikan = await Pendidikan.findOne({
      where: {
        uuid_pendidikan,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!pendidikan) {
      return errorResponse(res, 404, "PENDIDIKAN_NOT_FOUND");
    }

    await Pendidikan.update(
      {
        nama_pendidikan: req.body.nama,
        tahun_awal: req.body.tahun_awal,
        tahun_akhir: req.body.tahun_akhir,
      },
      {
        where: {
          uuid_pendidikan,
        },
      }
    );

    successRes(res, 200, "EDIT_PENDIDIKAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.deletePendidikan = async (req, res) => {
  try {
    const { uuid_pendidikan } = req.params;

    const pendidikan = await Pendidikan.findOne({
      where: {
        uuid_pendidikan,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
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
