"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pendidikan.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Pendidikan.init(
    {
      uuid_pendidikan: DataTypes.STRING(200),
      nama_pendidikan: DataTypes.STRING(50),
      tahun_awal: DataTypes.INTEGER,
      tahun_akhir: DataTypes.INTEGER,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pendidikan",
      tableName: "pendidikan",
    }
  );
  return Pendidikan;
};
