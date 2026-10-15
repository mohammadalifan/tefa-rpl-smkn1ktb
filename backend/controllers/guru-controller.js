const guruModel = require("../models/guru-model");

async function index(request, response) {
  try {
    const guru = await guruModel.getAll();
    response.json({ data: guru });
  } catch (error) {
    console.error("Failed to load guru:", error.message);
    response.status(500).json({ message: "Data guru gagal dimuat." });
  }
}

module.exports = { index };
