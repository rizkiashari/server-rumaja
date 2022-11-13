"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pencari", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.ENUM("pria", "wanita"),
      },
      alamat_rumah: {
        type: Sequelize.TEXT,
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
      },
      tempat_lahir: {
        type: Sequelize.STRING(50),
      },
      tentang: {
        type: Sequelize.TEXT,
      },
      tinggi_badan: {
        type: Sequelize.INTEGER,
      },
      berat_badan: {
        type: Sequelize.INTEGER,
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("pencari");
  },
};
