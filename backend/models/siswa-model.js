const db = require("../config/database");
const bcrypt = require("bcryptjs");

async function getAll() {
  const [rows] = await db.query(
    `SELECT siswa.id, siswa.nisn, users.name, users.email, users.is_active
     FROM siswa
     INNER JOIN users ON users.id = siswa.user_id
     ORDER BY users.name ASC`,
  );

  return rows;
}

async function create({ name, email, password, nisn }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(password, 12);
    const [userResult] = await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'siswa')",
      [name, email, hashedPassword],
    );
    await connection.query("INSERT INTO siswa (user_id, nisn) VALUES (?, ?)", [userResult.insertId, nisn]);
    await connection.commit();
    return userResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function update(id, { name, email, password, nisn }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [rows] = await connection.query("SELECT user_id FROM siswa WHERE id = ? FOR UPDATE", [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return false;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await connection.query(
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ? AND role = 'siswa'",
        [name, email, hashedPassword, rows[0].user_id],
      );
    } else {
      await connection.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'siswa'",
        [name, email, rows[0].user_id],
      );
    }
    await connection.query("UPDATE siswa SET nisn = ? WHERE id = ?", [nisn, id]);
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function remove(id) {
  const [result] = await db.query(
    `DELETE users FROM users
     INNER JOIN siswa ON siswa.user_id = users.id
     WHERE siswa.id = ? AND users.role = 'siswa'`,
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = { getAll, create, update, remove };
