"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        as: "role",
        foreignKey: {
          name: "role_id",
        },
      });

      User.hasMany(models.Pendidikan, {
        as: "Pendidikan",
        foreignKey: {
          name: "user_id",
        },
      });

      User.hasOne(models.Penyedia, {
        as: "Pencari",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  User.init(
    {
      uuid_user: DataTypes.STRING,
      name_user: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      resetPassword: DataTypes.STRING,
      nomor_wa: DataTypes.STRING(17),
      createdAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
