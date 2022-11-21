'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('clients', [
      {
        name: 'Pedro',
        surname: 'Lopez',
        dni: 78987612,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Laura',
        surname: 'Ortega',
        dni: 89716273,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tito',
        surname: 'Lasanta',
        dni: 21787663,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nora',
        surname: 'Martinez',
        dni: 88371823,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clients', null, {});
  }
};
