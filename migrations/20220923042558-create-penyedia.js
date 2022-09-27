"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penyedia", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      domisili: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      photo_profile: {
        type: Sequelize.STRING,
      },
      header_profile: {
        type: Sequelize.STRING,
      },
      no_telp: {
        type: Sequelize.STRING(17),
      },
      gender: {
        type: Sequelize.STRING(100),
      },
      alamat_rumah: {
        type: Sequelize.STRING,
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
      },
      tentang: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("penyedia");
  },
};
