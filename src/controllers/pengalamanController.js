const joi = require("joi");
const uuid = require("uuid");
const { Pengalaman, Pencari } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");

// Done
exports.addPengalaman = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPengalaman = req.body;

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
      pengalaman_prov: joi.string().required(),
      tahun_mulai: joi.string().required(),
      tahun_akhir: joi.string().required(),
      isWork: joi.number().optional(),
    });

    const { error } = schema.validate(dataPengalaman);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const tahunMulai = dataPengalaman.tahun_mulai;
    const tahunAkhir = dataPengalaman.tahun_akhir;

    if (tahunMulai > tahunAkhir) {
      return errorResponse(res, 423, "YEAR_NOT_VALID");
    }

    const newPengalaman = new Pengalaman({
      uuid_pengalaman: uuid.v4(),
      nama_pengalaman: dataPengalaman.nama,
      pengalaman_prov: dataPengalaman.pengalaman_prov,
      tahun_mulai: dataPengalaman.tahun_mulai,
      tahun_akhir: dataPengalaman.tahun_akhir,
      isWork: dataPengalaman.isWork ? true : false,
      id_pencari: pencari.id,
      createdAt: Math.floor(+new Date() / 1000),
    });

    await newPengalaman.save();

    successRes(res, 200, "ADD_PENGALAMAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.listAllPengalaman = async (req, res) => {
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

    const listPengalaman = await Pengalaman.findAll({
      where: {
        id_pencari: pencari.id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
      order: [["id", "DESC"]],
    });

    successResWithData(res, 200, "LIST_ALL_PENGALAMAN_SUCCESS", listPengalaman);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getPengalamanByUUID = async (req, res) => {
  try {
    const userLogin = req.user;
    const { uuid_pengalaman } = req.params;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!pencari) {
      return errorResponse(res, 404, "PENCARI_NOT_FOUND");
    }

    const dataPengalaman = await Pengalaman.findOne({
      where: {
        uuid_pengalaman: uuid_pengalaman,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!dataPengalaman) {
      return errorResponse(res, 404, "PENGALAMAN_NOT_FOUND");
    }

    successResWithData(res, 200, "LIST_PENGALAMAN", dataPengalaman);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.editPengalaman = async (req, res) => {
  try {
    const { uuid_pengalaman } = req.params;

    const pengalaman = await Pengalaman.findOne({
      where: {
        uuid_pengalaman,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!pengalaman) {
      return errorResponse(res, 404, "PENGALAMAN_NOT_FOUND");
    }

    await Pengalaman.update(
      {
        nama_pengalaman: req.body.nama,
        pengalaman_prov: req.body.pengalaman_prov,
        tahun_mulai: +req.body.tahun_mulai,
        tahun_akhir: +req.body.tahun_akhir,
        isWork: req.body.isWork ? true : false,
      },
      {
        where: {
          uuid_pengalaman,
        },
      }
    );

    successRes(res, 200, "EDIT_PENGALAMAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.deletePengalaman = async (req, res) => {
  try {
    const { uuid_pengalaman } = req.params;

    const pengalaman = await Pengalaman.findOne({
      where: {
        uuid_pengalaman,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!pengalaman) {
      return errorResponse(res, 404, "PENGALAMAN_NOT_FOUND");
    }

    await Pengalaman.destroy({
      where: {
        uuid_pengalaman,
      },
    });

    successRes(res, 200, "DELETE_PENGALAMAN_SUCCESS");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
