"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifikasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifikasi.belongsTo(models.Riwayat, {
        as: "riwayat",
        foreignKey: {
          name: "id_riwayat",
        },
      });
    }
  }
  Notifikasi.init(
    {
      detail_notifikasi: DataTypes.TEXT,
      isRead: DataTypes.BOOLEAN,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notifikasi",
      tableName: "notifikasi",
    }
  );
  return Notifikasi;
};
