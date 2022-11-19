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
          name: "id_role",
        },
      });

      User.hasOne(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_user",
        },
      });

      User.hasOne(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  User.init(
    {
      uuid_user: DataTypes.STRING(200),
      nama_user: DataTypes.STRING(50),
      email: DataTypes.STRING(50),
      password: DataTypes.STRING,
      resetPassword: DataTypes.STRING,
      domisili_kota: DataTypes.STRING(50),
      domisili_provinsi: DataTypes.STRING(50),
      nomor_wa: DataTypes.STRING(17),
      createdAt: DataTypes.INTEGER,
      photo_profile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
