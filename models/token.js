"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init(
    {
      user_id: DataTypes.INTEGER,
      token: DataTypes.STRING,
      expired_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Token",
      tableName: "token",
    }
  );
  return Token;
};
