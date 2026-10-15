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

async function update(id, { name, email, password, nip }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [rows] = await connection.query("SELECT user_id FROM guru WHERE id = ? FOR UPDATE", [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return false;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await connection.query(
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ? AND role = 'guru'",
        [name, email, hashedPassword, rows[0].user_id],
      );
    } else {
      await connection.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'guru'",
        [name, email, rows[0].user_id],
      );
    }
    await connection.query("UPDATE guru SET nip = ? WHERE id = ?", [nip, id]);
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
     INNER JOIN guru ON guru.user_id = users.id
     WHERE guru.id = ? AND users.role = 'guru'`,
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = { getAll, create, update, remove };
