const db = require("./config/database");
const migrate = require("./migrate");

async function migrateFresh() {
  await db.query("SET FOREIGN_KEY_CHECKS = 0");
  await db.query("DROP TABLE IF EXISTS siswa, guru, users, migrations");
  await db.query("SET FOREIGN_KEY_CHECKS = 1");
}

migrateFresh()
  .then(migrate)
  .catch((error) => {
    console.error("Fresh migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
