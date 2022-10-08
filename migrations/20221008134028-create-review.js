"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("review", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      id_penyedia: {
        type: Sequelize.INTEGER,
        references: {
          model: "penyedia",
          key: "id",
        },
      },
      ulasan_detail_pencari: {
        type: Sequelize.TEXT,
      },
      ulasan_detail_penyedia: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.FLOAT,
      },
      periode_awal_kerja: {
        type: Sequelize.INTEGER,
      },
      periode_akhir_kerja: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("review");
  },
};
