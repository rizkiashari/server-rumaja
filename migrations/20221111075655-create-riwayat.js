"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riwayat", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_riwayat: {
        type: Sequelize.STRING(200),
      },
      status: {
        type: Sequelize.ENUM("diproses", "bekerja", "selesai", "ditolak"),
      },
      info_riwayat: {
        type: Sequelize.ENUM("applied", "hired"),
      },
      catatan_riwayat_pencari: {
        type: Sequelize.TEXT,
      },
      catatan_riwayat_penyedia: {
        type: Sequelize.TEXT,
      },
      waktu_mulai_kerja: {
        type: Sequelize.TIME,
      },
      tanggal_mulai_kerja: {
        type: Sequelize.INTEGER,
      },
      id_pencari: {
        type: Sequelize.INTEGER,
        references: {
          model: "pencari",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_lowongan: {
        type: Sequelize.INTEGER,
        references: {
          model: "lowongan",
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
    await queryInterface.dropTable("riwayat");
  },
};
