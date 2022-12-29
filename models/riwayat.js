"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Riwayat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Riwayat.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Riwayat.belongsTo(models.Lowongan, {
        as: "lowongan",
        foreignKey: {
          name: "id_lowongan",
        },
      });

      Riwayat.hasMany(models.Progres, {
        as: "progres",
        foreignKey: {
          name: "id_riwayat",
        },
      });

      Riwayat.hasMany(models.Notifikasi, {
        as: "notifikasi",
        foreignKey: {
          name: "id_riwayat",
        },
      });
    }
  }
  Riwayat.init(
    {
      uuid_riwayat: DataTypes.STRING(200),
      status: DataTypes.ENUM("diproses", "bekerja", "selesai", "ditolak"),
      info_riwayat: DataTypes.ENUM("applied", "hired"),
      catatan_riwayat_pencari: DataTypes.TEXT,
      catatan_riwayat_penyedia: DataTypes.TEXT,
      waktu_mulai_kerja: DataTypes.TIME,
      tanggal_mulai_kerja: DataTypes.INTEGER,
      isPengalaman: DataTypes.BOOLEAN,
      temp_status: DataTypes.STRING(20),
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Riwayat",
      tableName: "riwayat",
    }
  );
  return Riwayat;
};
