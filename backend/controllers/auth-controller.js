const bcrypt = require("bcryptjs");
const db = require("../config/database");

async function login(request, response) {
  const { email, password } = request.body;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return response.status(400).json({ message: "Email dan password wajib diisi." });
  }

  try {
    const [users] = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ? AND is_active = TRUE LIMIT 1",
      [email.trim()],
    );

    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
      return response.status(401).json({ message: "Email atau password salah." });
    }

    const user = users[0];
    request.session.regenerate((error) => {
      if (error) {
        return response.status(500).json({ message: "Gagal membuat sesi login." });
      }

      request.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return response.json({ message: "Login berhasil.", user: request.session.user });
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return response.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

function logout(request, response) {
  request.session.destroy((error) => {
    if (error) {
      return response.status(500).json({ message: "Gagal mengakhiri sesi." });
    }

    response.clearCookie("approval.sid");
    return response.json({ message: "Logout berhasil." });
  });
}

function currentUser(request, response) {
  response.json({ user: request.session.user || null });
}

module.exports = { login, logout, currentUser };
