"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifikasi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      detail_notifikasi: {
        type: Sequelize.TEXT,
      },
      isRead: {
        type: Sequelize.BOOLEAN,
      },
      id_riwayat: {
        type: Sequelize.INTEGER,
        references: {
          model: "riwayat",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("notifikasi");
  },
};
