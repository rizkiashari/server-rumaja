"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lowongan.belongsTo(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_penyedia",
        },
      });

      Lowongan.belongsTo(models.Bidang_Kerja, {
        as: "bidang_kerja",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });

      Lowongan.hasMany(models.Ulasan, {
        as: "ulasan",
        foreignKey: {
          name: "id_lowongan",
        },
      });

      Lowongan.hasMany(models.Simpan_Lowongan, {
        as: "simpan_lowongan",
        foreignKey: {
          name: "id_lowongan",
        },
      });
    }
  }
  Lowongan.init(
    {
      uuid_lowongan: DataTypes.STRING(200),
      gaji: DataTypes.INTEGER,
      skala_gaji: DataTypes.ENUM("hari", "minggu", "bulan"),
      kualifikasi: DataTypes.TEXT,
      isPublish: DataTypes.BOOLEAN,
      deskripsi_lowongan: DataTypes.TEXT,
      fasilitas: DataTypes.TEXT,
      kota_lowongan: DataTypes.INTEGER,
      provinsi_lowongan: DataTypes.INTEGER,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lowongan",
      tableName: "lowongan",
    }
  );
  return Lowongan;
};
