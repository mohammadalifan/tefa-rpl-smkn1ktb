const bcrypt = require("bcryptjs");
const db = require("../config/database");

const admin = {
  name: "Administrator",
  email: "admin@example.com",
  password: "Admin123!",
};

async function seedAdmin() {
  const [existingUsers] = await db.query("SELECT id, role FROM users WHERE email = ?", [admin.email]);

  if (existingUsers.length > 0) {
    if (existingUsers[0].role !== "admin") {
      throw new Error("The configured admin email already belongs to a non-admin user");
    }

    console.log(`Admin account already exists: ${admin.email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(admin.password, 12);
  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
    [admin.name, admin.email, hashedPassword],
  );

  console.log(`Admin account created: ${admin.email}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeder failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
