const db = require("../config/database");

const siswa = [
  { email: "siswa1@example.com", nisn: "0098765442" },
  { email: "siswa2@example.com", nisn: "0098765443" },
];

async function seedSiswa() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    for (const item of siswa) {
      const [users] = await connection.query("SELECT id, role FROM users WHERE email = ?", [item.email]);
      if (users.length === 0 || users[0].role !== "siswa") {
        throw new Error(`Run npm run seed:users first; siswa user missing: ${item.email}`);
      }
      const [profiles] = await connection.query("SELECT id FROM siswa WHERE user_id = ?", [users[0].id]);
      if (profiles.length === 0) {
        await connection.query("INSERT INTO siswa (user_id, nisn) VALUES (?, ?)", [users[0].id, item.nisn]);
      }
    }

    await connection.commit();
    console.log("Siswa profiles seeded: 2");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

seedSiswa()
  .catch((error) => {
    console.error("Siswa seeder failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
