/* ---------------- This section must be at the top: ---------------- */
delete require.cache[require.resolve('../server/config/database.js')];
delete require.cache[require.resolve('../server/db/models')];
delete require.cache[require.resolve('../server/app')];
const path = require('path');
const DB_TEST_FILE = 'db/' + path.basename(__filename, '.js') + '.db';
process.env.DB_TEST_FILE = 'server/' + DB_TEST_FILE;
/* ------------------------------------------------------------------ */

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let chaiHttp = require('chai-http');
let server = require('../server/app');
chai.use(chaiHttp);
const expect = chai.expect;

const { resetDB, seedAllDB, removeTestDB } = require('./utils/test-utils');
const { Musician, MusicianInstrument } = require('../server/db/models');

describe('Step 2: Many-to-Many', () => {

  before(async () => {
    await resetDB(DB_TEST_FILE);
    return await seedAllDB(DB_TEST_FILE);
  });

  after(async () => {
    return await removeTestDB(DB_TEST_FILE);
  });

  describe('POST /musicians/:musicianId/instruments', () => {
    let adam;
    let beforeAdamInstruments;

    before(async () => {
      adam = await Musician.findOne({
        where: { firstName: "Adam" }
      });

      beforeAdamInstruments = await MusicianInstrument.findAll({
        where: { musicianId: adam.id },
        order: [ ["instrumentId"] ]
      });
    });

    it('sends a JSON success message after associating musician and instruments', async () => {
      expect(beforeAdamInstruments).to.not.be.null;
      expect(beforeAdamInstruments).to.be.an('array');
      expect(beforeAdamInstruments).to.have.length(2);
      expect(beforeAdamInstruments[0].dataValues).to.haveOwnProperty('instrumentId');
      expect(beforeAdamInstruments[0].dataValues.instrumentId).to.equal(1);
      expect(beforeAdamInstruments[1].dataValues).to.haveOwnProperty('instrumentId');
      expect(beforeAdamInstruments[1].dataValues.instrumentId).to.equal(2);

      const reqBody = {
        instrumentIds: [ 3, 4 ]
      };

      await chai.request(server)
        .post(`/musicians/${adam.id}/instruments`)
        .send(reqBody)
        .then((res) => {
          expect(res.status).to.be.within(200, 201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('message');
          expect(res.body.message).to.equal(`Associated ${adam.firstName} with instruments ${reqBody.instrumentIds}.`);
        });
    })

    it('connects the instruments to the musician through the join table', async () => {

      const afterAdamInstruments = await MusicianInstrument.findAll({
        where: { musicianId: adam.id },
        order: [ ["instrumentId"] ]
      });

      expect(afterAdamInstruments).to.not.be.null;
      expect(afterAdamInstruments).to.be.an('array');
      expect(afterAdamInstruments).to.have.length(4);
      expect(afterAdamInstruments[2].dataValues).to.haveOwnProperty('instrumentId');
      expect(afterAdamInstruments[2].dataValues.instrumentId).to.equal(3);
      expect(afterAdamInstruments[3].dataValues).to.haveOwnProperty('instrumentId');
      expect(afterAdamInstruments[3].dataValues.instrumentId).to.equal(4);
    });
  });
});