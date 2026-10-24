# Backthen Backend API

Backend REST API service dibangun menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Database**: MySQL 8.x (koneksi pool via `mysql2`)
- **Containerization**: Docker / Podman
- **API Docs**: Swagger UI (`@elysiajs/swagger`)

## Struktur Proyek

```text
.
├── Dockerfile               # Multi-stage container build untuk Bun
├── docker-compose.yml       # Orkestrasi container App + MySQL
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
   - MySQL 8.x (bisa dijalankan via Docker/Podman)

2. **Instalasi Dependensi**:
   ```bash
   bun install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` menjadi `.env` lalu sesuaikan kredensial MySQL Anda:
   ```bash
   cp .env.example .env
   ```

4. **Menjalankan Database (via Podman atau Docker)**:
   Jika menggunakan Podman:
   ```bash
   podman run -d --name backthen_mysql \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=backthen_db \
     -p 3306:3306 \
     -v backthen_mysql_data:/var/lib/mysql \
     docker.io/library/mysql:8.0
   ```

5. **Migrasi Database**:
   ```bash
   # Sinkronisasi schema langsung ke database
   bun run db:push

   # Atau generate dan jalankan migration file
   bun run db:generate
   bun run db:migrate
   ```

## Menjalankan Aplikasi

- **Development Mode** (auto-reload):
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

## Menjalankan dengan Docker / Podman Compose

Untuk menjalankan seluruh stack (Aplikasi + MySQL) dalam container:
```bash
# Menggunakan Docker Compose:
docker compose up -d

# Atau menggunakan Podman:
podman-compose up -d
```

## Endpoints Utama

- **Health Check**: `GET http://localhost:3000/health`
- **Swagger Documentation**: `http://localhost:3000/swagger`
- **Users API**:
  - `POST /api/users` - Registrasi user baru (dengan hashing password bcrypt)
