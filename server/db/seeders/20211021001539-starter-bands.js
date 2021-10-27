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
   
    await queryInterface.bulkInsert('Bands', [
      { name: 'The Falling Box' },
      { name: 'America The Piano' },
      { name: 'Loved Autumn' },
      { name: 'Playin Sound' },
      { name: 'The King River' }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Bands', {
      name: [
        'The Falling Box', 'America The Piano', 'Loved Autumn', 'Playin Sound', 
        'The King River'
      ]
    })
  }
};