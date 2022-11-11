"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Progres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Progres.belongsTo(models.Riwayat, {
        as: "riwayat",
        foreignKey: {
          name: "id_riwayat",
        },
      });
    }
  }
  Progres.init(
    {
      informasi: DataTypes.STRING(100),
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Progres",
      tableName: "progres",
    }
  );
  return Progres;
};
