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

      Pencari.belongsTo(models.User, {
        as: "users",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  Pencari.init(
    {
      photo_profile: DataTypes.STRING,
      date_open_work: DataTypes.INTEGER,
      gender: DataTypes.STRING(100),
      alamat_rumah: DataTypes.STRING,
      tanggal_lahir: DataTypes.DATE,
      tempat_lahir: DataTypes.STRING,
      tentang: DataTypes.TEXT,
      isSave: DataTypes.BOOLEAN,
      kota: DataTypes.INTEGER,
      provinsi: DataTypes.INTEGER,
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
