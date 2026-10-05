# design.md — Dashboard (gaya OpenCode)

Dokumen ini adalah panduan desain untuk dashboard, mengacu pada tampilan dan konsep [opencode.ai](https://opencode.ai/). Gunakan sebagai sumber kebenaran tunggal untuk warna, tipografi, spasi, komponen, dan layout.

> **Catatan sumber.** Konsep, struktur konten, dan gaya penulisan diambil dari halaman yang diamati langsung (judul, daftar fitur, angka statistik, caption "Fig 1.", bullet `[*]`, blok perintah instalasi, footer minimal). Nilai hex dan ukuran persis **adalah pendekatan**, karena CSS asli tidak bisa saya ekstrak. Verifikasi dengan DevTools (Inspect → Computed) lalu ganti token di bagian 3 bila perlu.

---

## 1. Konsep

OpenCode terasa seperti **terminal yang dirapikan**: monospace di mana-mana, hampir tanpa dekorasi, hitam-putih dengan satu aksen, dan informasi disajikan padat tapi lega. Dashboard ini mengikuti hal yang sama.

Prinsip:

1. **Monospace sebagai identitas.** Satu keluarga font untuk semuanya. Hierarki dibuat dari ukuran dan bobot, bukan dari ganti font.
2. **Netral dulu, aksen belakangan.** Hampir semua elemen abu-abu/hitam/putih. Warna hanya untuk status dan satu aksen interaktif.
3. **Struktur sebagai informasi.** Garis tipis, border, dan caption dipakai untuk menandai hubungan antar konten, bukan hiasan.
4. **Datar.** Tanpa gradient, tanpa shadow tebal, radius kecil. Kedalaman cukup dari border dan perbedaan warna surface.
5. **Terminal-native.** Perintah, ID, path, dan angka ditampilkan apa adanya, mudah disalin.
6. **Tenang.** Tidak ada animasi yang bergerak sendiri. Gerak hanya untuk merespons aksi pengguna.

---

## 2. Gaya penulisan

- Bahasa lugas, kalimat pendek, **sentence case**. Tidak ada huruf kapital semua.
- Nama fitur berupa frasa singkat: "Multi-session", "Share links", "Any model".
- Setiap item dijelaskan satu kalimat, mulai dengan kata kerja atau fakta konkret.
- Angka ditulis ringkas dengan satuan: `208K`, `16M`, `950`.
- Caption data memakai pola `Fig 1.` lalu angka besar dan label.
- Tombol menyebut aksinya: "Download", "Read docs", "Subscribe".
- Error menjelaskan apa yang salah dan cara memperbaikinya, tanpa permintaan maaf.
- Empty state mengajak bertindak, misalnya: "Belum ada session. Jalankan `opencode` di terminal."

---

## 3. Token warna

Dua tema: terang dan gelap. Ikuti `prefers-color-scheme` dan sediakan override `data-theme`.

```css
:root {
  /* surface */
  --bg: #fdfcfc;
  --surface: #f8f7f7;
  --surface-2: #f1eeee;
  --border: #d8d4d4;
  --border-strong: #b7b1b1;

  /* teks */
  --text: #201d1d;
  --text-muted: #6f6a6a;
  --text-faint: #9b9595;

  /* aksen & status */
  --accent: #034cff;
  --success: #12a150;
  --warning: #c48a00;
  --danger: #d92d20;

  /* kode */
  --code-bg: #f1eeee;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #100f0f;
    --surface: #181616;
    --surface-2: #211e1e;
    --border: #302c2c;
    --border-strong: #4a4545;
    --text: #f1ecec;
    --text-muted: #a29d9d;
    --text-faint: #706b6b;
    --accent: #5c8dff;
    --success: #3ddc84;
    --warning: #fcd53a;
    --danger: #ff6b5e;
    --code-bg: #211e1e;
  }
}
:root[data-theme="dark"] {
  --bg: #100f0f;
  --surface: #181616;
  --surface-2: #211e1e;
  --border: #302c2c;
  --border-strong: #4a4545;
  --text: #f1ecec;
  --text-muted: #a29d9d;
  --text-faint: #706b6b;
  --accent: #5c8dff;
  --success: #3ddc84;
  --warning: #fcd53a;
  --danger: #ff6b5e;
  --code-bg: #211e1e;
}
```

Aturan pakai:

| Token                      | Dipakai untuk                                 |
| -------------------------- | --------------------------------------------- |
| `--bg`                     | Latar halaman                                 |
| `--surface`                | Sidebar, panel, kartu                         |
| `--surface-2`              | Hover baris, code block, input                |
| `--border`                 | Semua garis pemisah (1px)                     |
| `--accent`                 | Link, fokus, item aktif. **Satu aksen saja.** |
| `--success/warning/danger` | Hanya untuk status, jangan untuk dekorasi     |

Kontras teks utama terhadap `--bg` harus minimal 4.5:1 di kedua tema.

---

## 4. Tipografi

**Font utama: IBM Plex Mono** (yang dipakai OpenCode untuk seluruh antarmuka).
Fallback: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
--font: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

Skala (rasio sekitar 1.25, semuanya monospace):

| Peran                   | Ukuran | Bobot | Line-height |
| ----------------------- | ------ | ----- | ----------- |
| Display / judul halaman | 32px   | 600   | 1.2         |
| Heading section         | 20px   | 600   | 1.3         |
| Subheading              | 16px   | 600   | 1.4         |
| Body                    | 14px   | 400   | 1.6         |
| Label / caption         | 12px   | 500   | 1.4         |
| Angka statistik besar   | 40px   | 600   | 1           |

Aturan:

- Lebar baris teks maksimal **72 karakter** (`max-width: 72ch`).
- Teks rata kiri. Jangan rata tengah kecuali blok hero tunggal.
- Pakai `font-variant-numeric: tabular-nums` untuk tabel dan angka agar kolom lurus.
- Hindari italic. Penekanan lewat bobot 500/600.
- Letter-spacing normal, tidak ada tracking lebar.

---

## 5. Spasi, radius, border

Grid 4px. Skala: `4, 8, 12, 16, 24, 32, 48, 64`.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

--radius-sm: 4px; /* tombol, input, badge */
--radius-md: 6px; /* panel, kartu */
--border-w: 1px;
```

- Semua pemisah memakai border 1px `--border`. **Tidak ada box-shadow**, kecuali menu dropdown (`0 4px 16px rgba(0,0,0,.12)`).
- Dua nilai radius saja. Jangan campur radius besar.

---

## 6. Komponen

### Tombol

| Varian    | Gaya                                                      |
| --------- | --------------------------------------------------------- |
| Primary   | Latar `--text`, teks `--bg`, tanpa border                 |
| Secondary | Latar transparan, border `--border-strong`, teks `--text` |
| Ghost     | Tanpa border, hover `--surface-2`                         |
| Danger    | Seperti secondary, teks dan border `--danger`             |

Tinggi 32px (default) atau 28px (kompak). Padding horizontal 12px. Fokus: outline 2px `--accent`, offset 2px.

### Input

Latar `--surface-2`, border `--border`, radius 4px, tinggi 32px. Fokus: border `--accent`. Placeholder `--text-faint`.

### Blok perintah (command box)

Latar `--code-bg`, border `--border`, padding 12px 16px, teks 13px. Selalu sediakan tombol **Copy** di kanan. Tab di atasnya untuk memilih metode (`curl`, `npm`, `bun`, `brew`).

```
┌ curl | npm | bun | brew ──────────────┐
│ curl -fsSL https://example.com/install │ [Copy]
└────────────────────────────────────────┘
```

### Stat dengan caption "Fig"

Mengikuti pola OpenCode untuk angka statistik:

```
Fig 1.
208K
GitHub Stars
```

Caption `Fig N.` 12px `--text-faint`, angka 40px 600, label 12px `--text-muted`. Dipisahkan antar-stat oleh border vertikal 1px.

### Daftar fitur dengan bullet `[*]`

Setiap item: penanda `[*]` (`--text-faint`), judul tebal, lalu satu baris deskripsi `--text-muted`.

```
[*] LSP enabled      Memuat LSP yang tepat untuk model secara otomatis
[*] Multi-session    Jalankan beberapa agent paralel di project yang sama
```

### Tabel

Tanpa zebra. Header 12px `--text-muted`, baris dipisah border 1px, hover `--surface-2`. Angka rata kanan, tabular-nums. Tinggi baris 36px.

### Badge status

Border 1px dan teks berwarna status, latar transparan, radius 4px, 12px. Awali dengan titik `●` berwarna sama.
`● running` `● done` `● failed` `● queued`

### Navigasi sidebar

Lebar 240px. Item 32px, ikon opsional 16px. Item aktif: latar `--surface-2`, teks `--text`, garis kiri 2px `--accent`.

### Panel

Latar `--surface`, border 1px, radius 6px, padding 16px. Judul panel 14px 600, aksi di kanan atas.

---

## 7. Layout dashboard

```
┌──────────┬────────────────────────────────────────────┐
│          │ Topbar: breadcrumb · pencarian · tema · user │
│ Sidebar  ├────────────────────────────────────────────┤
│ 240px    │ Judul halaman                    [Aksi]    │
│          ├────────────────────────────────────────────┤
│ • Overview│ Fig 1.     Fig 2.     Fig 3.     Fig 4.   │
│ • Sessions│ stat       stat       stat       stat      │
│ • Models │────────────────────────────────────────────│
│ • Usage  │ Panel utama (2/3)      │ Panel samping (1/3)│
│ • Settings│ tabel / grafik         │ aktivitas / daftar │
│          │                        │                    │
│ ──────── │                                              │
│ Docs     │                                              │
└──────────┴────────────────────────────────────────────┘
```

- **Konten maksimal 1200px**, rata kiri, padding 24px.
- Grid 12 kolom, gap 16px. Panel utama 8 kolom, samping 4 kolom.
- Rata kiri untuk semua konten.

Breakpoint:

| Lebar      | Perilaku                                                   |
| ---------- | ---------------------------------------------------------- |
| ≥ 1024px   | Sidebar tetap, grid dua kolom                              |
| 640–1023px | Sidebar jadi ikon (56px), panel samping turun ke bawah     |
| < 640px    | Sidebar jadi menu geser, stat 2×2, tabel scroll horizontal |

File `dashboard-template.html` adalah implementasi acuan layout ini.

---

## 8. Gerak dan aksesibilitas

- Transisi hanya 120ms `ease-out` pada hover, fokus, dan buka/tutup menu.
- Tidak ada animasi masuk otomatis atau elemen yang bergerak sendiri.
- Hormati `prefers-reduced-motion`: matikan semua transisi.
- Fokus keyboard selalu terlihat (outline 2px `--accent`).
- Area sentuh minimal 32×32px (44px di mobile).
- Status tidak boleh hanya mengandalkan warna. Sertakan teks (`running`, `failed`).
- Gunakan elemen semantik: `nav`, `main`, `table`, `button`.

---

## 9. Yang dilakukan dan dihindari

**Lakukan**

- Pakai monospace untuk semua teks, angka, dan ID.
- Pakai border 1px untuk struktur.
- Pertahankan palet netral, aksen hanya untuk interaktif.
- Tampilkan data mentah yang bisa disalin.

**Hindari**

- Gradient, glow, glassmorphism, shadow tebal.
- Font sans-serif atau serif bercampur.
- Kartu berradius besar dan warna-warni.
- Ikon dekoratif berlebihan dan ilustrasi.
- Huruf kapital semua dan tracking lebar.

---

## 10. Checklist implementasi

- [ ] Token warna terang dan gelap terpasang di `:root`
- [ ] IBM Plex Mono dimuat dengan fallback monospace
- [ ] Skala tipografi dan spasi 4px dipakai konsisten
- [ ] Tidak ada shadow atau gradient
- [ ] Fokus keyboard terlihat di semua elemen interaktif
- [ ] Layout responsif di 3 breakpoint
- [ ] Kontras teks ≥ 4.5:1 di kedua tema

---

## 11. Implementasi: Next.js 16 + Tailwind CSS + shadcn/ui + Motion

Bagian ini menerjemahkan token di atas ke stack project. `dashboard-template.html` tetap menjadi referensi visual, sedangkan kode produksinya ada di `dashboard-nextjs.zip`.

### 11.1 Instalasi

```bash
# 1. Proyek (Tailwind v4 sudah termasuk)
npx create-next-app@latest nama-project --ts --tailwind --app

# 2. shadcn/ui
cd nama-project
npx shadcn@latest init
npx shadcn@latest add sidebar button input table badge separator tooltip sheet

# 3. Pendukung
npm i motion next-themes lucide-react
```

Lalu salin isi `app/` dan `components/` dari zip. Jika project memakai folder `src/`, pindahkan keduanya ke dalam `src/`. Pastikan alias `@/*` di `tsconfig.json` sesuai.

### 11.2 Pemetaan token ke variabel shadcn

Nilai disimpan di `app/globals.css` (`:root` untuk terang, `.dark` untuk gelap) dan diekspos ke Tailwind lewat `@theme inline`.

| Token desain   | Variabel shadcn                                                | Class Tailwind            |
| -------------- | -------------------------------------------------------------- | ------------------------- |
| `--bg`         | `--background`                                                 | `bg-background`           |
| `--text`       | `--foreground`                                                 | `text-foreground`         |
| `--surface`    | `--card`, `--popover`                                          | `bg-card`                 |
| `--surface-2`  | `--muted`, `--accent`, `--secondary`                           | `bg-muted`                |
| `--text-muted` | `--muted-foreground`                                           | `text-muted-foreground`   |
| `--border`     | `--border`, `--input`                                          | `border`                  |
| `--danger`     | `--destructive`                                                | `text-destructive`        |
| tombol primary | `--primary` = warna teks, `--primary-foreground` = warna latar | `bg-primary`              |
| **aksen biru** | `--brand` (token tambahan)                                     | `text-brand`, `ring-ring` |
| status         | `--success`, `--warning` (token tambahan)                      | `text-success`            |

Perhatikan: di shadcn, `accent` berarti **warna hover**, bukan warna aksen merek. Karena itu aksen biru dipisah sebagai `--brand`.

### 11.3 Font dan radius

- Font dimuat lewat `next/font/google` (`IBM_Plex_Mono`, bobot 400/500/600) dengan variabel `--font-plex`.
- `--font-sans` **dan** `--font-mono` dipetakan ke Plex Mono, sehingga semua komponen shadcn otomatis monospace tanpa ubah satu per satu.
- Radius dibatasi dua nilai: `--radius-sm: 4px` (tombol, input, badge) dan `--radius-md/lg/xl: 6px` (panel). Jangan pakai `rounded-xl` atau `rounded-full` untuk elemen UI.

### 11.4 Pemakaian komponen shadcn

| Kebutuhan | Komponen                         | Penyesuaian                                                                                              |
| --------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Sidebar   | `Sidebar` (`collapsible="icon"`) | Lebar 15rem, item aktif diberi garis kiri 2px `--brand`. Di mobile otomatis menjadi sheet                |
| Tombol    | `Button`                         | Primary default, `outline` untuk secondary, `ghost` untuk aksi ringan                                    |
| Input     | `Input`                          | Latar `bg-muted`, tinggi 32px                                                                            |
| Tabel     | `Table`                          | Tinggi baris 36px, tanpa zebra, hover `bg-muted`                                                         |
| Status    | `Badge variant="outline"`        | `border-current bg-transparent`, warna lewat `text-*`                                                    |
| Panel     | komponen `Panel` buatan sendiri  | Border 1px, radius 6px, tanpa shadow. Tidak memakai `Card` karena default-nya membawa padding dan shadow |

### 11.5 Aturan Motion

Impor dari `motion/react` (`motion.div`, `AnimatePresence`, `MotionConfig`). Konfigurasi global ada di `components/providers.tsx`:

```tsx
<MotionConfig reducedMotion="user" transition={{ duration: 0.12, ease: "easeOut" }}>
```

| Boleh                                                     | Contoh di template                                                    |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| Gerak sebagai **respons aksi** pengguna                   | Indikator tab berpindah (`layoutId`), tombol Copy berubah jadi Copied |
| Gerak saat **data berubah**                               | Item aktivitas baru/dihapus (`AnimatePresence` + `layout`)            |
| Perpindahan antar-state yang menjelaskan apa yang berubah | Buka/tutup panel, ganti tab                                           |

| Dihindari                                              | Alasan                                     |
| ------------------------------------------------------ | ------------------------------------------ |
| Fade/slide-in untuk setiap section saat halaman dimuat | Terasa generik dan memperlambat persepsi   |
| Animasi berulang atau looping                          | Tidak sesuai karakter terminal yang tenang |
| Durasi di atas 200ms                                   | Dashboard harus terasa instan              |
| Spring yang memantul                                   | Gunakan `ease-out` linear-ish              |

Aturan teknis:

- Selalu beri `initial={false}` pada `AnimatePresence` agar tidak ada animasi saat mount pertama.
- Komponen yang memakai `motion.*` harus diawali `"use client"`. Biarkan halaman dan komponen statis tetap server component.
- Jangan animasikan `width`/`height` pada elemen besar. Pakai `opacity` dan `transform`; `height: auto` hanya untuk item daftar kecil.
- `reducedMotion="user"` sudah menonaktifkan animasi transform bagi pengguna yang memintanya. Jangan ditimpa.

### 11.6 Struktur folder

```
app/
  globals.css            ← token + @theme inline
  layout.tsx             ← font Plex, <Providers>
  (dashboard)/
    layout.tsx           ← SidebarProvider + Topbar + konten maks 1200px
    page.tsx             ← Overview
components/
  providers.tsx          ← next-themes + MotionConfig
  theme-toggle.tsx
  ui/                    ← dihasilkan shadcn (jangan diedit sembarangan)
  dashboard/
    app-sidebar.tsx  topbar.tsx  panel.tsx
    stats.tsx  sessions-table.tsx  status-badge.tsx
    activity-list.tsx  command-box.tsx
```

Halaman baru (`sessions`, `models`, `usage`, `settings`) ditambahkan sebagai folder di dalam `app/(dashboard)/` sehingga otomatis memakai layout yang sama.

### 11.7 Catatan Next.js 16

- Turbopack menjadi bundler default, jadi `next dev` dan `next build` sudah memakainya.
- Halaman dan layout adalah **server component** secara default. Beri `"use client"` hanya pada komponen yang memakai state, `usePathname`, `next-themes`, atau Motion.
- `params` dan `searchParams` bersifat async; gunakan `await` bila halaman dinamis ditambahkan nanti.
- `suppressHydrationWarning` pada `<html>` diperlukan oleh `next-themes`.

---

## 12. Gaya Frame / Grid Lines

Kerangka garis tipis seperti di situs opencode.ai. Yang diambil dari sana hanya **struktur garisnya** — palet, font, dan spasi tetap mengikuti §3–§5 dokumen ini.

### 12.1 Komponen

Semua aturan garis ditulis satu kali di `components/dashboard/frame.tsx`. Halaman berikutnya cukup memakai komponen ini, tidak boleh menulis ulang `border-x`/`border-b` sendiri.

| Komponen    | Fungsi                                                                     |
| ----------- | -------------------------------------------------------------------------- |
| `Frame`     | Container terpusat: `max-w-[1350px]`, `min-h-screen`, rail `border-x`       |
| `FrameRow`  | Baris isi: sidebar di kiri, konten di kanan                                |
| `FrameHeader` | Baris header/topbar dengan pembatas `border-b`                          |

### 12.2 Aturan garis

- Rail vertikal: `border-x` 1px, setinggi halaman, maksimal di tengah lewat `max-w-[1350px]`.
- Pembatas horizontal: `border-b` 1px di bawah header/topbar dan di antara section.
- Warna garis hairline: `border-border/60`. Cukup subtle untuk hampir menyatu dengan latar, dan otomatis benar di tema terang maupun gelap karena `--border` berbeda per tema.
- Sudut tetap kecil sesuai §5: `rounded-sm` 4px untuk tombol dan input, `rounded-md` 6px untuk panel.
- Tidak ada shadow, gradient, atau warna dekoratif pada garis.

### 12.3 Susunan

```
Frame                 ← container terpusat + rail kiri/kanan
├ FrameHeader         ← border-b: brand di kiri, tema di kanan
└ FrameRow            ← baris
  ├ Sidebar           ← border-r, memisahkan dari konten
  └ SidebarInset
    ├ FrameHeader     ← border-b: topbar (judul, tema, akun)
    └ konten         ← section dipisah border-b bila perlu
```

### 12.4 Breakpoint

| Lebar      | Perilaku                                                             |
| ---------- | -------------------------------------------------------------------- |
| ≥ 768px    | Rail `border-x` tampil, sidebar menetap di kiri dalam frame          |
| < 768px    | Rail dihapus (`max-md:border-x-0`), sidebar menjadi sheet/drawer      |

### 12.5 Catatan implementasi

- `Sidebar` bawaan shadcn memakai `position: fixed` di tepi kiri viewport. Kalau dibiarkan, sidebar akan menutupi rail kiri dan berada di luar `Frame`. Karena itu `app/cms-theme.css` mengubahnya jadi `position: sticky` dan menyembunyikan `[data-slot="sidebar-gap"]`. Jangan diedit langsung di `components/ui/sidebar.tsx`.
- Latar belakang pola garis (`.line-grid` di `app/cms-theme.css`) dipakai opsional, hanya di halaman login.

