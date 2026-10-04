# Portfolio CV

Portfolio pribadi bilingual (Indonesia/Inggris) dengan Next.js App Router, Tailwind v4, Prisma, dan database PostgreSQL (Neon/Supabase). Konten portfolio dikelola lewat **admin dashboard** di `/dashboard` yang dilindungi login OAuth.

## Isi

- [ Prasyarat](#prasyarat)
- [Setup lokal](#setup-lokal)
- [Environment variables](#environment-variables)
- [Login dashboard (OAuth)](#login-dashboard-oauth)
  - [Membuat OAuth app Google](#membuat-oauth-app-google)
  - [Membuat OAuth app GitHub](#membuat-oauth-app-github)
  - [Callback URL](#callback-url)
  - [Allowlist admin](#allowlist-admin)
- [Perintah yang tersedia](#perintah-yang-tersedia)
- [Catatan keamanan](#catatan-keamanan)

## Prasyarat

- Node.js 20+
- Akun PostgreSQL (Neon/Supabase) untuk `DATABASE_URL`
- Google Workspace / Akun Google untuk membuat OAuth client
- Akun GitHub untuk membuat OAuth app

## Setup lokal

```bash
npm install
cp .env.example .env    # di Windows: copy .env.example .env
```

Isi `.env` (lihat [Environment variables](#environment-variables)), lalu:

```bash
npm run db:migrate      # menerapkan skema ke database
npm run db:seed         # mengisi konten portfolio awal
npm run dev             # http://localhost:3000
```

## Environment variables

Salin `.env.example` ke `.env`. Nilai asli **jangan** masuk ke repo.

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Koneksi PostgreSQL. Wajib. |
| `AUTH_SECRET` | Kunci enkripsi sesi. Generate: `openssl rand -base64 32`. Wajib di production. |
| `AUTH_URL` | URL situs. Wajib di production. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Credential OAuth Google. Kosongkan provider yang tidak dipakai. |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Credential OAuth GitHub. |
| `ADMIN_EMAILS` | Email yang boleh login, pisahkan koma. **Kosong = semua login ditolak.** |
| `BLOB_READ_WRITE_TOKEN` | Untuk upload gambar (Vercel Blob). |
| `NEXT_PUBLIC_SITE_URL` | URL publik situs. |
| `GROQ_API_KEY`, `NEXT_PUBLIC_LANGVOICE_API_KEY` | Fitur chat AI bawaan project. |

## Login dashboard

Dashboard memakai [better-auth](https://www.better-auth.com) dalam mode **stateless** (sesi di cookie terenkripsi, tanpa tabel user). Hanya email di `ADMIN_EMAILS` yang bisa masuk.

### Membuat OAuth app Google

1. Buka [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Klik **Create credentials → OAuth client ID**.
3. **Application type:** *Web application*.
4. **Name:** misalnya `Portfolio CV`.
5. Tambahkan **Authorized redirect URI** (lihat [Callback URL](#callback-url)):
   - Lokal: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://domain-anda.com/api/auth/callback/google`
6. Tambahkan **Authorized JavaScript origins**:
   - Lokal: `http://localhost:3000`
   - Production: `https://domain-anda.com`
7. Klik **Create**, lalu salin **Client ID** → `AUTH_GOOGLE_ID` dan **Client secret** → `AUTH_GOOGLE_SECRET`.

> Google menampilkan secret di dialog konfirmasi. Simpan baik-baik; secret hanya ditampilkan penuh sekali.

### Membuat OAuth app GitHub

1. Buka [GitHub → Settings → Developer settings → OAuth Apps → New OAuth App](https://github.com/settings/developers).
2. **Application name:** misalnya `Portfolio CV`.
3. **Homepage URL:** `http://localhost:3000` (atau domain production).
4. **Authorization callback URL:**
   - Lokal: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://domain-anda.com/api/auth/callback/github`
5. Klik **Register application**.
6. Klik **Generate a new client secret**, salin **Client ID** → `AUTH_GITHUB_ID` dan **client secret** → `AUTH_GITHUB_SECRET`.

> **Catatan email GitHub.** Kode menolak sign-in bila provider mengirim `email_verified: false`. Namun endpoint `/user` GitHub tidak selalu menyertakan field ini, jadi email GitHub yang belum terverifikasi **belum selalu tertangkap**. Untuk keamanan penuh, pakai akun Google (email selalu terverifikasi). Ini akan diuji dan diperketat pada fase berikutnya.

### Callback URL

Callback URL harus **persis sama** dengan yang didaftarkan di provider:

```
<AUTH_URL>/api/auth/callback/google
<AUTH_URL>/api/auth/callback/github
```

| Lingkungan | `AUTH_URL` |
|---|---|
| Lokal | `http://localhost:3000` |
| Production | `https://domain-anda.com` |

> Untuk GitHub, OAuth app **tidak bisa** memakai port berbeda. Kalau port lokal Anda bukan 3000, samakan atau pakai `localhost` tanpa port khusus.

### Allowlist admin

Isi `ADMIN_EMAILS` dengan email Anda, pisahkan koma bila lebih dari satu:

```env
ADMIN_EMAILS="email-anda@gmail.com,email-kedua@outlook.com"
```

Perbandingan bersifat case-insensitive. Email di luar daftar ini akan ditolak dan diarahkan ke `/login?error=access_denied`.

## Perintah yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan. |
| `npm run build` | Build production. |
| `npm run start` | Menjalankan hasil build. |
| `npm run lint` | ESLint (`.next` & `node_modules` diabaikan). |
| `npm run db:migrate` | Menerapkan migrasi Prisma. |
| `npm run db:seed` | Mengisi konten awal. |
| `npm run db:studio` | Prisma Studio untuk melihat data. |

## Catatan keamanan

- `.env` tidak pernah di-commit; `.env.example` berisi placeholder.
- `AUTH_SECRET` hanya di server (tanpa prefix `NEXT_PUBLIC_`).
- Route `/dashboard/*` dilindungi proxy (optimistik) **dan** dicek ulang di server pada setiap halaman/mutasi.
- `/login` dan `/dashboard` diberi `noindex` agar tidak terindeks mesin pencari.