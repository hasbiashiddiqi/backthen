# Issue: Fitur Registrasi User Baru (Password Hashing & Struktur Routes/Services)

Dokumen ini merupakan panduan perencanaan *task* dan arsitektur untuk diimplementasikan oleh junior programmer atau AI model pelaksana.

---

## 1. Spesifikasi Kebutuhan

### A. Skema Tabel Database (`users`)
Perbarui/sesuaikan definisi skema tabel `users` di Drizzle ORM dengan kolom berikut:

| Nama Kolom   | Tipe Data           | Keterangan                                              |
|--------------|---------------------|---------------------------------------------------------|
| `id`         | INT / SERIAL        | Primary Key, Auto Increment                             |
| `name`       | VARCHAR(255)        | NOT NULL                                                |
| `email`      | VARCHAR(255)        | NOT NULL, UNIQUE                                        |
| `password`   | VARCHAR(255)        | NOT NULL (Menyimpan hash bcrypt, bukan plaintext)       |
| `created_at` | TIMESTAMP           | NOT NULL, DEFAULT CURRENT_TIMESTAMP                     |

> **Catatan Hashing Password**:
> Gunakan utilitas bawaan Bun `await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 })` untuk hashing. Ini native di Bun tanpa perlu dependensi tambahan.

---

### B. Kontrak API Registrasi
* **Endpoint**: `POST /api/users`
* **Content-Type**: `application/json`

#### Request Body
```json
{
  "name": "neymar",
  "email": "neymar@localhost",
  "password": "rahasia"
}
```

#### Response (Success - Status `200` atau `201`)
```json
{
  "data": "OK"
}
```

#### Response (Error - Email Duplikat - Status `400` atau `409`)
Jika email sudah terdaftar di database:
```json
{
  "error": "Email sudah terdaftar"
}
```

---

## 2. Standar Struktur Direktori & Konvensi Penamaan File

Struktur kode di bawah direktori `src/` disesuaikan dengan pola pemisahan lapisan:

```text
src/
├── config/
│   └── env.ts                  # Konfigurasi environment
├── db/
│   ├── index.ts                # Client Drizzle & koneksi MySQL
│   └── schema/
│       └── users-schema.ts     # Definisi tabel Drizzle ORM
├── services/
│   └── users-service.ts        # Logic bisnis (query DB, hash password, cek duplikasi)
├── routes/
│   └── users-routes.ts         # Route handler ElysiaJS, validasi skema request
├── middlewares/
│   └── error.ts                # Global error handler
└── index.ts                    # Entry point aplikasi & mounting routes
```

* **Aturan Penamaan File**:
  - Berkas route diletakkan di `src/routes/` dengan format kebab-case: `[nama-fitur]-routes.ts` (contoh: `users-routes.ts`).
  - Berkas service diletakkan di `src/services/` dengan format kebab-case: `[nama-fitur]-service.ts` (contoh: `users-service.ts`).

---

## 3. Tahapan Implementasi (Panduan untuk Pelaksana)

Ikuti urutan langkah kerja berikut secara berurutan:

### Langkah 1: Update Schema Database
1. Buat/perbarui berkas schema di `src/db/schema/users-schema.ts`.
2. Pastikan kolom `password` dan `created_at` sudah ditambahkan sesuai spesifikasi.
3. Export skema tabel `users` dari `src/db/schema/index.ts`.
4. Jalankan sinkronisasi database:
   ```bash
   bun run db:push
   ```

### Langkah 2: Buat Service Bisnis (`src/services/users-service.ts`)
1. Buat class/fungsi `UsersService`.
2. Implementasikan method `registerUser(name, email, plainPassword)`:
   - **Cek Duplikasi**: Query tabel `users` berdasarkan `email`. Jika sudah ada, lemparkan error atau kembalikan status duplikat.
   - **Hash Password**: Gunakan `Bun.password.hash(plainPassword, { algorithm: "bcrypt" })`.
   - **Simpan ke DB**: Insert data user (`name`, `email`, `password` yang sudah di-hash) ke database.

### Langkah 3: Buat Route Handler (`src/routes/users-routes.ts`)
1. Inisialisasi route plugin Elysia:
   ```typescript
   export const usersRoutes = new Elysia({ prefix: "/users" })
   ```
2. Definisikan endpoint `POST /` (yang nantinya menjadi `/api/users`).
3. Tambahkan validasi body menggunakan TypeBox schema Elysia (`t.Object({ name: t.String(), email: t.String(), password: t.String() })`).
4. Panggil `UsersService.registerUser`.
5. Jika berhasil: kembalikan `{ "data": "OK" }`.
6. Jika email duplikat: set status HTTP `400` dan kembalikan `{ "error": "Email sudah terdaftar" }`.

### Langkah 4: Daftarkan Route pada Entry Point (`src/index.ts`)
1. Import `usersRoutes` dari `./routes/users-routes`.
2. Pasang pada grup prefix `/api`:
   ```typescript
   app.group("/api", (api) => api.use(usersRoutes))
   ```

### Langkah 5: Buat Automated Test (`test/users.test.ts`)
Buat pengujian dengan `bun test` untuk menguji:
1. Registrasi user baru berhasil dan mengembalikan `{ "data": "OK" }`.
2. Password di database tersimpan dalam bentuk hash (bukan plaintext).
3. Registrasi ulang dengan email yang sama mengembalikan error `{ "error": "Email sudah terdaftar" }`.

---

## 4. Best Practice Pengetesan di Linux WSL

> **Pertanyaan**: Saat pengetesan di WSL, apakah lebih baik langsung build semua ke dalam image container, atau jalankan langsung di host WSL?

### Rekomendasi: **Host Native Execution + Containerized Database** (Pilihan Terbaik)

* **Alur Pengetesan Harian (Development & Testing)**:
  1. Biarkan **MySQL tetap berjalan di dalam container** (Podman / Docker) pada port `3306`.
  2. Jalankan kode aplikasi dan pengetesan **langsung di environment host WSL**:
     ```bash
     # Terminal 1: Menjalankan server hot-reload
     bun run dev

     # Terminal 2: Menjalankan test cepat
     bun test
     ```
  * **Alasan Mengapa Ini Best Practice**:
    - **Sangat Cepat (Instant Feedback)**: Perubahan kode langsung aktif dalam hitungan milidetik tanpa perlu proses re-build image yang memakan waktu dan resource disk/CPU.
    - **Debugging Mudah**: Error stack trace langsung menunjuk ke file baris kode di editor.
    - **Database Tetap Terisolasi**: Database tetap rapi di dalam container tanpa mengotori sistem OS host.

* **Kapan Image Container Perlu Di-build?**:
  - Image container (`podman build` / `docker compose up`) hanya perlu di-build **sekali di akhir**, yaitu saat fitur sudah selesai diuji dan siap di-merge/dideploy ke staging atau production, untuk memastikan build context tidak ada masalah.

---

## 5. Kriteria Selesai (Acceptance Criteria)

- [x] Kolom `password` (bcrypt) dan `created_at` tersedia di tabel `users`.
- [x] Endpoint `POST /api/users` berfungsi sesuai kontrak request dan response body yang ditentukan.
- [x] Upaya mendaftarkan email yang sama ditolak dengan pesan `{"error": "Email sudah terdaftar"}`.
- [x] Password tersimpan di MySQL dalam bentuk hash bcrypt (dimulai dengan prefix `$2a$` atau `$2b$`).
- [x] Struktur direktori mematuhi pembagian `src/routes/users-routes.ts` dan `src/services/users-service.ts`.
- [x] Seluruh automated test (`bun test`) lulus tanpa error.
