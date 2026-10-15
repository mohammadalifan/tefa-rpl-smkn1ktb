const db = require("../config/database");
const bcrypt = require("bcryptjs");

async function getAll() {
  const [rows] = await db.query(
    `SELECT guru.id, guru.nip, users.name, users.email, users.is_active
     FROM guru
     INNER JOIN users ON users.id = guru.user_id
     ORDER BY users.name ASC`,
  );

  return rows;
}

async function create({ name, email, password, nip }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(password, 12);
    const [userResult] = await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'guru')",
      [name, email, hashedPassword],
    );
    await connection.query("INSERT INTO guru (user_id, nip) VALUES (?, ?)", [userResult.insertId, nip]);
    await connection.commit();
    return userResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getAll, create };
