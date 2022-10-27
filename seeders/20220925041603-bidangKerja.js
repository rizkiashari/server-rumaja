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
      "bidang_kerja",
      [
        {
          name_bidang: "ART",
          bidang_detail: "Asisten Rumah Tangga",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Babysitter",
          bidang_detail: "Pengasuh Anak",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Driver",
          bidang_detail: "Supir Pribadi",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          name_bidang: "Gardener",
          bidang_detail: "Tukang Kebun",
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
    await queryInterface.bulkDelete("bidang_kerja", null, {});
  },
};
