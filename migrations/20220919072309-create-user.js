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
        type: Sequelize.STRING,
      },
      nomor_wa: {
        type: Sequelize.STRING(17),
      },
      name_user: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      id_bidang_kerja: {
        type: Sequelize.INTEGER,
        references: {
          model: "bidang_kerja",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      role_id: {
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
