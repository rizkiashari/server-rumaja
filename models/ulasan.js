"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ulasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ulasan.belongsTo(models.Lowongan, {
        as: "lowongan",
        foreignKey: {
          name: "id_lowongan",
        },
      });

      Ulasan.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Ulasan.init(
    {
      catatan_pencari: DataTypes.TEXT,
      catatan_penyedia: DataTypes.TEXT,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Ulasan",
      tableName: "ulasan",
    }
  );
  return Ulasan;
};
