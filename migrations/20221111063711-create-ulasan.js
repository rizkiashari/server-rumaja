"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ulasan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      id_pencari: {
        type: Sequelize.INTEGER,
        references: {
          model: "pencari",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      catatan_pencari: {
        type: Sequelize.TEXT,
      },
      catatan_penyedia: {
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
    await queryInterface.dropTable("ulasan");
  },
};
