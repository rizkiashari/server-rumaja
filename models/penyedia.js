"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penyedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Penyedia.belongsTo(models.User, {
        as: "users",
        foreignKey: {
          name: "id_user",
        },
      });

      Penyedia.hasMany(models.Lowongan, {
        as: "lowongan",
        foreignKey: {
          name: "id_penyedia",
        },
      });

      Penyedia.hasOne(models.Simpan_Pencari, {
        as: "simpan_pencari",
        foreignKey: {
          name: "id_penyedia",
        },
      });

      Penyedia.hasOne(models.Masukkan, {
        as: "masukkan",
        foreignKey: {
          name: "id_penyedia",
        },
      });
    }
  }
  Penyedia.init(
    {
      gender: DataTypes.ENUM("pria", "wanita"),
      alamat_rumah: DataTypes.TEXT,
      tanggal_lahir: DataTypes.DATE,
      tempat_lahir: DataTypes.STRING(50),
      tentang: DataTypes.TEXT,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Penyedia",
      tableName: "penyedia",
    }
  );
  return Penyedia;
};
