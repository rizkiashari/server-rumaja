"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Simpan_Pencari extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Simpan_Pencari.belongsTo(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_penyedia",
        },
      });

      Simpan_Pencari.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Simpan_Pencari.init(
    {
      uuid_simpan: DataTypes.STRING(200),
      isSave: DataTypes.BOOLEAN,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Simpan_Pencari",
      tableName: "simpan_pencari",
    }
  );
  return Simpan_Pencari;
};
