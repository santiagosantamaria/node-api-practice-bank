'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('accounts', [
      {
        number: "1110121369872637",
        clientId: 1,
        balance: 20000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: "1220121369872637",
        clientId: 2,
        balance: 12000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: "2220121369872637",
        clientId: 3,
        balance: 90000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: "7770121369872637",
        clientId: 4,
        balance: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
  ], {});
    
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('accounts', null, {});
     
  }
};
