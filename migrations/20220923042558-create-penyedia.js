"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penyedia", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.ENUM("pria", "wanita"),
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
      },
      tentang: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("penyedia");
  },
};
