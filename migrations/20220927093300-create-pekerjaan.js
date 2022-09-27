"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pekerjaans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_kerja: {
        type: Sequelize.STRING,
      },
      posisi_kerja: {
        type: Sequelize.STRING,
      },
      perkiraan_gaji: {
        type: Sequelize.STRING,
      },
      kualifikasi: {
        type: Sequelize.TEXT,
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
      id_bidang_kerja: {
        type: Sequelize.INTEGER,
        references: {
          model: "bidang_kerjas",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      isSave: {
        type: Sequelize.BOOLEAN,
      },
      deskripsi_kerja: {
        type: Sequelize.TEXT,
      },
      fasilitas: {
        type: Sequelize.TEXT,
      },
      lokasi_kerja: {
        type: Sequelize.STRING,
      },
      lamar_sebelum_tgl: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Pekerjaans");
  },
};
