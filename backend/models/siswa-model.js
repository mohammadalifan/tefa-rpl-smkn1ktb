const db = require("../config/database");

async function getAll() {
  const [rows] = await db.query(
    `SELECT siswa.id, siswa.nisn, users.name, users.email, users.is_active
     FROM siswa
     INNER JOIN users ON users.id = siswa.user_id
     ORDER BY users.name ASC`,
  );

  return rows;
}

module.exports = { getAll };
