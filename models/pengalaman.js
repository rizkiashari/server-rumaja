"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengalaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pengalaman.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Pengalaman.init(
    {
      uuid_pengalaman: DataTypes.STRING(200),
      nama_pengalaman: DataTypes.STRING(50),
      pengalaman_prov: DataTypes.INTEGER,
      tahun_mulai: DataTypes.INTEGER,
      tahun_akhir: DataTypes.INTEGER,
      isWork: DataTypes.BOOLEAN,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pengalaman",
      tableName: "pengalaman",
    }
  );
  return Pengalaman;
};
