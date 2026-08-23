# Ruang Pulih

**Aplikasi Grounding untuk Manajemen Kecemasan**

Ruang Pulih adalah aplikasi web berbasis bukti ilmiah (_evidence-based_) yang membantu pengguna mempelajari dan mempraktikkan teknik grounding untuk mengelola kecemasan, stres, dan disosiasi melalui pendekatan sensorik, pernapasan, dan kognitif.

## Fitur Utama

- **Tombol SOS "Pulihkan Aku"** — Akses cepat ke sesi grounding darurat dengan alur terpadu.
- **Monitoring Kesejahteraan** — Pengukuran skala SUD (Subjective Units of Distress) pre-post untuk memantau efektivitas sesi.
- **6 Teknik Grounding Terintegrasi**:
  - **5-4-3-2-1** (Sensorik)
  - **Box Breathing** (Pernapasan)
  - **Ocean Breath** (Pernapasan)
  - **Mindful Walking** (Gerakan)
  - **Grounding Sentuhan** (Sensorik)
  - **Grounding Auditori** (Sensorik)
- **Progress Dashboard** — Visualisasi bento-grid untuk statistik sesi, pencapaian milestone, dan riwayat jurnal.
- **Afirmasi Positif** — Kumpulan afirmasi terapeutik yang dikurasi untuk penguatan kognitif.
- **Sinkronisasi Data** — Integrasi backend untuk penyimpanan riwayat sesi dan assessment yang aman.
- **Umpan Balik pengguna** — kirim umpan balik dan admin dapat meninjau ulasan melalui halaman admin.

## Tech Stack

| Layer     | Teknologi                                          |
| --------- | -------------------------------------------------- |
| Frontend  | React 19 + TypeScript + Vite 8                     |
| Styling   | Tailwind CSS 4 + Base UI (shadcn-style components) |
| Animation | Framer Motion                                      |
| Backend   | Express 5 + TypeScript                             |
| Database  | MongoDB + Mongoose                                 |

## Struktur Proyek (Monorepo Layout)

Monorepo ini menggunakan npm workspaces dengan dua workspace utama: `apps/web` (frontend React) dan `apps/api` (backend Express).

```
groundease/
├── apps/
│   ├── web/            # Frontend React (Vite) — @ruang-pulih/web
│   │   ├── public/     # Aset statis (audio, ikon)
│   │   └── src/
│   │       ├── assets/ # Media
│   │       ├── config/ # Global styles & data statis
│   │       ├── logic/  # Hooks & state (useSessionFlow, dll.)
│   │       ├── routes/ # Halaman (Home, Session, Progress, dll.)
│   │       ├── services/ # Integrasi API & localStorage
│   │       ├── types/  # Definisi tipe
│   │       └── ui/     # Komponen atomik & layout
│   └── api/            # Backend Express
│       └── src/        # config, controllers, endpoints, logic, middleware, types
├── docs/               # Dokumentasi (PRD, roadmap, referensi)
├── docker-compose.yml  # Web + API + MongoDB
├── deploy.ps1          # Skrip deploy otomatis
└── package.json        # Workspace orchestrator (npm workspaces)
```

## Persiapan & Instalasi

### Prerequisites

- Node.js >= 20 (disarankan 22 atau 24)
- MongoDB (lokal, Atlas, atau Docker)

### Instalasi

Tunggu satu perintah saja di root repository (npm workspaces mengelola kedua paket sekaligus):

```bash
git clone <repo-url>
cd groundease
npm install
```

Alternatif dengan Docker (menjalankan web, API, dan MongoDB sekaligus):

```bash
docker compose up --build -d
```

## Pengembangan

```bash
npm run dev       # web (:5173) + api (:3001) bersamaan
npm run dev:web   # hanya frontend → http://localhost:5173
npm run dev:api   # hanya backend → http://localhost:3001
npm run build     # build production kedua workspace
npm run lint      # lint kedua workspace
npm run format    # format kode (prettier)
```

Request API di frontend diproksikan oleh Vite dari `/api` ke `http://localhost:3001` (backend).

## Alur Penggunaan

1. **Dashboard (Beranda)**: Lihat ringkasan progres dan akses cepat ke sesi darurat.
2. **Library (Teknik)**: Pilih dari 6 teknik yang tersedia berdasarkan kategori (Pernapasan, Sensorik, Gerakan).
3. **Session Flow**: Jalani sesi yang terdiri dari:
   - _Pre-Assessment_: Evaluasi tingkat kecemasan awal.
   - _Practice_: Latihan teknik dengan panduan visual dan timer.
   - _Post-Assessment_: Evaluasi perubahan setelah latihan dan penulisan jurnal singkat.
4. **Progress**: Tinjau statistik mingguan, milestone yang dicapai, dan catatan jurnal masa lalu.

## Docker / Deploy

- **Lokal**: `docker compose up --build -d` — membuka web di `:3000`, API di `:5000`, MongoDB internal (tidak diekspos). MongoDB memakai `--auth`; kredensial root diambil dari `.env` proyek (`MONGO_ROOT_USER` / `MONGO_ROOT_PASSWORD`, dengan default dev).
- **Server remote**: `.\deploy.ps1` — deploy dua tahap ke server `acerblue`: **`acerblue-local` (LAN)** terlebih dahulu, lalu **`acerblue` (via Cloudflare tunnel)**. Script mengemas aplikasi, mengirim via `scp` + `ssh` ke `~/projects/deploy/groundease` di server, menghentikan stack lama (`docker compose down --remove-orphans`, volume mongo dipertahankan), menjalankan `docker compose up --build -d`, lalu melakukan health check (`:3000` web + `/api/health`).
  - `.\deploy.ps1 -Target acerblue-local` — hanya path LAN
  - `.\deploy.ps1 -Target acerblue` — hanya path Cloudflare
  - `.\deploy.ps1 -SkipHealthCheck` — lewati verifikasi HTTP

## Konteks Proyek

- **Fokus**: Grounding Sensorik + Afirmasi Positif
- **Target**: Individu yang membutuhkan alat bantu regulasi emosi mandiri.
- **Tujuan**: Menyediakan intervensi singkat yang mudah diakses dan berbasis data.

## Disclaimer

Aplikasi ini adalah alat bantu edukasi dan self-help. **BUKAN** pengganti konsultasi dengan profesional kesehatan mental.

Jika mengalami krisis, hubungi:

- **Into The Light Indonesia**: 119 ext. 8
- **LSM Jangan Bunuh Diri**: 021-9696 9293

## Lisensi

Proyek akademik/penelitian — Hak cipta dilindungi.
