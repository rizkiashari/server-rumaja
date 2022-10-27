"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        as: "role",
        foreignKey: {
          name: "role_id",
        },
      });

      User.belongsTo(models.Bidang_Kerja, {
        as: "bidang_kerja",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });

      User.hasOne(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "user_id",
        },
      });

      User.hasOne(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  User.init(
    {
      uuid_user: DataTypes.STRING,
      name_user: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      resetPassword: DataTypes.STRING,
      domisili_kota: DataTypes.INTEGER,
      domisili_provinsi: DataTypes.INTEGER,
      id_bidang_kerja: DataTypes.INTEGER,
      nomor_wa: DataTypes.STRING(17),
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
