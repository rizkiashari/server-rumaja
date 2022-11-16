const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const {
  User,
  Penyedia,
  Pencari,
  Bidang_Kerja,
  Simpan_Pencari,
  Pengalaman,
  sequelize,
  Ulasan,
  Lowongan,
} = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");

const env = dotenv.config().parsed;

// Done
exports.updatePassword = async (req, res) => {
  try {
    const userLogin = req.user;

    const { oldPassword, newPassword } = req.body;
    const dataPassword = req.body;

    const schema = joi.object({
      oldPassword: joi.string().min(8).required(),
      newPassword: joi.string().min(8).required(),
    });

    const { error } = schema.validate(dataPassword);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const user = await User.findOne({
      where: {
        id: userLogin.id,
      },
    });

    const validPassword = await bcrypt.compareSync(oldPassword, user.password);

    if (!validPassword) {
      return errorResponse(res, 400, "PASSWORD_NOT_MATCH");
    }

    const salt = await bcrypt.genSalt(+env.SALT);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await user.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_CHANGE_PASSWORD");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.updateUserPenyedia = async (req, res) => {
  try {
    const userLogin = req.user;

    if (userLogin.id_role !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const dataPenyedia = req.body;

    const schema = joi.object({
      nama_user: joi.string().min(3).required(),
      gender: joi.string().required().valid("pria", "wanita"),
      nomor_wa: joi.string().min(10).max(17).required(),
      domisili_kota: joi.number().required(),
      domisili_provinsi: joi.number().required(),
      tentang: joi.string().required(),
      tanggal_lahir: joi.string().required(),
      tempat_lahir: joi.string().required(),
      photo_profile: joi.string().optional(),
      alamat_rumah: joi.string().required(),
    });

    const { error } = schema.validate(dataPenyedia);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await User.update(
      {
        nama_user: dataPenyedia.nama_user,
        nomor_wa: dataPenyedia.nomor_wa,
        domisili_kota: dataPenyedia.domisili_kota,
        domisili_provinsi: dataPenyedia.domisili_provinsi,
        photo_profile: req.file != undefined ? req.file.path : null,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    const dataPenyediaUpdate = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    await Penyedia.update(
      {
        gender: dataPenyedia.gender,
        alamat_rumah: dataPenyedia.alamat_rumah,
        tanggal_lahir: dataPenyedia.tanggal_lahir,
        tempat_lahir: dataPenyedia.tempat_lahir,
        tentang: dataPenyedia.tentang,
        createdAt: Math.floor(+new Date() / 1000),
      },
      {
        where: {
          id: dataPenyediaUpdate.id,
        },
      }
    );
    successRes(res, 200, "SUCCESS_UPDATE_USER_PENYEDIA");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.updateUserPencari = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPencari = req.body;

    if (userLogin.id_role !== 2) {
      return errorResponse(res, 403, "YOUR_NOT_PENCARI");
    }

    const schema = joi.object({
      photo_profile: joi.string().optional(),
      nama_user: joi.string().min(3).required(),
      gender: joi.string().required().valid("pria", "wanita"),
      bidang_kerja: joi.number().optional(),
      nomor_wa: joi.string().min(10).max(17).required(),
      tempat_lahir: joi.string().required(),
      tanggal_lahir: joi.string().required(),
      domisili_kota: joi.number().required(),
      domisili_provinsi: joi.number().required(),
      alamat_rumah: joi.string().required(),
      tinggi_badan: joi.number().required(),
      berat_badan: joi.number().required(),
      tentang: joi.string().required(),
    });

    const { error } = schema.validate(dataPencari);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await User.update(
      {
        nama_user: dataPencari.nama_user,
        nomor_wa: dataPencari.nomor_wa,
        domisili_kota: dataPencari.domisili_kota,
        domisili_provinsi: dataPencari.domisili_provinsi,
        photo_profile: req.file != undefined ? req.file.path : null,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    const pencariData = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    await Pencari.update(
      {
        gender: dataPencari.gender,
        alamat_rumah: dataPencari.alamat_rumah,
        tanggal_lahir: dataPencari.tanggal_lahir,
        tempat_lahir: dataPencari.tempat_lahir,
        tentang: dataPencari.tentang,
        tinggi_badan: +dataPencari.tinggi_badan,
        berat_badan: +dataPencari.berat_badan,
        createdAt: Math.floor(+new Date() / 1000),
      },
      {
        where: {
          id: pencariData.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_UPDATE_USER_PENCARI");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.listRekomendasiUserPencari = async (req, res) => {
  try {
    const pencari = await Pencari.findAll({
      attributes: {
        exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
      },
      include: [
        {
          model: User,
          as: "users",
          attributes: {
            exclude: [
              "password",
              "createdAt",
              "updatedAt",
              "resetPassword",
              "nomor_wa",
              "email",
              "id_role",
            ],
          },
        },
        {
          model: Simpan_Pencari,
          as: "simpan_pencari",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Bidang_Kerja,
          as: "bidang_kerja",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Pengalaman,
          as: "pengalaman",
          attributes: ["id", "nama_pengalaman"],
        },
      ],
    });

    const pencariData = pencari.map((item) => {
      return {
        ...item.dataValues,
        pengalaman: item.dataValues.pengalaman.length,
        bidang_kerja: item.dataValues.bidang_kerja.nama_bidang,
      };
    });

    successResWithData(res, 200, "SUCCESS_GET_LIST_USER_PENCARI", pencariData);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.detailUserPencari = async (req, res) => {
  try {
    const { uuid_user } = req.params;

    const userPencari = await User.findOne({
      where: {
        uuid_user,
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: {
            exclude: ["updatedAt", "createdAt", "id_user", "id_bidang_kerja"],
          },
          include: [
            {
              model: Pengalaman,
              as: "pengalaman",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id_pencari", "uuid_pengalaman"],
              },
            },
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["id", "nama_bidang", "detail_bidang"],
            },
            {
              model: Ulasan,
              as: "ulasan",
              attributes: {
                exclude: ["createdAt", "updatedAt", "id_pencari", "id_lowongan"],
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
                          attributes: ["nama_user"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["password", "updatedAt", "user_id", "resetPassword", "createdAt"],
      },
    });

    if (!userPencari) {
      return errorResponse(res, 404, "USER_NOT_FOUND");
    }

    successResWithData(res, 200, "SUCCESS_GET_DETAIL_USER_PENCARI", userPencari);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.profilePencari = async (req, res) => {
  try {
    const userLogin = req.user;

    const userPencari = await User.findOne({
      where: {
        id: userLogin.id,
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: {
            exclude: ["updatedAt", "createdAt", "id_user"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_PROFILE_PENCARI", userPencari);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.profilePenyedia = async (req, res) => {
  try {
    const userLogin = req.user;

    const userPenyedia = await User.findOne({
      where: {
        id: userLogin.id,
      },
      include: [
        {
          model: Penyedia,
          as: "penyedia",
          attributes: {
            exclude: ["updatedAt", "createdAt", "id_user"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_PROFILE_PENYEDIA", userPenyedia);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.savePencari = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataSimpan = req.body;

    const schema = joi.object({
      id_pencari: joi.number().required(),
      isSave: joi.boolean().required(),
    });

    const { error } = schema.validate(dataSimpan);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!penyedia) {
      return errorResponse(res, 404, "PENYEDIA_NOT_FOUND");
    }

    await Simpan_Pencari.create({
      id_penyedia: penyedia.id,
      id_pencari: dataSimpan.id_pencari,
      isSave: dataSimpan.isSave,
      createdAt: Math.floor(+new Date() / 1000),
      uuid_simpan: uuid.v4(),
    });

    successRes(res, 200, "SUCCESS_SIMPAN_PENCARI");
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.unSavePencari = async (req, res) => {
  try {
    const userLogin = req.user;

    const { uuid_simpan } = req.params;

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (!penyedia) {
      return errorResponse(res, 404, "PENYEDIA_NOT_FOUND");
    }

    await Simpan_Pencari.update(
      {
        isSave: false,
      },
      {
        where: {
          uuid_simpan,
        },
      }
    );

    successRes(res, 200, "SUCCESS_UNSAVE_PENCARI");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Untuk Super admin
exports.getAllUser = async (req, res) => {
  try {
    const { search } = req.query;
    const userLogin = req.user;

    if (userLogin.role_id === 1) {
      return errorResponse(res, 403, "YOUR_NOT_ADMIN");
    } else {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            {
              name_user: {
                [Op.like]: `%${search ? search : ""}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${search ? search : ""}%`,
              },
            },
          ],
        },
        attributes: { exclude: ["password", "updatedAt"] },
      });

      successResWithData(res, 200, "SUCCESS_GET_ALL_USER", users);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
