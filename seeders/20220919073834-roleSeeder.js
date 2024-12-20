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
      "roles",
      [
        {
          nama_role: "superadmin",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          nama_role: "pencari",
          createdAt: new Date().getTime() / 1000,
          updatedAt: new Date().getTime() / 1000,
        },
        {
          nama_role: "penyedia",
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
    await queryInterface.bulkDelete("roles", null, {});
  },
};
