const { exec } = require('child_process');

function envDBTestFile(dbTestFile) {
  return {
    env: {
      ...process.env,
      DB_TEST_FILE: dbTestFile || process.env.DB_TEST_FILE
    }
  };
};

let runSQL;
let runSQLQuery;

try {
  const sqlite3 = require('better-sqlite3');
  runSQL = (statement, dbTestFile) => {
    return new Promise((resolve, reject) => {
      const db = sqlite3(dbTestFile);
      const stmt = db.prepare(statement);
      try {
        const result = stmt.run();
        db.close();
        resolve(result);
      } catch(err) {
        db.close();
        reject(err);
      }
    });
  };

  runSQLQuery = (statement, dbTestFile) => {
    return new Promise((resolve, reject) => {
      const db = sqlite3(dbTestFile);
      const stmt = db.prepare(statement);
      try {
        const result = stmt.all();
        db.close();
        resolve(result);
      } catch(err) {
        db.close();
        reject(err);
      }
    });
  };
} catch {
  const sqlite3 = require('sqlite3').verbose();
  runSQL = (statement, dbTestFile) => {
    // Use for executing create, update and delete SQL commands
    return new Promise((resolve, reject) => {
      const path = require('path');
      const dbPath = path.resolve(__dirname, "../../", )
      const db = new sqlite3.Database(dbTestFile, sqlite3.OPEN_READWRITE);
      db.run(statement, function(err) {
        db.close();
        err ? reject(err): resolve();
      });
    });
  };

  runSQLQuery = (statement, dbTestFile) => {
    // Use for executing read (SELECT) SQL commands only
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbTestFile, sqlite3.OPEN_READWRITE);
      db.all(statement, function(err, rows) {
        db.close();
        err ? reject(err): resolve(rows);
      });
    });
  };
}

module.exports.runSQL = runSQL;
module.exports.runSQLQuery = runSQLQuery;

const runMigrations = async function (dbTestFile) {
  return new Promise((resolve, reject) => {
    const migrate = exec(
      'cd server && npx sequelize-cli db:migrate',
      envDBTestFile(dbTestFile),
      err => (err ? reject(err) : resolve())
    );
  }
)};

const removeTestDB = async function (dbTestFile) {
  return new Promise((resolve, reject) => {
    const deleteDB = exec(
      `cd server && rm $DB_TEST_FILE || true`,
      envDBTestFile(dbTestFile),
      err => (err ? reject(err): resolve())
    );
  }
)};
module.exports.removeTestDB = removeTestDB;

const seedAllDB = async function (dbTestFile) {
  return new Promise((resolve, reject) => {
    const seedProcess = exec(
      'cd server && npx sequelize-cli db:seed:all',
      envDBTestFile(dbTestFile),
      err => (err ? reject(err) : resolve())
    );
  }
)};
module.exports.seedAllDB = seedAllDB;

module.exports.seedDBFile = async function (fileName, dbTestFile) {
  return new Promise((resolve, reject) => {
    const seedProcess = exec(
      `cd server && npx sequelize-cli db:seed --seed ${fileName}`,
      envDBTestFile(dbTestFile),
      err => (err ? reject(err): resolve())
    );
  }
)};

// all files in the /test/original-files folder will replace those files in the
  // equivalent path in the server/ directory
const replaceFilesScript = `
destination_dir=./server
original_dir=./test/original-files
find "$original_dir" -type f -exec bash -c 'cp -v $0 "\${0/$1/$2}"' {} $original_dir $destination_dir \\;
`;

module.exports.resetFiles = async function () {
  return new Promise((resolve, reject) => {
    const replaceFilesProcess = exec(
      replaceFilesScript,
      { env },
      err => (err ? reject(err): resolve())
    );
    replaceFilesProcess.stdout.on('data', function(data) {
      console.log(data);
    });
  }
)};

const resetDB = async function (dbTestFile) {
  await removeTestDB(dbTestFile);
  await runMigrations(dbTestFile);
};
module.exports.resetDB = resetDB;

module.exports.setupBefore = async (filename) => {
  for (let module in require.cache) { delete require.cache[module] }
  // for all server files in cache, delete it from the cache
  const path = require('path');
  DB_TEST_FILE = 'db/' + path.basename(filename, '.js') + '.db';
  SERVER_DB_TEST_FILE = 'server/' + DB_TEST_FILE;
  process.env.DB_TEST_FILE = SERVER_DB_TEST_FILE;
  const server = require(path.resolve(process.cwd(), 'server', 'app'));
  const models = require(path.resolve(process.cwd(), 'server', 'db', 'models'));
  await resetDB(DB_TEST_FILE);
  await seedAllDB(DB_TEST_FILE);
  return { server, models, DB_TEST_FILE, SERVER_DB_TEST_FILE };
};

module.exports.setupChai = () => {
  const chai = require('chai');
  const chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);
  const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
  return chai;
};