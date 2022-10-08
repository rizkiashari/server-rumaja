const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Penyedia, Pencari } = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");

const env = dotenv.config().parsed;

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
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.updateUserPenyedia = async (req, res) => {
  try {
    const userLogin = req.user;

    if (userLogin.role_id !== 3) {
      return errorResponse(res, 403, "YOUR_NOT_PENYEDIA");
    }

    const dataPenyedia = req.body;

    const schema = joi.object({
      name_user: joi.string().min(3).required(),
      gender: joi.string().required(),
      email: joi.string().email().required(),
      nomor_wa: joi.string().min(10).max(17).required(),
      alamat_rumah: joi.string().required(),
      domisili: joi.string().required(),
      tentang: joi.string().required(),
      tanggal_lahir: joi.string().required(),
      photo_profile: joi.string().optional(),
    });

    const { error } = schema.validate(dataPenyedia);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await User.update(
      {
        name_user: dataPenyedia.name_user,
        email: dataPenyedia.email,
        nomor_wa: dataPenyedia.nomor_wa,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    const dataPenyediaUpdate = await Penyedia.findOne({
      where: {
        user_id: userLogin.id,
      },
    });

    if (dataPenyediaUpdate) {
      await Penyedia.update(
        {
          domisili: dataPenyedia.domisili,
          photo_profile: dataPenyedia.photo_profile,
          gender: dataPenyedia.gender,
          alamat_rumah: dataPenyedia.alamat_rumah,
          tanggal_lahir: dataPenyedia.tanggal_lahir,
          tentang: dataPenyedia.tentang,
          createdAt: Math.floor(+new Date() / 1000),
        },
        {
          where: {
            id: dataPenyediaUpdate.id,
          },
        }
      );
    } else {
      await Penyedia.create({
        user_id: userLogin.id,
        domisili: dataPenyedia.domisili,
        photo_profile: dataPenyedia.photo_profile,
        gender: dataPenyedia.gender,
        alamat_rumah: dataPenyedia.alamat_rumah,
        tanggal_lahir: dataPenyedia.tanggal_lahir,
        tentang: dataPenyedia.tentang,
        createdAt: Math.floor(+new Date() / 1000),
      });
    }

    successRes(res, 200, "SUCCESS_UPDATE_USER_PENYEDIA");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.updateUserPencari = async (req, res) => {
  try {
    const userLogin = req.user;
    const dataPencari = req.body;

    if (userLogin.role_id !== 2) {
      return errorResponse(res, 403, "YOUR_NOT_PENCARI");
    }

    const schema = joi.object({
      name_user: joi.string().min(3).required(),
      gender: joi.string().required(),
      date_open_work: joi.string().required(),
      bidang_kerja: joi.number().optional(),
      email: joi.string().email().required(),
      nomor_wa: joi.string().min(10).max(17).required(),
      tanggal_lahir: joi.string().required(),
      alamat_rumah: joi.string().required(),
      kota: joi.number().required(),
      provinsi: joi.number().required(),
      tinggi_badan: joi.number().required(),
      tempat_lahir: joi.string().required(),
      berat_badan: joi.number().required(),
      tentang: joi.string().required(),
      photo_profile: joi.string().optional(),
    });

    const { error } = schema.validate(dataPencari);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    await User.update(
      {
        name_user: dataPencari.name_user,
        email: dataPencari.email,
        nomor_wa: dataPencari.nomor_wa,
        id_bidang_kerja: dataPencari.bidang_kerja,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    const pencariData = await Pencari.findOne({
      where: {
        user_id: userLogin.id,
      },
    });

    if (pencariData) {
      await Pencari.update(
        {
          photo_profile: dataPencari.photo_profile,
          gender: dataPencari.gender,
          date_open_work: +new Date(dataPencari.date_open_work) / 1000,
          alamat_rumah: dataPencari.alamat_rumah,
          tanggal_lahir: dataPencari.tanggal_lahir,
          tempat_lahir: dataPencari.tempat_lahir,
          tentang: dataPencari.tentang,
          isSave: false,
          kota: dataPencari.kota,
          provinsi: dataPencari.provinsi,
          tinggi_badan: dataPencari.tinggi_badan,
          berat_badan: dataPencari.berat_badan,
          createdAt: Math.floor(+new Date() / 1000),
        },
        {
          where: {
            id: pencariData.id,
          },
        }
      );
    } else {
      await Pencari.create({
        user_id: userLogin.id,
        photo_profile: dataPencari.photo_profile,
        gender: dataPencari.gender,
        date_open_work: +new Date(dataPencari.date_open_work) / 1000,
        alamat_rumah: dataPencari.alamat_rumah,
        tanggal_lahir: dataPencari.tanggal_lahir,
        tempat_lahir: dataPencari.tempat_lahir,
        tentang: dataPencari.tentang,
        isSave: false,
        kota: dataPencari.kota,
        provinsi: dataPencari.provinsi,
        tinggi_badan: dataPencari.tinggi_badan,
        berat_badan: dataPencari.berat_badan,
        createdAt: Math.floor(+new Date() / 1000),
      });
    }

    successRes(res, 200, "SUCCESS_UPDATE_USER_PENCARI");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.listUserPencari = async (req, res) => {
  try {
    const pencari = await Pencari.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: {
            exclude: ["password", "updatedAt", "user_id"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    successResWithData(res, 200, "SUCCESS_GET_LIST_USER_PENCARI", pencari);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

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
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
