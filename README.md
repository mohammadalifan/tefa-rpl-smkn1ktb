# TEFA RPL SMKN 1 KTB

Project bersama untuk pengembangan aplikasi sekolah oleh tim TEFA RPL.

## Menjalankan aplikasi

### Persiapan

1. Pastikan Node.js dan MySQL sudah tersedia.
2. Buat database bernama `approval`.
3. Salin `backend/.env.example` menjadi `backend/.env`, lalu isi konfigurasi database dan `SESSION_SECRET`.
4. Pasang dependency backend:

   ```bash
   cd backend
   npm install
   ```

### Menjalankan server

Dari folder `backend`:

```bash
npm start
```

Buka `http://localhost:3000`. Halaman login tersedia di `http://localhost:3000/login`.

### Migration

Jalankan migration baru yang belum diterapkan:

```bash
npm run migrate
```

Untuk menghapus tabel `users`, `guru`, `siswa`, dan pencatat migration, lalu membuat ulang skema:

```bash
npm run migrate:fresh
```

`migrate:fresh` menghapus data pada tabel tersebut.

### Seeder

Jalankan semua seeder setelah migration:

```bash
npm run seed
```

Seeder membuat akun admin, dua akun guru, dan dua akun siswa beserta profilnya. Untuk menjalankan seeder tertentu:

```bash
npm run seed:admin
npm run seed:users
npm run seed:guru
npm run seed:siswa
```

Jalankan `seed:users` sebelum `seed:guru` atau `seed:siswa` agar akun pengguna tersedia untuk relasi profil.

## Aturan kerja singkat

- Simpan kredensial, token, dan konfigurasi pribadi di file `.env` lokal; jangan commit ke repository.
- Jelaskan tujuan dan cara menguji perubahan pada pull request.
- Catat keputusan penting dan petunjuk menjalankan aplikasi di README ini seiring perkembangan project.

## Struktur backend

- `config/`: konfigurasi aplikasi dan database.
- `controllers/`: pengendali request.
- `middlewares/`: middleware autentikasi.
- `migrations/`: file SQL migration.
- `models/`: query dan akses data.
- `routes/`: route API.
- `seeders/`: seeder database.
