const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

function envDBTestFile(dbTestFile) {
  return {
    env: {
      ...process.env,
      DB_TEST_FILE: dbTestFile || process.env.DB_TEST_FILE
    }
  };
};

module.exports.runSQL = (statement, dbTestFile) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbTestFile || process.env.DB_TEST_FILE, sqlite3.OPEN_READWRITE);
    db.run(statement, function(err) {
      db.close();
      err ? reject(err): resolve();
    });
  });
};

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

module.exports.seedAllDB = async function (dbTestFile) {
  return new Promise((resolve, reject) => {
    const seedProcess = exec(
      'cd server && npx sequelize-cli db:seed:all',
      envDBTestFile(dbTestFile),
      err => (err ? reject(err) : resolve())
    );
  }
)};

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

module.exports.resetDB = async function (dbTestFile) {
  await removeTestDB(dbTestFile);
  await runMigrations(dbTestFile);
};