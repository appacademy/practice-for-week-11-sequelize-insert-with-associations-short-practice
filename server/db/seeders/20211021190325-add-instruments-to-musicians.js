'use strict';

const { Instrument, Musician } = require('../models');

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

   // Capturing references to each item used in the seeds at the beginning 
   // prevents executing multiple queries throughout the seeding process

   // Capture references to musicians used in seeds
   const adam = await Musician.findOne({ where: { firstName: 'Adam', lastName: 'Appleby' } });
   const anton = await Musician.findOne({ where: { firstName: 'Anton', lastName: 'Martinovic' } });
   const wilson = await Musician.findOne({ where: { firstName: 'Wilson', lastName: 'Holt' } });
   const marine = await Musician.findOne({ where: { firstName: 'Marine', lastName: 'Sweet' } });
   const georgette = await Musician.findOne({ where: { firstName: 'Georgette', lastName: 'Kubo' } });
   const aurora = await Musician.findOne({ where: { firstName: 'Aurora', lastName: 'Hase' } });
   const trenton = await Musician.findOne({ where: { firstName: 'Trenton', lastName: 'Lesley' } });
   const camila = await Musician.findOne({ where: { firstName: 'Camila', lastName: 'Nenci' } });
   const rosemarie = await Musician.findOne({ where: { firstName: 'Rosemarie', lastName: 'Affini' } });
   const victoria = await Musician.findOne({ where: { firstName: 'Victoria', lastName: 'Cremonesi' } });

   // Capture references to instruments used in seeds
   const piano = await Instrument.findOne({ where: { type: 'piano' } });
   const guitar = await Instrument.findOne({ where: { type: 'guitar' } });
   const drums = await Instrument.findOne({ where: { type: 'drums' } });
   const bass = await Instrument.findOne({ where: { type: 'bass' } });
   const violin = await Instrument.findOne({ where: { type: 'violin' } });
   const cello = await Instrument.findOne({ where: { type: 'cello' } });
   const trumpet = await Instrument.findOne({ where: { type: 'trumpet' } });
   const saxophone = await Instrument.findOne({ where: { type: 'saxophone' } });

   await adam.addInstruments([piano, guitar]);
   await anton.addInstruments([piano, bass]);
   await wilson.addInstruments([cello]);
   await marine.addInstruments([saxophone]);
   await georgette.addInstruments([drums, trumpet, saxophone]);
   await aurora.addInstruments([violin, cello]);
   await trenton.addInstruments([piano]);
   await camila.addInstruments([piano]);
   await rosemarie.addInstruments([piano, violin]);
   await victoria.addInstruments([violin]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // Capture references to musicians used in seeds
    const adam = await Musician.findOne({ where: { firstName: 'Adam', lastName: 'Appleby' } });
    const anton = await Musician.findOne({ where: { firstName: 'Anton', lastName: 'Martinovic' } });
    const wilson = await Musician.findOne({ where: { firstName: 'Wilson', lastName: 'Holt' } });
    const marine = await Musician.findOne({ where: { firstName: 'Marine', lastName: 'Sweet' } });
    const georgette = await Musician.findOne({ where: { firstName: 'Georgette', lastName: 'Kubo' } });
    const aurora = await Musician.findOne({ where: { firstName: 'Aurora', lastName: 'Hase' } });
    const trenton = await Musician.findOne({ where: { firstName: 'Trenton', lastName: 'Lesley' } });
    const camila = await Musician.findOne({ where: { firstName: 'Camila', lastName: 'Nenci' } });
    const rosemarie = await Musician.findOne({ where: { firstName: 'Rosemarie', lastName: 'Affini' } });
    const victoria = await Musician.findOne({ where: { firstName: 'Victoria', lastName: 'Cremonesi' } });
 
    // Capture references to instruments used in seeds
   const piano = await Instrument.findOne({ where: { type: 'piano' } });
   const guitar = await Instrument.findOne({ where: { type: 'guitar' } });
   const drums = await Instrument.findOne({ where: { type: 'drums' } });
   const bass = await Instrument.findOne({ where: { type: 'bass' } });
   const violin = await Instrument.findOne({ where: { type: 'violin' } });
   const cello = await Instrument.findOne({ where: { type: 'cello' } });
   const trumpet = await Instrument.findOne({ where: { type: 'trumpet' } });
   const saxophone = await Instrument.findOne({ where: { type: 'saxophone' } });
 
    await adam.removeInstruments([piano, guitar]);
    await anton.removeInstruments([piano, bass]);
    await wilson.removeInstruments([cello]);
    await marine.removeInstruments([saxophone]);
    await georgette.removeInstruments([drums, trumpet, saxophone]);
    await aurora.removeInstruments([violin, cello]);
    await trenton.removeInstruments([piano]);
    await camila.removeInstruments([piano]);
    await rosemarie.removeInstruments([piano, violin]);
    await victoria.removeInstruments([violin]);
  }
};