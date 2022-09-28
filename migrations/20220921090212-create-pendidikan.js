"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pendidikan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_pendidikan: {
        type: Sequelize.STRING,
      },
      nama: {
        type: Sequelize.STRING,
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
      jurusan: {
        type: Sequelize.STRING,
      },
      tahun_awal: {
        type: Sequelize.STRING(13),
      },
      tahun_akhir: {
        type: Sequelize.STRING(13),
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
    await queryInterface.dropTable("pendidikan");
  },
};
