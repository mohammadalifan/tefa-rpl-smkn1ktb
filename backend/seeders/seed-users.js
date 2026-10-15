const bcrypt = require("bcryptjs");
const db = require("../config/database");

const users = [
  { name: "Guru Contoh 1", email: "guru1@example.com", password: "Guru123!", role: "guru" },
  { name: "Guru Contoh 2", email: "guru2@example.com", password: "Guru123!", role: "guru" },
  { name: "Siswa Contoh 1", email: "siswa1@example.com", password: "Siswa123!", role: "siswa" },
  { name: "Siswa Contoh 2", email: "siswa2@example.com", password: "Siswa123!", role: "siswa" },
];

async function seedUsers() {
  for (const user of users) {
    const [existingUsers] = await db.query("SELECT id, role FROM users WHERE email = ?", [user.email]);

    if (existingUsers.length > 0) {
      if (existingUsers[0].role !== user.role) {
        throw new Error(`${user.email} already belongs to a different role`);
      }
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [user.name, user.email, hashedPassword, user.role],
    );
    console.log(`User created: ${user.email}`);
  }
}

seedUsers()
  .catch((error) => {
    console.error("Users seeder failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
