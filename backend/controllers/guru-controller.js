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

async function update(request, response) {
  const { name, email, password = "", nip } = request.body;
  if ([name, email, nip].some((value) => typeof value !== "string" || !value.trim()) || typeof password !== "string") {
    return response.status(400).json({ message: "Nama, email, dan NIP wajib diisi." });
  }

  const guru = { name: name.trim(), email: email.trim().toLowerCase(), password, nip: nip.trim() };
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({ message: "ID guru tidak valid." });
  }
  if (guru.name.length > 100 || guru.email.length > 150 || guru.nip.length > 30) {
    return response.status(400).json({ message: "Nama, email, atau NIP melebihi batas karakter." });
  }
  if (!/^\S+@\S+\.\S+$/.test(guru.email)) {
    return response.status(400).json({ message: "Format email tidak valid." });
  }
  if (guru.password && guru.password.length < 8) {
    return response.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const updated = await guruModel.update(id, guru);
    if (!updated) return response.status(404).json({ message: "Data guru tidak ditemukan." });
    return response.json({ message: "Data guru berhasil diperbarui." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({ message: "Email atau NIP sudah terdaftar." });
    }
    console.error("Failed to update guru:", error.message);
    return response.status(500).json({ message: "Data guru gagal diperbarui." });
  }
}

async function destroy(request, response) {
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({ message: "ID guru tidak valid." });
  }

  try {
    const deleted = await guruModel.remove(id);
    if (!deleted) return response.status(404).json({ message: "Data guru tidak ditemukan." });
    return response.json({ message: "Data guru berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete guru:", error.message);
    return response.status(500).json({ message: "Data guru gagal dihapus." });
  }
}

module.exports = { index, store, update, destroy };
