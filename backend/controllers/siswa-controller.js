const siswaModel = require("../models/siswa-model");

async function index(request, response) {
  try {
    const siswa = await siswaModel.getAll();
    response.json({ data: siswa });
  } catch (error) {
    console.error("Failed to load siswa:", error.message);
    response.status(500).json({ message: "Data siswa gagal dimuat." });
  }
}

module.exports = { index };
