"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pengalaman", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid_pengalaman: {
        type: Sequelize.STRING(200),
      },
      nama_pengalaman: {
        type: Sequelize.STRING(50),
      },
      pengalaman_prov: {
        type: Sequelize.STRING(50),
      },
      tahun_mulai: {
        type: Sequelize.STRING(50),
      },
      tahun_akhir: {
        type: Sequelize.STRING(50),
      },
      isWork: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("pengalaman");
  },
};
