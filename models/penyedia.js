"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penyedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Penyedia.belongsTo(models.User, {
        as: "users",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  Penyedia.init(
    {
      domisili: DataTypes.STRING,
      description: DataTypes.TEXT,
      photo_profile: DataTypes.STRING,
      header_profile: DataTypes.STRING,
      gender: DataTypes.STRING(100),
      alamat_rumah: DataTypes.STRING,
      tanggal_lahir: DataTypes.DATE,
      tentang: DataTypes.TEXT,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Penyedia",
      tableName: "penyedia",
    }
  );
  return Penyedia;
};
