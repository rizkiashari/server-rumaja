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
      domisili: DataTypes.STRING,
      description: DataTypes.TEXT,
      photo_profile: DataTypes.STRING,
      header_profile: DataTypes.STRING,
      no_telp: DataTypes.STRING(17),
      bukti_berkas: DataTypes.STRING,
      spesialis: DataTypes.STRING,
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pencari",
      tableName: "pencaris",
    }
  );
  return Pencari;
};
