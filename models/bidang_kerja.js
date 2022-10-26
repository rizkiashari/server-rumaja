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
      Bidang_Kerja.hasMany(models.User, {
        as: "users",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });

      Bidang_Kerja.hasMany(models.Pekerjaan, {
        as: "pekerjaan",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });
    }
  }
  Bidang_Kerja.init(
    {
      name_bidang: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bidang_Kerja",
      tableName: "bidang_kerjas",
    }
  );
  return Bidang_Kerja;
};
