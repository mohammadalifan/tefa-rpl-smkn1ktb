const { spawnSync } = require("node:child_process");
const path = require("node:path");

const seeders = ["seed-admin.js", "seed-users.js", "seed-guru.js", "seed-siswa.js"];

for (const seeder of seeders) {
  const result = spawnSync(process.execPath, [path.join(__dirname, seeder)], { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
