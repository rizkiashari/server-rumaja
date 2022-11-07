const joi = require("joi");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Penyedia, Pencari, Review, Bidang_Kerja } = require("../../models");
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
      domisili_kota: joi.number().required(),
      domisili_provinsi: joi.number().required(),
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
        domisili_kota: dataPenyedia.domisili_kota,
        domisili_provinsi: dataPenyedia.domisili_provinsi,
        photo_profile: dataPenyedia.photo_profile,
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
      domisili_kota: joi.number().required(),
      domisili_provinsi: joi.number().required(),
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
        domisili_kota: dataPencari.domisili_kota,
        domisili_provinsi: dataPencari.domisili_provinsi,
        photo_profile: dataPencari.photo_profile,
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
          gender: dataPencari.gender,
          date_open_work: +new Date(dataPencari.date_open_work) / 1000,
          alamat_rumah: dataPencari.alamat_rumah,
          tanggal_lahir: dataPencari.tanggal_lahir,
          tempat_lahir: dataPencari.tempat_lahir,
          tentang: dataPencari.tentang,
          isSave: false,
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
        gender: dataPencari.gender,
        date_open_work: +new Date(dataPencari.date_open_work) / 1000,
        alamat_rumah: dataPencari.alamat_rumah,
        tanggal_lahir: dataPencari.tanggal_lahir,
        tempat_lahir: dataPencari.tempat_lahir,
        tentang: dataPencari.tentang,
        isSave: false,
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
          attributes: ["name_user", "uuid_user"],
          include: {
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: ["id", "name_bidang"],
          },
        },
      ],
      attributes: ["id", "photo_profile", "date_open_work", "gender", "isSave"],
    });

    const review = await Review.findAll({
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    const pencariData = pencari.map((item) => {
      const reviewData = review.filter((itemReview) => {
        return itemReview.id_pencari === item.id;
      });

      return {
        id: item.id,
        photo_profile: item.photo_profile,
        date_open_work: item.date_open_work,
        gender: item.gender,
        isSave: item.isSave,
        name_pencari: item.users.name_user,
        uuid_user: item.users.uuid_user,
        name_bidang: item.users.bidang_kerja.name_bidang,
        review: reviewData,
      };
    });

    successResWithData(res, 200, "SUCCESS_GET_LIST_USER_PENCARI", pencariData);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.detailUserPencari = async (req, res) => {
  try {
    const { uuid_user } = req.params;

    console.log(uuid_user);

    const userPencari = await User.findOne({
      where: {
        uuid_user,
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: {
            exclude: ["updatedAt", "createdAt"],
          },
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
