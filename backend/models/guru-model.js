const db = require("../config/database");

async function getAll() {
  const [rows] = await db.query(
    `SELECT guru.id, guru.nip, users.name, users.email, users.is_active
     FROM guru
     INNER JOIN users ON users.id = guru.user_id
     ORDER BY users.name ASC`,
  );

  return rows;
}

module.exports = { getAll };
