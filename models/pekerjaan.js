"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pekerjaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pekerjaan.belongsTo(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_penyedia",
        },
      });
      Pekerjaan.belongsTo(models.Bidang_Kerja, {
        as: "bidang_kerja",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });
    }
  }
  Pekerjaan.init(
    {
      uuid_kerja: DataTypes.STRING,
      posisi_kerja: DataTypes.STRING,
      perkiraan_gaji: DataTypes.STRING,
      kualifikasi: DataTypes.TEXT,
      id_penyedia: DataTypes.INTEGER,
      id_bidang_kerja: DataTypes.INTEGER,
      isSave: DataTypes.BOOLEAN,
      deskripsi_kerja: DataTypes.TEXT,
      fasilitas: DataTypes.TEXT,
      lokasi_kerja: DataTypes.STRING,
      lamar_sebelum_tgl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pekerjaan",
    }
  );
  return Pekerjaan;
};
