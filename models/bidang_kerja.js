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
      Bidang_Kerja.hasMany(models.Lowongan, {
        as: "lowongan",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });

      Bidang_Kerja.hasMany(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });
    }
  }
  Bidang_Kerja.init(
    {
      nama_bidang: DataTypes.STRING(15),
      detail_bidang: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "Bidang_Kerja",
      tableName: "bidang_kerja",
    }
  );
  return Bidang_Kerja;
};
