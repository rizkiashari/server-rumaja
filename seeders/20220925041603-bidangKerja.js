"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "bidang_kerjas",
      [
        {
          name_bidang: "PRT",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Pengasuh Anak",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Supir Pribadi",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Tukang Kebun",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("bidang_kerjas", null, {});
  },
};
