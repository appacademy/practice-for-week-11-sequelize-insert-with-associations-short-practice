'use strict';

const { Band } = require('../models');
const {Op} = require('sequelize')

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

    // Capture references to bands to use in musician seeds
    const fallingBox = await Band.findOne({
      where: { name: 'The Falling Box' }
    });
    const americaPiano = await Band.findOne({
      where: { name: 'America The Piano' }
    });
    const lovedAutumn = await Band.findOne({
      where: { name: 'Loved Autumn' }
    });
    const playinSound = await Band.findOne({
      where: { name: 'Playin Sound' }
    });
    const kingRiver = await Band.findOne({
      where: { name: 'The King River' }
    });

    await queryInterface.bulkInsert('Musicians', [
      { firstName: 'Adam', lastName: 'Appleby', bandId: fallingBox.id },
      { firstName: 'Anton', lastName: 'Martinovic', bandId: fallingBox.id },
      { firstName: 'Wilson', lastName: 'Holt', bandId: fallingBox.id },
      { firstName: 'Marine', lastName: 'Sweet', bandId: americaPiano.id },
      { firstName: 'Georgette', lastName: 'Kubo', bandId: americaPiano.id },
      { firstName: 'Aurora', lastName: 'Hase', bandId: lovedAutumn.id },
      { firstName: 'Trenton', lastName: 'Lesley', bandId: playinSound.id },
      { firstName: 'Camila', lastName: 'Nenci', bandId: playinSound.id },
      { firstName: 'Rosemarie', lastName: 'Affini', bandId: kingRiver.id },
      { firstName: 'Victoria', lastName: 'Cremonesi', bandId: kingRiver.id },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Musicians', {
      [Op.or]: [
        { firstName: 'Adam', lastName: 'Appleby' },
        { firstName: 'Anton', lastName: 'Martinovic' },
        { firstName: 'Wilson', lastName: 'Holt' },
        { firstName: 'Marine', lastName: 'Sweet' },
        { firstName: 'Georgette', lastName: 'Kubo' },
        { firstName: 'Aurora', lastName: 'Hase' },
        { firstName: 'Trenton', lastName: 'Lesley' },
        { firstName: 'Camila', lastName: 'Nenci' },
        { firstName: 'Rosemarie', lastName: 'Affini' },
        { firstName: 'Victoria', lastName: 'Cremonesi '}
      ]
    })
  }
};