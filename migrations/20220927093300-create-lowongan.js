"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lowongan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_lowongan: {
        type: Sequelize.STRING(200),
      },
      gaji: {
        type: Sequelize.INTEGER,
      },
      skala_gaji: {
        type: Sequelize.ENUM("hari", "minggu", "bulan"),
      },
      kualifikasi: {
        type: Sequelize.TEXT,
      },
      isPublish: {
        type: Sequelize.BOOLEAN,
      },
      deskripsi_lowongan: {
        type: Sequelize.TEXT,
      },
      fasilitas: {
        type: Sequelize.TEXT,
      },
      kota_lowongan: {
        type: Sequelize.INTEGER,
      },
      provinsi_lowongan: {
        type: Sequelize.INTEGER,
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
      id_penyedia: {
        type: Sequelize.INTEGER,
        references: {
          model: "penyedia",
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
    await queryInterface.dropTable("lowongan");
  },
};
