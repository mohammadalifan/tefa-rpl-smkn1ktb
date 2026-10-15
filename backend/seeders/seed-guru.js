const db = require("../config/database");

const guru = [
  { email: "guru1@example.com", nip: "199001012020011001" },
  { email: "guru2@example.com", nip: "199502022021012002" },
];

async function seedGuru() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    for (const item of guru) {
      const [users] = await connection.query("SELECT id, role FROM users WHERE email = ?", [item.email]);
      if (users.length === 0 || users[0].role !== "guru") {
        throw new Error(`Run npm run seed:users first; guru user missing: ${item.email}`);
      }
      const [profiles] = await connection.query("SELECT id FROM guru WHERE user_id = ?", [users[0].id]);
      if (profiles.length === 0) {
        await connection.query("INSERT INTO guru (user_id, nip) VALUES (?, ?)", [users[0].id, item.nip]);
      }
    }

    await connection.commit();
    console.log("Guru profiles seeded: 2");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

seedGuru()
  .catch((error) => {
    console.error("Guru seeder failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
