"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Simpan_Lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Simpan_Lowongan.belongsTo(models.Lowongan, {
        as: "lowongan",
        foreignKey: {
          name: "id_lowongan",
        },
      });

      Simpan_Lowongan.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Simpan_Lowongan.init(
    {
      uuid_simpan: DataTypes.STRING(200),
      isSave: DataTypes.BOOLEAN,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Simpan_Lowongan",
      tableName: "simpan_lowongan",
    }
  );
  return Simpan_Lowongan;
};
