"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pencari extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pencari.hasMany(models.Pendidikan, {
        as: "pendidikan",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Pencari.hasMany(models.Pengalaman, {
        as: "pengalaman",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Pencari.belongsTo(models.User, {
        as: "users",
        foreignKey: {
          name: "id_user",
        },
      });

      Pencari.belongsTo(models.Bidang_Kerja, {
        as: "bidang_kerja",
        foreignKey: {
          name: "id_bidang_kerja",
        },
      });

      Pencari.hasMany(models.Ulasan, {
        as: "ulasan",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Pencari.hasOne(models.Simpan_Lowongan, {
        as: "simpan_lowongan",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Pencari.hasOne(models.Simpan_Pencari, {
        as: "simpan_pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });
    }
  }
  Pencari.init(
    {
      gender: DataTypes.ENUM("pria", "wanita"),
      alamat_rumah: DataTypes.TEXT,
      tanggal_lahir: DataTypes.DATE,
      tempat_lahir: DataTypes.STRING(50),
      tentang: DataTypes.TEXT,
      tinggi_badan: DataTypes.INTEGER,
      berat_badan: DataTypes.INTEGER,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pencari",
      tableName: "pencari",
    }
  );
  return Pencari;
};
