"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("masukkan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_penyedia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "penyedia",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pencari: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "pencari",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      detail_masukkan: {
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
    await queryInterface.dropTable("masukkan");
  },
};
