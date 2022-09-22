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
      Pendidikan.belongsTo(models.User, {
        as: "users",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  Pendidikan.init(
    {
      uuid_pendidikan: DataTypes.STRING,
      nama: DataTypes.STRING,
      jurusan: DataTypes.STRING,
      tahun_awal: DataTypes.STRING(13),
      tahun_akhir: DataTypes.STRING(13),
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pendidikan",
      tableName: "pendidikans",
    }
  );
  return Pendidikan;
};
