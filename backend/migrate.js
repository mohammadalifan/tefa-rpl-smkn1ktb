const fs = require("node:fs");
const path = require("node:path");
const db = require("./config/database");

async function migrate() {
  const migrationsDirectory = path.join(__dirname, "migrations");

  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY migrations_filename_unique (filename)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [completedRows] = await db.query("SELECT filename FROM migrations");
  const completed = new Set(completedRows.map((row) => row.filename));
  const files = fs
    .readdirSync(migrationsDirectory)
    .filter((filename) => filename.endsWith(".sql"))
    .sort();

  for (const filename of files) {
    if (completed.has(filename)) {
      console.log(`Skipped ${filename}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDirectory, filename), "utf8");
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (const statement of statements) {
        await connection.query(statement);
      }
      await connection.query("INSERT INTO migrations (filename) VALUES (?)", [filename]);
      await connection.commit();
      console.log(`Migrated ${filename}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

if (require.main === module) {
  migrate()
    .catch((error) => {
      console.error("Migration failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => db.end());
}

module.exports = migrate;
