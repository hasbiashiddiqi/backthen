# Planning: Inisialisasi Project Backend (Bun + ElysiaJS + Drizzle ORM + MySQL)

Dokumen ini merupakan panduan perencanaan *high-level* untuk setup dan arsitektur dasar project backend di direktori ini. Dokumen ini dirancang sebagai acuan eksekusi bagi programmer atau LLM pelaksana.

---

## 1. Ringkasan & Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM & Migrations**: [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Database**: MySQL (koneksi via driver `mysql2` atau native pool)
- **Validation & Types**: Schema bawaan Elysia (`t` / TypeBox)

---

## 2. Struktur Direktori yang Direkomendasikan

Gunakan pendekatan modular berbasis fitur (*feature-based / domain-driven*) agar kode mudah dirawat dan diskalakan:

```text
.
├── .env.example
├── .gitignore
├── drizzle.config.ts        # Konfigurasi Drizzle Kit & migrasi
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts             # Entry point aplikasi (Elysia server)
    ├── config/              # Validasi environment variable & konfigurasi global
    │   └── env.ts
    ├── db/                  # Konfigurasi database & skema
    │   ├── index.ts         # Inisialisasi client Drizzle & pool MySQL
    │   └── schema/          # Definisi tabel Drizzle (modular per domain)
    ├── modules/             # Modul fitur (routes, controller, service)
    │   └── [feature]/       # Contoh: auth, users, atau items
    │       ├── index.ts     # Route definitions (Elysia plugin/sub-routes)
    │       ├── service.ts   # Business logic & query database
    │       └── model.ts     # DTO / TypeBox validation schema
    └── middlewares/         # Middleware global (error handling, auth guard, logging)
```

---

## 3. Rencana Tahapan Implementasi (High-Level Milestones)

### Milestone 1: Inisialisasi Project & Konfigurasi Dasar
1. Inisialisasi project Bun di root folder (`bun init`).
2. Instalasi dependencies utama:
   - Dependencies: `elysia`, `drizzle-orm`, `mysql2`
   - Opsional/Disarankan: `@elysiajs/cors`, `@elysiajs/swagger` (dokumentasi API otomatis)
   - Dev Dependencies: `drizzle-kit`, `@types/bun`
3. Konfigurasi `tsconfig.json` yang sesuai untuk TypeScript di Bun.
4. Setup file `.env.example` dan `.env` yang mencakup:
   - `PORT` (default misal `3000`)
   - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
5. Setup file `.gitignore` (abaikan `node_modules`, `.env`, build artifacts).

---

### Milestone 2: Setup Database & Drizzle ORM
1. **Koneksi Database**:
   - Buat pool koneksi MySQL menggunakan `mysql2/promise`.
   - Inisialisasi Drizzle ORM instance dan export dari `src/db/index.ts`.
2. **Konfigurasi Drizzle Kit**:
   - Buat file `drizzle.config.ts` untuk mengarahkan schema path ke `src/db/schema/` dan folder output migrasi (misal `drizzle/`).
3. **Definisi Schema**:
   - Buat file schema pertama di `src/db/schema/` (misal: tabel user/sample entity) menggunakan helper MySQL dari Drizzle (`mysqlTable`, `varchar`, `int`, `timestamp`, dll).
4. **Setup Command Migrasi**:
   - Siapkan command script di `package.json` untuk:
     - Generate migrasi SQL (`drizzle-kit generate`)
     - Eksekusi migrasi (`drizzle-kit migrate` atau `drizzle-kit push`)
     - Drizzle Studio (`drizzle-kit studio`)

---

### Milestone 3: Arsitektur Elysia Server & Routing
1. **Entry Point (`src/index.ts`)**:
   - Instansiasi aplikasi Elysia.
   - Pasang middleware global: CORS, global error handler (`onError`), serta Swagger/OpenAPI UI.
   - Buat endpoint health check (`GET /health`) yang memverifikasi kesiapan server dan koneksi database.
2. **Modular Routing**:
   - Gunakan fitur chaining / plugin Elysia (`new Elysia({ prefix: '/api/v1' })`) untuk mengelompokkan sub-route dari folder `src/modules/`.
3. **Validasi Request & Response**:
   - Gunakan schema TypeBox (`t.Object(...)`) bawaan Elysia pada setiap route untuk validasi body, query, dan params.

---

### Milestone 4: Error Handling & Format Standar
1. **Standardized Response**:
   - Tetapkan format response konsisten, contoh:
     - Sukses: `{ success: true, data: ..., message: "..." }`
     - Error: `{ success: false, error: "...", details?: ... }`
2. **Centralized Error Handling**:
   - Tangani error umum (Validation error, Not Found, Database Error/Constraint) melalui lifecycle hook `onError` di Elysia.

---

## 4. Daftar Script `package.json` yang Harus Disediakan

Pelaksana wajib memastikan script berikut terdaftar pada `package.json`:
- `"dev"`: Menjalankan server dalam mode hot-reload (`bun --watch src/index.ts`)
- `"start"`: Menjalankan server mode produksi (`bun src/index.ts`)
- `"db:generate"`: Membuat file migrasi Drizzle dari schema
- `"db:migrate"`: Menerapkan migrasi ke database MySQL
- `"db:push"`: Melakukan sinkronisasi schema langsung ke database (lingkungan dev)
- `"db:studio"`: Membuka dashboard Drizzle Studio

---

## 5. Checklist Verifikasi / Kriteria Selesai (Acceptance Criteria)

- [x] Project berhasil di-build dan dijalankan dengan perintah `bun run dev` tanpa error.
- [x] Endpoint `GET /health` merespons status `200 OK`.
- [x] Drizzle ORM dapat tersambung ke MySQL dan berhasil mengeksekusi migrasi schema dasar.
- [x] Dokumentasi API Swagger dapat diakses melalui browser (misal: `http://localhost:3000/swagger`).
- [x] Kode terorganisir rapi mengikuti konvensi modular yang telah ditentukan.
