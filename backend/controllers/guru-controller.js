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

async function store(request, response) {
  const { name, email, password, nip } = request.body;

  if ([name, email, password, nip].some((value) => typeof value !== "string" || !value.trim())) {
    return response.status(400).json({ message: "Nama, email, password, dan NIP wajib diisi." });
  }

  const guru = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    nip: nip.trim(),
  };

  if (guru.name.length > 100 || guru.email.length > 150 || guru.nip.length > 30) {
    return response.status(400).json({ message: "Nama, email, atau NIP melebihi batas karakter." });
  }
  if (!/^\S+@\S+\.\S+$/.test(guru.email)) {
    return response.status(400).json({ message: "Format email tidak valid." });
  }
  if (guru.password.length < 8) {
    return response.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const userId = await guruModel.create(guru);
    return response.status(201).json({ message: "Data guru berhasil ditambahkan.", userId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({ message: "Email atau NIP sudah terdaftar." });
    }
    console.error("Failed to create guru:", error.message);
    return response.status(500).json({ message: "Data guru gagal disimpan." });
  }
}

module.exports = { index, store };
