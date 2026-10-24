# Backthen Backend API

Backend REST API service dibangun menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Database**: MySQL (koneksi pool via `mysql2`)
- **API Docs**: Swagger UI (`@elysiajs/swagger`)

## Struktur Proyek

```text
.
├── drizzle/                 # Berkas migrasi SQL hasil generate Drizzle
├── drizzle.config.ts        # Konfigurasi Drizzle Kit
├── src/
│   ├── index.ts             # Entry point Elysia server & middleware
│   ├── config/              # Centralized environment config
│   ├── db/                  # Drizzle instance & MySQL pool
│   │   ├── index.ts
│   │   └── schema/          # Definisi tabel (modular)
│   ├── modules/             # Domain modules
│   │   └── users/           # Contoh modul: model, service, routes
│   └── middlewares/         # Centralized error handler & guards
└── test/                    # Automated tests (bun test)
```

## Persyaratan & Setup

1. **Prasyarat**:
   - [Bun](https://bun.sh/) v1.0+
   - MySQL 8.x / MariaDB

2. **Instalasi Dependensi**:
   ```bash
   bun install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` menjadi `.env` lalu sesuaikan kredensial MySQL Anda:
   ```bash
   cp .env.example .env
   ```

4. **Migrasi Database**:
   ```bash
   # Generate file migrasi dari schema Drizzle
   bun run db:generate

   # Terapkan migrasi ke database MySQL
   bun run db:migrate
   ```

## Menjalankan Aplikasi

- **Development Mode** (dengan auto-reload):
  ```bash
  bun run dev
  ```
- **Production Mode**:
  ```bash
  bun run start
  ```
- **Automated Tests**:
  ```bash
  bun test
  ```
- **Type Checking**:
  ```bash
  bun run typecheck
  ```
- **Drizzle Studio** (Database GUI):
  ```bash
  bun run db:studio
  ```

## Endpoints Utama

- **Health Check**: `GET http://localhost:3000/health`
- **Swagger Documentation**: `http://localhost:3000/swagger`
- **Users API**:
  - `GET /api/v1/users` - Mengambil semua user
  - `GET /api/v1/users/:id` - Mengambil detail user berdasarkan ID
  - `POST /api/v1/users` - Membuat user baru
