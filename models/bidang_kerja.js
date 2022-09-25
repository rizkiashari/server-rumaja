"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bidang_Kerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bidang_Kerja.init(
    {
      name_bidang: DataTypes.STRING,
      singkatan_bidang: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bidang_Kerja",
      tableName: "bidang_kerjas",
    }
  );
  return Bidang_Kerja;
};
