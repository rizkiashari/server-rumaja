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
        type: Sequelize.STRING(200),
      },
      nama_pendidikan: {
        type: Sequelize.STRING(50),
      },
      tahun_awal: {
        type: Sequelize.INTEGER,
      },
      tahun_akhir: {
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
