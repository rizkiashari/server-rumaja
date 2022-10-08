"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Pencari, {
        as: "pencari",
        foreignKey: {
          name: "id_pencari",
        },
      });

      Review.belongsTo(models.Penyedia, {
        as: "penyedia",
        foreignKey: {
          name: "id_penyedia",
        },
      });
    }
  }
  Review.init(
    {
      ulasan_detail_pencari: DataTypes.TEXT,
      ulasan_detail_penyedia: DataTypes.TEXT,
      rating: DataTypes.FLOAT,
      periode_awal_kerja: DataTypes.INTEGER,
      periode_akhir_kerja: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "review",
    }
  );
  return Review;
};
