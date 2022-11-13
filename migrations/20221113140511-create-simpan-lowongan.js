"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("simpan_lowongan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_simpan: {
        type: Sequelize.STRING(200),
      },
      id_lowongan: {
        type: Sequelize.INTEGER,
        references: {
          model: "lowongan",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pencari: {
        type: Sequelize.INTEGER,
        references: {
          model: "pencari",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isSave: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("simpan_lowongan");
  },
};
