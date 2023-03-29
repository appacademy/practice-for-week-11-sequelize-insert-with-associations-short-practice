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
const { Musician, Band } = require('../server/db/models');

describe('Step 1: One-to-Many', () => {

  before(async () => {
    await resetDB(DB_TEST_FILE);
    return await seedAllDB(DB_TEST_FILE);
  });

  after(async () => {
    return await removeTestDB(DB_TEST_FILE);
  });

  describe('POST /bands/:bandId/musicians', () => {
    let band;
    let lastMusician;

    before(async () => {
      band = await Band.findByPk(5);
      expect(band, "Something went wrong with seeding the test database").to.not.be.null;

      lastMusician = await Musician.create({
        firstName: 'Last musician for The King River',
        lastName: 'last musician created before post request',
        bandId: band.id,
      });
    });

    it('creates a new musician for an already-existing band', async () => {

      const reqBody = {
          firstName: 'New musician for The King River',
          lastName: 'new musician created'
      };

      await chai.request(server)
        .post(`/bands/${band.id}/musicians`)
        .send(reqBody)
        .then((res) => {
          expect(res.status).to.be.within(200, 201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('message');
          expect(res.body.message).to.equal(`Created new musician for band ${band.name}.`);
          expect(res.body.musician).to.have.own.property('id');
          expect(res.body.musician.id).to.eq(lastMusician.id + 1);
          expect(res.body.musician).to.have.own.property('firstName');
          expect(res.body.musician.firstName).to.be.a('string');
          expect(res.body.musician.firstName).to.eq(reqBody.firstName);
          expect(res.body.musician).to.have.own.property('lastName');
          expect(res.body.musician.lastName).to.be.a('string');
          expect(res.body.musician.lastName).to.eq(reqBody.lastName);
          expect(res.body.musician).to.have.own.property('bandId');
          expect(res.body.musician.bandId).to.eq(band.id);
        });

        const newMusician =  await Musician.findByPk(lastMusician.id + 1, { raw: true })
        expect(newMusician.firstName).to.equal('New musician for The King River');
        expect(newMusician.lastName).to.equal('new musician created');
        expect(newMusician.bandId).to.equal(band.id);
    });


    it('creates another new musician for the same band', async () => {

      const reqBody = {
        firstName: 'One more musician for The King River',
        lastName: 'another musician created'
      };

      await chai.request(server)
        .post(`/bands/${band.id}/musicians`)
        .send(reqBody)
        .then((res) => {
          expect(res.status).to.be.within(200, 201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.musician).to.have.own.property('id');
          expect(res.body.musician.id).to.eq(lastMusician.id + 2);
          expect(res.body.musician).to.have.own.property('firstName');
          expect(res.body.musician.firstName).to.be.a('string');
          expect(res.body.musician.firstName).to.eq(reqBody.firstName);
          expect(res.body.musician).to.have.own.property('lastName');
          expect(res.body.musician.lastName).to.be.a('string');
          expect(res.body.musician.lastName).to.eq(reqBody.lastName);
          expect(res.body.musician).to.have.own.property('bandId');
          expect(res.body.musician.bandId).to.eq(band.id);
        });

        const newMusician =  await Musician.findByPk(lastMusician.id + 2, { raw: true})
        expect(newMusician.firstName).to.equal('One more musician for The King River');
        expect(newMusician.lastName).to.equal('another musician created');
        expect(newMusician.bandId).to.equal(band.id);
    });
  });
});