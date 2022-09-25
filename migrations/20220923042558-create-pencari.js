"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pencaris", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      domisili: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      photo_profile: {
        type: Sequelize.STRING,
      },
      header_profile: {
        type: Sequelize.STRING,
      },
      no_telp: {
        type: Sequelize.STRING(17),
      },
      bukti_berkas: {
        type: Sequelize.STRING,
      },
      spesialis: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("pencaris");
  },
};
