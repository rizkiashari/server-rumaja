"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("progres", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      informasi: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("progres");
  },
};
