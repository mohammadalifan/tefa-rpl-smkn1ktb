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

async function store(request, response) {
  const { name, email, password, nisn } = request.body;
  if ([name, email, password, nisn].some((value) => typeof value !== "string" || !value.trim())) {
    return response.status(400).json({ message: "Nama, email, password, dan NISN wajib diisi." });
  }

  const siswa = { name: name.trim(), email: email.trim().toLowerCase(), password, nisn: nisn.trim() };
  if (siswa.name.length > 100 || siswa.email.length > 150 || siswa.nisn.length > 20) {
    return response.status(400).json({ message: "Nama, email, atau NISN melebihi batas karakter." });
  }
  if (!/^\S+@\S+\.\S+$/.test(siswa.email)) {
    return response.status(400).json({ message: "Format email tidak valid." });
  }
  if (siswa.password.length < 8) {
    return response.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const userId = await siswaModel.create(siswa);
    return response.status(201).json({ message: "Data siswa berhasil ditambahkan.", userId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({ message: "Email atau NISN sudah terdaftar." });
    }
    console.error("Failed to create siswa:", error.message);
    return response.status(500).json({ message: "Data siswa gagal disimpan." });
  }
}

async function update(request, response) {
  const { name, email, password = "", nisn } = request.body;
  if ([name, email, nisn].some((value) => typeof value !== "string" || !value.trim()) || typeof password !== "string") {
    return response.status(400).json({ message: "Nama, email, dan NISN wajib diisi." });
  }

  const siswa = { name: name.trim(), email: email.trim().toLowerCase(), password, nisn: nisn.trim() };
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({ message: "ID siswa tidak valid." });
  }
  if (siswa.name.length > 100 || siswa.email.length > 150 || siswa.nisn.length > 20) {
    return response.status(400).json({ message: "Nama, email, atau NISN melebihi batas karakter." });
  }
  if (!/^\S+@\S+\.\S+$/.test(siswa.email)) {
    return response.status(400).json({ message: "Format email tidak valid." });
  }
  if (siswa.password && siswa.password.length < 8) {
    return response.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const updated = await siswaModel.update(id, siswa);
    if (!updated) return response.status(404).json({ message: "Data siswa tidak ditemukan." });
    return response.json({ message: "Data siswa berhasil diperbarui." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({ message: "Email atau NISN sudah terdaftar." });
    }
    console.error("Failed to update siswa:", error.message);
    return response.status(500).json({ message: "Data siswa gagal diperbarui." });
  }
}

async function destroy(request, response) {
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return response.status(400).json({ message: "ID siswa tidak valid." });
  }

  try {
    const deleted = await siswaModel.remove(id);
    if (!deleted) return response.status(404).json({ message: "Data siswa tidak ditemukan." });
    return response.json({ message: "Data siswa berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete siswa:", error.message);
    return response.status(500).json({ message: "Data siswa gagal dihapus." });
  }
}

module.exports = { index, store, update, destroy };
