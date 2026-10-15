# Nusa Elixir

> Generator resep minuman fermentasi, spirit tradisional, bir kriya, dan soda alami berbasis bahan lokal Indonesia dengan bantuan kecerdasan buatan (Gemini).

🌐 **Live Demo**: https://nusa-elixir.vercel.app

---

## Overview

**Nusa Elixir** adalah aplikasi berbasis web yang membantu perajin rumahan (*homebrewers*), mikromikologis, dan pegiat minuman kriya mengeksplorasi pembuatan minuman fermentasi dan spirit menggunakan bahan-bahan lokal Indonesia (seperti gula aren, rempah nusantara, salak, nanas madu, dan buah tropis lainnya). Aplikasi ini memadukan parameter teknis pembuatan minuman (volume target, estimasi ABV, IBU, SRM, tingkat kemanisan) dengan panduan langkah-demi-langkah, kalkulasi nutrisi kasar, serta peringatan keselamatan kerja saat proses fermentasi dan distilasi.

Aplikasi ini dibangun sebagai purwarupa fungsional (*functional prototype*) di Google AI Studio yang mengintegrasikan model Gemini 2.5 Flash untuk pembuatan formula resep terstruktur, penyimpanan lokal IndexedDB untuk akses luring (*offline*), serta ekspor dokumen PDF dan JSON.

---

## Problem yang Ingin Diselesaikan

1. **Kurangnya Panduan Terstandarisasi untuk Bahan Lokal**: Resep minuman fermentasi global (bir, *cider*, *mead*, liqueur) umumnya mengasumsikan ketersediaan bahan Eropa/Amerika Utara. Formula yang mengintegrasikan komoditas tropis Indonesia (arak lokal, gula kelapa, buah tropis, ragi lokal) sangat minim dan tidak terstandardisasi.
2. **Ketiadaan Parameter Teknis & Keamanan**: Pembuatan spirit distilasi dan fermentasi bertekanan (seperti *natural soda*) memiliki risiko fatal (kontaminasi metanol pada distilasi, ledakan botol pada soda berkarbonasi). Pengguna awam membutuhkan instruksi keamanan yang eksplisit dan proporsional.
3. **Kebutuhan Format Skala Fleksibel**: Perajin sering kali harus menghitung ulang takaran bahan secara manual jika ingin memproduksi batch 5 liter, 10 liter, atau 25 liter.

---

## Target User

- **Homebrewers & Craft Drink Enthusiasts**: Hobiis pembuatan bir kriya, mead, dan anggur buah yang ingin mengeksplorasi profil rasa nusantara.
- **Mixologists & Artisanal Bartenders**: Peracik minuman yang ingin membuat *signature infused liqueur* dengan basis spirit lokal untuk bar kriya atau restoran.
- **Fermentation Hobbyists**: Pembuat soda alami probiotik berbasis bahan alami (*ginger bug*, *tepache*, *water kefir*, *fruit yeast water*).

---

## Core Features

- **Multi-Category Recipe Generator**: Mendukung 8 kategori minuman utama:
  - *Natural Soda* (Ginger Bug, Water Kefir, Tepache, Fruit Yeast Water, Kvass)
  - *Beer* (dengan kustomisasi gaya bir, target IBU, target SRM/warna, metode all-grain/extract)
  - *Wine* (Fruit Wine, Flower & Herbal Wine, Grain Wine, Mead; opsi tingkat kemanisan)
  - *Infused Liqueur* (pilihan basis spirit Arak/Rum/Vodka/Whiskey dan target ABV akhir)
  - *Distilled Spirits* (Arak tradisional, Rum, Vodka, Whiskey)
- **Custom Ingredient Injection**: Pengguna dapat menambahkan bahan khas sendiri beserta kuantitas dan satuan metrik (misal: "200 gram Jahe Merah", "500 gram Gula Aren") yang dipaksakan masuk ke dalam formula resep AI.
- **Bilingual Support (ID / EN)**: Seluruh antarmuka dan resep yang dihasilkan AI dapat dialihkan langsung antara Bahasa Indonesia dan Bahasa Inggris.
- **Technical & Nutritional Profiling**: Setiap resep menghitung estimasi ABV, waktu persiapan, durasi fermentasi, Original Gravity (OG), Final Gravity (FG), IBU, SRM, daftar peralatan, takaran metrik, serta perkiraan kalori dan gula per porsi.
- **Offline Storage & Indicator**: Resep yang dihasilkan otomatis tersimpan di peramban pengguna menggunakan IndexedDB (`NusaElixirDB`), dapat dibuka kembali saat luring via layar "Resep Saya" (*My Recipes*).
- **Exporting Capabilities**:
  - Ekspor dokumen PDF berformat siap cetak dengan palet visual Bauhaus, tipografi serif/sans, pembagian kolom bahan, dan kotak peringatan keselamatan.
  - Ekspor berkas data terstruktur mentah dalam format JSON.

---

## Main User Workflow

1. **Konfigurasi Parameter**:
   - Pengguna memilih jenis minuman (*Beverage Type*), target volume hasil dalam liter, dan tingkat keahlian (*Beginner*, *Intermediate*, *Advanced*).
   - Mengisi parameter spesifik sesuai kategori (misal: target IBU/SRM untuk bir, atau spirit dasar & target ABV untuk liqueur).
   - (Opsional) Menambahkan bahan kustom lokal lewat tombol "Tambah Bahan".
2. **Generasi Resep**:
   - Pengguna menekan tombol "Hasilkan Resep" (*Generate Recipe*).
   - Aplikasi memanggil Google GenAI SDK (`gemini-2.5-flash`) dengan *Structured JSON Schema*.
3. **Tinjauan Resep**:
   - Hasil resep ditampilkan dengan rincian metrik, daftar alat, takaran bahan, nomor instruksi bertahap, dan kotak merah *Safety Precautions*.
   - Resep otomatis tersimpan ke IndexedDB di latar belakang.
4. **Manajemen & Ekspor**:
   - Pengguna dapat mengunduh berkas PDF siap cetak atau berkas JSON.
   - Pengguna dapat beralih ke layar "Resep Saya" untuk melihat riwayat resep yang dikelompokkan berdasarkan kategori minuman.

---

## How the Application Works

1. **Client-Side Architecture**: Seluruh aplikasi berjalan di browser sebagai Single Page Application (SPA) tanpa backend server mandiri.
2. **Gemini SDK Direct Call**: Komponen `HomeScreen` memanggil `generateRecipe` di `services/geminiService.ts`. Panggilan ini mengeksekusi `@google/genai` dengan konfigurasi `responseMimeType: "application/json"` dan skema ketat (`recipeSchema`).
3. **Local Persistence Layer**: Setelah menerima JSON dari AI, resep langsung ditulis ke IndexedDB database `NusaElixirDB` pada *object store* `recipes`.
4. **Client-Side PDF Generation**: Modul `pdfService.ts` memanfaatkan pustaka `pdf-lib` dan `downloadjs` (diimpor via CDN di `index.html`) untuk menyusun dokumen PDF vektor berbasis koordinat secara dinamis di memori browser pengguna, mengunduh font Google (`Cinzel` dan `Poppins`), lalu memicu unduhan browser.

---

## Technology Stack

- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS (diinjeksi via script CDN di `index.html` dengan ekstensi tema Bauhaus)
- **AI SDK**: `@google/genai` (Google Gen AI SDK versi 1.20.0, memanggil model `gemini-2.5-flash`)
- **PDF Engine**: `pdf-lib` (v1.17.1 via unpkg CDN)
- **File Downloader**: `downloadjs` (v1.4.7 via unpkg CDN)
- **Local Storage**: HTML5 IndexedDB API bawaan peramban

---

## Current Status

**Status: Functional Prototype / Advanced PoC**

Aplikasi dapat dijalankan dan alur utama (*happy path*) berfungsi penuh: formulir lengkap, pemanggilan AI terstruktur berhasil, data tersimpan di IndexedDB, resep bisa dibuka kembali, serta ekspor PDF dan JSON berjalan. Namun, aplikasi belum siap produksi karena beberapa isu arsitektur kritis (terutama kunci API terekspos di browser client) dan belum tersedianya manajemen resep lanjutan (hapus/sunting).

---

## Known Limitations

1. **API Key Client Exposure**: API Key Gemini (`GEMINI_API_KEY`) di-inject pada tahap kompilasi Vite via `vite.config.ts` (`define: { 'process.env.API_KEY': ... }`), sehingga kunci API terekspos di bundle JavaScript publik browser.
2. **Tidak Ada Fitur Hapus / Edit Resep**: IndexedDB hanya menyediakan metode `addRecipe` dan `getAllRecipes`. Pengguna tidak dapat menghapus atau mengubah resep yang salah/gagal dari layar "Resep Saya".
3. **Tombol "Login" Hanya Placeholder**: Tombol *Login* pada Header bersifat statis tanpa fungsi autentikasi maupun *event handler*.
4. **Ketergantungan Skrip CDN Publik**: Tailwind, `pdf-lib`, dan `downloadjs` dimuat dari CDN pihak ketiga (`cdn.tailwindcss.com`, `unpkg.com`), berisiko gagal jika CDN mengalami gangguan atau jika pengguna membuka aplikasi saat luring tanpa cache awal.
5. **Ketiadaan Validasi Fisik Resep**: Resep dihasilkan murni oleh LLM. Meskipun format instruksi valid, kalkulasi spesifik seperti konversi gravitasi spesifik wort (*OG/FG*) atau hidrometer distilasi bergantung pada keakuratan halusinasi model.

---

## Important Notes for Future Developers

- **Prioritas Keamanan**: Segera pindahkan panggilan `@google/genai` ke backend proksi (misal Express, Cloud Function, atau Next.js API Routes) agar API Key tidak bocor ke publik.
- **Bundle Tailwind**: Ganti injeksi CDN Tailwind (`cdn.tailwindcss.com`) dengan Tailwind CLI atau Vite plugin standar untuk memastikan build CSS optimal dan luring sejati.
- **NPM Modules untuk PDF**: Pindahkan `pdf-lib` dan `downloadjs` dari tag `<script>` CDN `index.html` ke dependensi formal di `package.json`.
- **IndexedDB Migrations**: Jika memodifikasi antarmuka `Recipe` pada `types.ts`, naikkan `DB_VERSION` di `services/dbService.ts` dan sediakan migrasi skema.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Fitur AI membutuhkan `API_KEY` (Gemini) di environment; tanpanya aplikasi tetap berjalan.
---

## License

MIT License © 2026 Yudhan Sebastian
