const joi = require("joi");
const dotenv = require("dotenv");
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
  Pendidikan,
  Simpan_Lowongan,
} = require("../../models");
const { errorResponse, successResWithData, successRes } = require("../helper/response");
const { Op } = require("sequelize");

const env = dotenv.config().parsed;

// Done
// exports.updatePassword = async (req, res) => {
//   try {
//     const userLogin = req.user;

//     const { oldPassword, newPassword } = req.body;
//     const dataPassword = req.body;

//     const schema = joi.object({
//       oldPassword: joi.string().min(8).required(),
//       newPassword: joi.string().min(8).required(),
//     });

//     const { error } = schema.validate(dataPassword);

//     if (error) {
//       return errorResponse(res, 400, error.details[0].message);
//     }

//     const user = await User.findOne({
//       where: {
//         id: userLogin.id,
//       },
//     });

//     const validPassword = await bcrypt.compareSync(oldPassword, user.password);

//     if (!validPassword) {
//       return errorResponse(res, 400, "PASSWORD_NOT_MATCH");
//     }

//     const salt = await bcrypt.genSalt(+env.SALT);
//     const hashPassword = await bcrypt.hash(newPassword, salt);

//     await user.update(
//       {
//         password: hashPassword,
//       },
//       {
//         where: {
//           id: user.id,
//         },
//       }
//     );

//     successRes(res, 200, "SUCCESS_CHANGE_PASSWORD");
//   } catch (error) {
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };

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
      domisili_kota: joi.string().required(),
      domisili_provinsi: joi.string().required(),
      tentang: joi.string().required(),
      tanggal_lahir: joi.string().required(),
      tempat_lahir: joi.string().required(),
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
      nama_user: joi.string().min(3).required(),
      gender: joi.string().required().valid("pria", "wanita"),
      bidang_kerja: joi.number().optional(),
      nomor_wa: joi.string().min(10).max(17).required(),
      tempat_lahir: joi.string().required(),
      tanggal_lahir: joi.string().required(),
      domisili_kota: joi.string().required(),
      domisili_provinsi: joi.string().required(),
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
  const userLogin = req.user;

  const penyedia = await Penyedia.findOne({
    where: {
      id_user: userLogin.id,
    },
  });

  try {
    const pencari = await Pencari.findAll({
      attributes: {
        exclude: ["updatedAt", "createdAt", "id_bidang_kerja"],
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
          model: Bidang_Kerja,
          as: "bidang_kerja",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Pengalaman,
          as: "pengalaman",
        },
        {
          model: Ulasan,
          as: "ulasan",
        },
      ],
    });

    const pencariData = await Promise.all(
      pencari.map(async (item) => {
        let totalRating = 0;

        for (let i = 0; i < item.ulasan.length; i++) {
          totalRating += item.ulasan[i].rating / item.ulasan.length;
        }

        const simpan_pencari = await Simpan_Pencari.findOne({
          where: {
            id_penyedia: penyedia.id,
            id_pencari: item.id,
          },
        });

        return {
          ...item.dataValues,
          pengalaman: item.dataValues.pengalaman.length,
          bidang_kerja: item.dataValues.bidang_kerja.nama_bidang,
          ulasan: totalRating,
          simpan_pencari: simpan_pencari ? simpan_pencari : null,
        };
      })
    );

    successResWithData(
      res,
      200,
      "SUCCESS_GET_REKOMENDASI_PENCARI",
      pencariData.filter((item) => item.pengalaman > 0 && item.ulasan)
    );
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
            exclude: ["updatedAt", "createdAt", "id_user", "id_bidang_kerja"],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: ["id", "detail_bidang"],
            },
            {
              model: Ulasan,
              as: "ulasan",
              attributes: ["rating"],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "createdAt", "password", "resetPassword", "id_role"],
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
        exclude: ["updatedAt", "createdAt", "resetPassword", "password"],
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

    successRes(res, 200, "SUCCESS_SAVE_PENCARI");
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

    await Simpan_Pencari.destroy({
      where: {
        uuid_simpan,
      },
    });

    successRes(res, 200, "SUCCESS_UNSAVE_PENCARI");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.pencariByBidangKerja = async (req, res) => {
  try {
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    const { bidang_kerja } = req.params;

    const userLogin = req.user;

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const { urutan, jenis_kelamin, min_usia, max_usia, search } = req.query;

    if (search !== "" && search !== undefined) {
      const totalRows = await Pencari.count({
        where: {
          id_bidang_kerja: bidang_kerja,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const pencari = await Pencari.findAll({
        attributes: {
          exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
          include: [
            [
              sequelize.literal("(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"),
              "usia",
            ],
          ],
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
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        // limit: [(page - 1) * +limit, +limit],
        where: {
          [Op.and]: [
            {
              id_bidang_kerja: bidang_kerja,
            },
            {
              "$users.nama_user$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
      });

      const pencariWithRating = await Promise.all(
        pencari.map(async (pencari) => {
          const rating = await Ulasan.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
            order:
              urutan === "penilaian"
                ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                : [],
          });

          const simpan_pencari = await Simpan_Pencari.findOne({
            where: {
              id_penyedia: penyedia.id,
              id_pencari: pencari.id,
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });

          const pengalaman = await Pengalaman.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],
            order:
              urutan === "pengalaman"
                ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                : [],
          });

          return {
            ...pencari.dataValues,
            rating:
              rating.dataValues.rating === null
                ? 0
                : +Number(rating.dataValues.rating).toFixed(3),
            pengalaman: pengalaman.dataValues.pengalaman,
            bidang_kerja: pencari.bidang_kerja.detail_bidang,
            simpan_pencari: simpan_pencari ? simpan_pencari : null,
          };
        })
      );

      return successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJA", {
        pekerja: pencariWithRating,
        totalPage,
        page,
        limit,
        totalRows,
      });
    }

    if (min_usia > max_usia) {
      return errorResponse(res, 400, "MAX_USIA_LESS_THAN_MIN_USIA");
    }

    if (!jenis_kelamin && !min_usia && !max_usia) {
      const totalRows = await Pencari.count({
        where: {
          id_bidang_kerja: bidang_kerja,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const pencari = await Pencari.findAll({
        where: {
          id_bidang_kerja: bidang_kerja,
        },
        attributes: {
          exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
          include: [
            [
              sequelize.literal("(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"),
              "usia",
            ],
          ],
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
            model: Bidang_Kerja,
            as: "bidang_kerja",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        // limit: [(page - 1) * +limit, +limit],
      });

      const pencariWithRating = await Promise.all(
        pencari.map(async (pencari) => {
          const rating = await Ulasan.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
            order:
              urutan === "penilaian"
                ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                : [],
          });

          const simpan_pencari = await Simpan_Pencari.findOne({
            where: {
              id_penyedia: penyedia.id,
              id_pencari: pencari.id,
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });

          const pengalaman = await Pengalaman.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],
            order:
              urutan === "pengalaman"
                ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                : [],
          });

          return {
            ...pencari.dataValues,
            rating:
              rating.dataValues.rating === null
                ? 0
                : +Number(rating.dataValues.rating).toFixed(3),
            pengalaman: pengalaman.dataValues.pengalaman,
            bidang_kerja: pencari.bidang_kerja.detail_bidang,
            simpan_pencari: simpan_pencari ? simpan_pencari : null,
          };
        })
      );

      return successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJA", {
        pekerja: pencariWithRating,
        totalPage,
        page,
        limit,
        totalRows,
      });
    } else {
      if (jenis_kelamin && +min_usia !== 0 && +max_usia !== 0) {
        const totalRows = await Pencari.count({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                gender: {
                  [Op.eq]: jenis_kelamin,
                },
              },
              {
                tanggal_lahir: {
                  [Op.between]: [
                    new Date(new Date().setFullYear(new Date().getFullYear() - max_usia)),
                    new Date(new Date().setFullYear(new Date().getFullYear() - min_usia)),
                  ],
                },
              },
            ],
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
          ],
        });

        const totalPage = Math.ceil(totalRows / limit);

        const pencari = await Pencari.findAll({
          attributes: {
            exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
            include: [
              [
                sequelize.literal(
                  "(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"
                ),
                "usia",
              ],
            ],
          },
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                tanggal_lahir: {
                  [Op.and]: {
                    [Op.lt]: new Date(
                      new Date().setFullYear(new Date().getFullYear() - min_usia)
                    ),
                    [Op.gt]: new Date(
                      new Date().setFullYear(new Date().getFullYear() - max_usia)
                    ),
                  },
                },
              },
              {
                gender: {
                  [Op.eq]: jenis_kelamin,
                },
              },
            ],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
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
          ],
          // limit: [(page - 1) * +limit, +limit],
        });

        const pencariWithRating = await Promise.all(
          pencari.map(async (pencari) => {
            const rating = await Ulasan.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
              order:
                urutan === "penilaian"
                  ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                  : [],
            });

            const pengalaman = await Pengalaman.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],

              order:
                urutan === "pengalaman"
                  ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                  : [],
            });

            const simpan_pencari = await Simpan_Pencari.findOne({
              where: {
                id_penyedia: penyedia.id,
                id_pencari: pencari.id,
              },
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            });

            return {
              ...pencari.dataValues,
              rating:
                rating.dataValues.rating === null
                  ? 0
                  : +Number(rating.dataValues.rating).toFixed(3),
              pengalaman: pengalaman.dataValues.pengalaman,
              bidang_kerja: pencari.bidang_kerja.detail_bidang,
              simpan_pencari: simpan_pencari ? simpan_pencari : null,
            };
          })
        );

        return successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJA", {
          pekerja: pencariWithRating,
          totalPage,
          page,
          limit,
          totalRows,
        });
      } else {
        const totalRows = await Pencari.count({
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                [Op.or]: [
                  {
                    tanggal_lahir: {
                      [Op.between]: {
                        [Op.lt]: new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() - min_usia !== undefined
                              ? min_usia
                              : 1
                          )
                        ),
                        [Op.gt]: new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() - max_usia !== undefined
                              ? max_usia
                              : 1
                          )
                        ),
                      },
                    },
                  },
                  {
                    gender: {
                      [Op.eq]: jenis_kelamin,
                    },
                  },
                ],
              },
            ],
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
          ],
        });

        const totalPage = Math.ceil(totalRows / limit);

        const pencari = await Pencari.findAll({
          attributes: {
            exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
            include: [
              [
                sequelize.literal(
                  "(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"
                ),
                "usia",
              ],
            ],
          },
          where: {
            [Op.and]: [
              {
                id_bidang_kerja: {
                  [Op.eq]: bidang_kerja,
                },
              },
              {
                [Op.or]: [
                  {
                    tanggal_lahir: {
                      [Op.between]: {
                        [Op.lt]: new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() - min_usia !== undefined
                              ? min_usia
                              : 1
                          )
                        ),
                        [Op.gt]: new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() - max_usia !== undefined
                              ? max_usia
                              : 1
                          )
                        ),
                      },
                    },
                  },
                  {
                    gender: {
                      [Op.eq]: jenis_kelamin,
                    },
                  },
                ],
              },
            ],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
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
          ],
          // limit: [(page - 1) * +limit, +limit],
        });

        const pencariWithRating = await Promise.all(
          pencari.map(async (pencari) => {
            const rating = await Ulasan.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
              order:
                urutan === "penilaian"
                  ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                  : [],
            });

            const pengalaman = await Pengalaman.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],

              order:
                urutan === "pengalaman"
                  ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                  : [],
            });

            const simpan_pencari = await Simpan_Pencari.findOne({
              where: {
                id_penyedia: penyedia.id,
                id_pencari: pencari.id,
              },
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            });

            return {
              ...pencari.dataValues,
              rating:
                rating.dataValues.rating === null
                  ? 0
                  : +Number(rating.dataValues.rating).toFixed(3),
              pengalaman: pengalaman.dataValues.pengalaman,
              bidang_kerja: pencari.bidang_kerja.detail_bidang,
              simpan_pencari: simpan_pencari ? simpan_pencari : null,
            };
          })
        );

        return successResWithData(res, 200, "SUCCESS_GET_ALL_PEKERJA", {
          pekerja: pencariWithRating,
          totalPage,
          page,
          limit,
          totalRows,
        });
      }
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Done
exports.getDataSavePencari = async (req, res) => {
  try {
    const userLogin = req.user;
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    const { bidang_kerja, gender, max_usia, min_usia, urutan } = req.query;

    const dataPenyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    if (max_usia < min_usia) {
      return errorResponse(res, 400, "MAX_USIA_LESS_THAN_MIN_USIA");
    }

    if (!bidang_kerja && !gender && !max_usia && !min_usia) {
      const totalRows = await Simpan_Pencari.count({
        where: {
          id_penyedia: dataPenyedia.id,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const dataSimpan = await Simpan_Pencari.findAll({
        where: {
          id_penyedia: dataPenyedia.id,
        },
        // limit: [(page - 1) * +limit, +limit],
      });

      const dataPencari = await Promise.all(
        dataSimpan.map(async (simpan) => {
          const pencari = await Pencari.findOne({
            where: {
              id: simpan.id_pencari,
            },
            attributes: {
              exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
              include: [
                [
                  sequelize.literal(
                    "(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"
                  ),
                  "usia",
                ],
              ],
            },
            include: [
              {
                model: Bidang_Kerja,
                as: "bidang_kerja",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
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
            ],
          });

          const rating = await Ulasan.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
            order:
              urutan === "penilaian"
                ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                : [],
          });

          const pengalaman = await Pengalaman.findOne({
            where: {
              id_pencari: pencari.id,
            },
            attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],
            order:
              urutan === "pengalaman"
                ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                : [],
          });

          return {
            ...pencari.dataValues,
            rating:
              rating.dataValues.rating === null
                ? 0
                : +Number(rating.dataValues.rating).toFixed(3),
            pengalaman: pengalaman.dataValues.pengalaman,
            bidang_kerja: pencari.bidang_kerja.detail_bidang,
            simpan_pencari: {
              id: simpan.id,
              isSave: simpan.isSave,
              uuid_simpan: simpan.uuid_simpan,
            },
          };
        })
      );

      successResWithData(res, 200, "SUCCESS_GET_DATA_SAVE_PENCARI", {
        pekerja: dataPencari,
        totalPage,
        page,
        limit,
        totalRows,
      });
    } else {
      if (bidang_kerja && gender && max_usia && min_usia) {
        const totalRows = await Simpan_Pencari.count({
          where: {
            id_penyedia: dataPenyedia.id,
          },
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataSimpan = await Simpan_Pencari.findAll({
          where: {
            id_penyedia: dataPenyedia.id,
          },
          // limit: [(page - 1) * +limit, +limit],
        });

        const dataPencari = await Promise.all(
          dataSimpan.map(async (simpan) => {
            const pencari = await Pencari.findOne({
              attributes: {
                exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
                include: [
                  [
                    sequelize.literal(
                      "(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"
                    ),
                    "usia",
                  ],
                ],
              },
              include: [
                {
                  model: Bidang_Kerja,
                  as: "bidang_kerja",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
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
              ],
              where: {
                [Op.and]: [
                  {
                    id: {
                      [Op.eq]: simpan.id_pencari,
                    },
                    id_bidang_kerja: {
                      [Op.eq]: bidang_kerja,
                    },
                  },
                  {
                    gender: {
                      [Op.eq]: gender,
                    },
                  },
                  {
                    tanggal_lahir: {
                      [Op.and]: {
                        [Op.lt]: new Date(
                          new Date().setFullYear(new Date().getFullYear() - min_usia)
                        ),
                        [Op.gt]: new Date(
                          new Date().setFullYear(new Date().getFullYear() - max_usia)
                        ),
                      },
                    },
                  },
                ],
              },
            });

            if (pencari === null) {
              return null;
            }
            const rating = await Ulasan.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
              order:
                urutan === "penilaian"
                  ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                  : [],
            });

            const pengalaman = await Pengalaman.findOne({
              where: {
                id_pencari: pencari.id,
              },
              attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],
              order:
                urutan === "pengalaman"
                  ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                  : [],
            });

            return {
              ...pencari.dataValues,
              rating:
                rating.dataValues.rating === null
                  ? 0
                  : +Number(rating.dataValues.rating).toFixed(3),
              pengalaman: pengalaman.dataValues.pengalaman,
              bidang_kerja: pencari.bidang_kerja.detail_bidang,
              simpan_pencari: {
                id: simpan.id,
                isSave: simpan.isSave,
                uuid_simpan: simpan.uuid_simpan,
              },
            };
          })
        );

        successResWithData(res, 200, "SUCCESS_GET_DATA_SAVE_PENCARI", {
          pekerja: dataPencari.filter((data) => data !== undefined),
          totalPage,
          page,
          limit,
          totalRows,
        });
      } else {
        const totalRows = await Simpan_Pencari.count({
          where: {
            id_penyedia: dataPenyedia.id,
          },
        });

        const totalPage = Math.ceil(totalRows / limit);

        const dataSimpan = await Simpan_Pencari.findAll({
          where: {
            id_penyedia: dataPenyedia.id,
          },
          // limit: [(page - 1) * +limit, +limit],
        });

        const dataPencari = await Promise.all(
          dataSimpan.map(async (simpan) => {
            const pencari = await Pencari.findOne({
              attributes: {
                exclude: ["id_user", "updatedAt", "createdAt", "id_bidang_kerja"],
                include: [
                  [
                    sequelize.literal(
                      "(SELECT TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()))"
                    ),
                    "usia",
                  ],
                ],
              },
              include: [
                {
                  model: Bidang_Kerja,
                  as: "bidang_kerja",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
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
              ],
              where: {
                [Op.or]: [
                  {
                    id: {
                      [Op.eq]: simpan.id_pencari,
                    },
                    id_bidang_kerja: {
                      [Op.eq]: bidang_kerja,
                    },
                  },
                  {
                    gender: {
                      [Op.eq]: gender,
                    },
                  },
                  {
                    tanggal_lahir: {
                      [Op.between]: {
                        [Op.lt]: new Date(
                          new Date().setFullYear(new Date().getFullYear() - min_usia)
                        ),
                        [Op.gt]: new Date(
                          new Date().setFullYear(new Date().getFullYear() - max_usia)
                        ),
                      },
                    },
                  },
                ],
              },
            });
            if (pencari === null) {
              return;
            } else {
              const rating = await Ulasan.findOne({
                where: {
                  id_pencari: pencari.id,
                },
                attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "rating"]],
                order:
                  urutan === "penilaian"
                    ? [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]]
                    : [],
              });

              const pengalaman = await Pengalaman.findOne({
                where: {
                  id_pencari: pencari.id,
                },
                attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "pengalaman"]],
                order:
                  urutan === "pengalaman"
                    ? [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]]
                    : [],
              });

              return {
                ...pencari.dataValues,
                rating:
                  rating.dataValues.rating === null
                    ? 0
                    : +Number(rating.dataValues.rating).toFixed(3),
                pengalaman: pengalaman.dataValues.pengalaman,
                bidang_kerja: pencari.bidang_kerja.detail_bidang,
                simpan_pencari: {
                  id: simpan.id,
                  isSave: simpan.isSave,
                  uuid_simpan: simpan.uuid_simpan,
                },
              };
            }
          })
        );

        successResWithData(res, 200, "SUCCESS_GET_DATA_SAVE_PENCARI", {
          pekerja: dataPencari.filter((data) => data !== undefined),
          totalPage,
          page,
          limit,
          totalRows,
        });
      }
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Detail Profile Penyedia
exports.detailProfilePenyedia = async (req, res) => {
  try {
    const { uuid_user } = req.params;

    const userLogin = req.user;

    const pencari = await Pencari.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const userData = await User.findOne({
      where: {
        uuid_user,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "resetPassword", "id_role"],
      },
    });

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userData.id,
      },
      attributes: ["id", "tentang"],
    });

    const dataLowongan = await Lowongan.findAll({
      where: {
        id_penyedia: penyedia.id,
      },
      attributes: {
        exclude: ["id_penyedia", "updatedAt", "id_bidang_kerja"],
      },
      include: [
        {
          model: Bidang_Kerja,
          as: "bidang_kerja",
          attributes: ["detail_bidang", "id"],
        },
      ],
    });

    const newLowongan = await Promise.all(
      dataLowongan.map(async (lowongan) => {
        const simpan_lowongan = await Simpan_Lowongan.findOne({
          where: {
            id_lowongan: lowongan.id,
            id_pencari: pencari.id,
          },
          attributes: {
            exclude: ["id_lowongan", "id_pencari", "updatedAt"],
          },
        });

        return {
          ...lowongan.dataValues,
          bidang_kerja: {
            photo:
              lowongan.bidang_kerja.id === 1
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                : lowongan.bidang_kerja.id === 2
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                : lowongan.bidang_kerja.id === 3
                ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
            detail_bidang: lowongan.bidang_kerja.detail_bidang,
          },
          simpan_lowongan: simpan_lowongan,
        };
      })
    );

    successResWithData(res, 200, "SUCCESS_GET_DATA_PENYEDIA", {
      penyedia: {
        ...userData.dataValues,
        tentang: penyedia.tentang,
      },
      lowongan: newLowongan,
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Detail Profile Pencari
// Done
exports.detailProfilePencari = async (req, res) => {
  try {
    const { uuid_user } = req.params;

    const userLogin = req.user;

    const penyedia = await Penyedia.findOne({
      where: {
        id_user: userLogin.id,
      },
    });

    const pencari = await User.findOne({
      where: {
        uuid_user,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "resetPassword", "id_role"],
      },
      include: [
        {
          model: Pencari,
          as: "pencari",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id_user", "id_bidang_kerja"],
          },
          include: [
            {
              model: Bidang_Kerja,
              as: "bidang_kerja",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
            {
              model: Ulasan,
              as: "ulasan",
              attributes: {
                exclude: ["id", "updatedAt", "id_pencari", "id_lowongan"],
              },
              include: [
                {
                  model: Lowongan,
                  as: "lowongan",
                  attributes: {
                    exclude: [
                      "id",
                      "createdAt",
                      "updatedAt",
                      "id_penyedia",
                      "id_bidang_kerja",
                    ],
                  },
                  include: [
                    {
                      model: Bidang_Kerja,
                      as: "bidang_kerja",
                      attributes: ["id", "detail_bidang"],
                    },
                    {
                      model: Penyedia,
                      as: "penyedia",
                      attributes: ["id"],
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
            {
              model: Pendidikan,
              as: "pendidikan",
              attributes: ["tahun_awal", "tahun_akhir", "nama_pendidikan"],
            },
            {
              model: Pengalaman,
              as: "pengalaman",
              attributes: {
                exclude: [
                  "id",
                  "createdAt",
                  "updatedAt",
                  "id_pencari",
                  "uuid_pengalaman",
                ],
              },
            },
          ],
        },
      ],
    });

    const simpan_pencari = await Simpan_Pencari.findOne({
      where: {
        id_pencari: pencari.pencari.id,
        id_penyedia: penyedia.id,
      },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });

    const newPencari = {
      ...pencari.dataValues,
      simpan_pencari: simpan_pencari ? simpan_pencari.dataValues : null,
      pencari: {
        ...pencari.pencari.dataValues,
        ulasan: pencari.pencari.ulasan.map((ulasan) => {
          return {
            ...ulasan.dataValues,
            lowongan: {
              ...ulasan.lowongan.dataValues,
              bidang_kerja: {
                id: ulasan.lowongan.bidang_kerja.id,
                photo:
                  ulasan.lowongan.bidang_kerja.id === 1
                    ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
                    : ulasan.lowongan.bidang_kerja.id === 2
                    ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
                    : ulasan.lowongan.bidang_kerja.id === 3
                    ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
                    : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
              },
            },
          };
        }),
      },
    };

    successResWithData(res, 200, "SUCCESS_GET_DETAIL_PENCARI", newPencari);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Untuk Super admin
// exports.getAllUser = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const userLogin = req.user;

//     if (userLogin.role_id === 1) {
//       return errorResponse(res, 403, "YOUR_NOT_ADMIN");
//     } else {
//       const users = await User.findAll({
//         where: {
//           [Op.or]: [
//             {
//               name_user: {
//                 [Op.like]: `%${search ? search : ""}%`,
//               },
//             },
//             {
//               email: {
//                 [Op.like]: `%${search ? search : ""}%`,
//               },
//             },
//           ],
//         },
//         attributes: { exclude: ["password", "updatedAt"] },
//       });

//       successResWithData(res, 200, "SUCCESS_GET_ALL_USER", users);
//     }
//   } catch (error) {
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };

exports.updatePhotoProfile = async (req, res) => {
  try {
    const userLogin = req.user;

    await User.update(
      {
        photo_profile: req.file != undefined ? req.file.path : null,
      },
      {
        where: {
          id: userLogin.id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_UPDATE_PHOTO_PROFILE");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
