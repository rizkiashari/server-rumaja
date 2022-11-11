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
      uuid_user: DataTypes.STRING(200),
      name_user: DataTypes.STRING(50),
      email: DataTypes.STRING(50),
      password: DataTypes.STRING,
      resetPassword: DataTypes.STRING,
      domisili_kota: DataTypes.INTEGER,
      domisili_provinsi: DataTypes.INTEGER,
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
