"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_user: {
        type: Sequelize.STRING(200),
      },
      nama_user: {
        type: Sequelize.STRING(50),
      },
      nomor_wa: {
        type: Sequelize.STRING(17),
      },
      email: {
        type: Sequelize.STRING(50),
      },
      password: {
        type: Sequelize.STRING,
      },
      resetPassword: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      photo_profile: {
        type: Sequelize.STRING,
      },
      domisili_kota: {
        type: Sequelize.INTEGER,
      },
      domisili_provinsi: {
        type: Sequelize.INTEGER,
      },
      id_role: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
