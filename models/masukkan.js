"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Masukkan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Masukkan.belongsTo(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_penyedia",
        },
      });

      Masukkan.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Masukkan.init(
    {
      detail_masukkan: DataTypes.TEXT,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Masukkan",
      tableName: "masukkan",
    }
  );
  return Masukkan;
};
