'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
    await queryInterface.bulkInsert('Instruments', [
      { type: 'piano' },
      { type: 'guitar' },
      { type: 'drums' },
      { type: 'bass' },
      { type: 'violin' },
      { type: 'cello' },
      { type: 'trumpet' },
      { type: 'saxophone' }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Instruments', {
      type: [
        'piano', 'guitar', 'drums', 'bass', 
        'violin', 'cello', 'trumpet', 'saxophone'
      ]
    })
  }
};