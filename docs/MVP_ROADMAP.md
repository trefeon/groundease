# Ruang Pulih - MVP dan Rencana Penambahan Fitur

Tanggal update: 2026-08-06

## ✅ MVP & Fitur Terimplementasi (V1.0)

1. **Dashboard Utama**: Bento-grid layout dengan statistik sesi, afirmasi harian, dan quick action SOS.
2. **Flow Sesi Terintegrasi**: useSessionFlow hook mengelola fase Prepare -> Pre -> Practice -> Post -> Summary secara konsisten.
3. **6 Teknik Grounding**:
   - **Sensorik**: 5-4-3-2-1, Sentuhan, Auditori.
   - **Pernapasan**: Box Breathing, Ocean Breath.
   - **Gerakan**: Mindful Walking.
4. **Halaman Progres**: Visualisasi statistik mingguan, pencapaian milestone, dan riwayat jurnal lengkap.
5. **Monitoring Kecemasan**: Pengukuran SUD Scale (0-10) pre-post per sesi dengan visualisasi hasil.
6. **Library Teknik**: Katalog 6 teknik dengan detail kategori, durasi, level, dan tombol mulai.
7. **Backend Sync**: Integrasi dengan MongoDB untuk persistensi sesi, assessment, dan jurnal.
8. **Ambient Sound Player**: 5 loop audio (ocean, rain, wind, singing-bowls, river) + pemilih & preview & volume di Setelan + defaultSound per teknik.
9. **Ekspor Data**: JSON riwayat sesi di Setelan; CSV umpan balik di halaman admin.
10. **Umpan Balik Pengguna + Admin Review**: halaman /feedback + /admin/feedback dengan kunci admin & statistik.

> **Catatan Desain Ulang (Agustus 2026)**: Design system OKLCH tenang, lapisan animasi Framer Motion, dan code-splitting per route.

## 🚀 Prioritas Selanjutnya

### P0 - Penajaman Riset (Menjelang Uji Coba)

1. **Validasi Konten Akademik**: Review final bahasa instruksi bersama dosen pembimbing agar sesuai standar klinis.
2. **Enhanced Crisis Mode**: Penajaman daftar hotline krisis dan disclaimer hukum yang lebih prominen.

### P1 - Peningkatan Pengalaman (UX & Accessibility)

1. **Guided Audio Narasi**: Penambahan suara pembimbing Bahasa Indonesia untuk setiap langkah teknik.
2. **PWA (Progressive Web App)**: Sebagian - manifest `site.webmanifest` sudah ada, tetapi service worker & offline caching masih pending.

### P2 - Fitur Lanjutan (Post-Validation)

1. **Mood Check-in Standalone**: Fitur mencatat mood harian tanpa harus melakukan sesi grounding penuh.
2. **Sistem Badge Non-Kompetitif**: Reward visual untuk konsistensi latihan (misal: 3 hari berturut-turut).
3. **Edukasi Terintegrasi**: Penambahan artikel singkat tentang "Window of Tolerance" dan "Neurobiology of Grounding".

## 📁 Catatan Scope

Fitur seperti chatbot AI, konsultasi profesional langsung, fitur sosial (komunitas), dan integrasi wearable tetap di luar scope V1 agar fokus pada validasi efektivitas teknik grounding mandiri tetap terjaga.
