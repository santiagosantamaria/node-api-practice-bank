'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Insert 14 records in table
    
    for (let i = 1; i <= 14; i++) {
    
      await queryInterface.bulkInsert('transactions', [
        {
          fromAccount: "1110121369872637",
          toAccount: "1220121369872637",
          amount: 21000,
          description: "Transferencia Automatica",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});

    } 
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};
