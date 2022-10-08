"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pencari", {
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
      photo_profile: {
        type: Sequelize.STRING,
      },
      date_open_work: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING(100),
      },
      alamat_rumah: {
        type: Sequelize.STRING,
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
      },
      tempat_lahir: {
        type: Sequelize.STRING,
      },
      tentang: {
        type: Sequelize.TEXT,
      },
      isSave: {
        type: Sequelize.BOOLEAN,
      },
      kota: {
        type: Sequelize.INTEGER,
      },
      provinsi: {
        type: Sequelize.INTEGER,
      },
      tinggi_badan: {
        type: Sequelize.INTEGER,
      },
      berat_badan: {
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
    await queryInterface.dropTable("pencari");
  },
};
