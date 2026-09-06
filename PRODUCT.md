# Product

---

## Product Overview

**Nusa Elixir** adalah aplikasi generator resep minuman fermentasi, spirit kriya, bir, anggur non-anggur (*non-grape wine*), dan soda alami yang berfokus pada pemanfaatan komoditas dan bahan baku lokal kepulauan Indonesia. Aplikasi ini menggabungkan konfigurasi parameter teknis formulasi minuman (*yield*, target ABV, IBU, SRM, tingkat kemanisan, bahan kustom) dengan penalaran model bahasa besar (Gemini 2.5 Flash) untuk menyusun instruksi pembuatan terperinci, takaran metrik, rincian nutrisi kasar, serta protokol keselamatan pembuatan.

- **Status Status**: Implemented (Functional Prototype)
- **Status Rencana Awal**: Inferred (sebagai eksperimen formulasi minuman lokal berbasis AI dengan estetika visual Bauhaus).

---

## Problem Statement

1. **Kelangkaan Resep Fermentasi Terstandardisasi Berbasis Flora Nusantara** *(Inferred & Addressed)*: Sebagian besar literatur dan komunitas *brewing* berbasis pada bahan iklim subtropis (hop barat, malt jelai standar, ragi anggur eropa). Resep yang memanfaatkan komoditas tropis lokal (aren, nira, rempah-rempah, beras ketan, buah tropis seperti salak atau manggis) tersebar secara lisan atau tidak terstandarisasi takaran dan keselamatan prosesnya.
2. **Ketiadaan Formula Skala Fleksibel** *(Implemented)*: Pengguna rumahan kesulitan menskalakan resep (misal: dari panduan umum 1 liter menjadi batch fermentasi 10 atau 20 liter) secara matematis seimbang.
3. **Risiko Keamanan pada Fermentasi & Distilasi Rumahan** *(Implemented)*: Proses fermentasi (akumulasi gas CO2 bertekanan tinggi pada soda) dan distilasi spirit (risiko kebakaran uap etanol dan racun fraksi metanol) membutuhkan peringatan keselamatan eksplisit yang kerap diabaikan oleh hobiis pemula.

---

## Target Users

1. **Perajin Minuman Rumahan / Homebrewers** *(Inferred & Implemented)*:
   - Individu yang hobi meracik bir kriya, mead, atau anggur buah skala mikro di rumah dan ingin memasukkan unsur rasa lokal Indonesia.
2. **Pegiat Minuman Sehat & Fermentasi Probiotik** *(Inferred & Implemented)*:
   - Pengguna yang membuat soda fermentasi probiotik non-alkohol atau rendah alkohol (tepache, ginger bug, water kefir) menggunakan gula aren dan buah-buahan lokal.
3. **Mixologist & Bar Kriya** *(Inferred & Partial)*:
   - Peracik minuman komersial yang mencari inspirasi formulasi *infused liqueur* berbasis spirit lokal nusantara (Arak Bali/Jawa, rum lokal).

---

## User Needs

- **Formulasi Cepat & Terukur**: Kemampuan mendapatkan takaran gram/liter bahan yang presisi sesuai volume wadah fermentasi yang dimiliki pengguna. *(Implemented)*
- **Fleksibilitas Bahan Lokal**: Keleluasaan memasukkan bahan-bahan apa saja yang tersedia di dapur/pasar lokal (misal: sereh, kapulaga, salak, gula merah) ke dalam komposisi resep. *(Implemented)*
- **Panduan Keamanan Proses**: Edukasi peringatan bahaya tekanan botol atau kontrol suhu distilasi. *(Implemented)*
- **Portabilitas & Akses Luring**: Akses terhadap resep yang telah dibuat meskipun berada di area fermentasi/kebun yang minim sinyal internet, serta kemampuan mengunduh dalam bentuk cetak/PDF. *(Implemented)*
- **Manajemen Akun / Sinkronisasi Multi-Device**: Sinkronisasi resep ke cloud untuk akun pengguna. *(Planned / Not Implemented - tombol Login ada tapi tidak aktif)*

---

## Core Use Cases

### UC-1: Merancang Resep Minuman Kriya Kustom
- **Aktor**: Pengguna / Perajin.
- **Deskripsi**: Pengguna memilih tipe minuman (misal: Bir atau Soda Alami), menentukan volume (misal 15 Liter), memilih tingkat keahlian, memasukkan bahan tambahan lokal, lalu meminta sistem menghasilkan formula lengkap.
- **Status**: Implemented.

### UC-2: Menyimpan dan Membaca Resep Secara Luring
- **Aktor**: Pengguna.
- **Deskripsi**: Resep yang dihasilkan otomatis masuk ke memori penyimpanan lokal browser (*IndexedDB*). Pengguna dapat membuka tab "Resep Saya" bahkan saat koneksi internet terputus.
- **Status**: Implemented.

### UC-3: Mencetak / Mengunduh Dokumen Resep (PDF & JSON)
- **Aktor**: Pengguna.
- **Deskripsi**: Pengguna mengekspor resep ke dalam berkas PDF berformat rapi untuk dicetak dan ditempel di ruang kerja fermentasi, atau mengekspor berkas JSON untuk kebutuhan pengolahan data.
- **Status**: Implemented.

### UC-4: Autentikasi Pengguna & Kolaborasi Tim
- **Aktor**: Pengguna / Bartender.
- **Deskripsi**: Masuk akun untuk sinkronisasi cloud atau berbagi resep.
- **Status**: Planned / Stub Only (Hanya ada tombol tampilan "Login" di Header tanpa logika).

---

## User Workflows

### 1. Alur Pembuatan Resep (Generation Workflow) - *Implemented*
```
[Buka Aplikasi (Home)]
       │
       ▼
[Pilih Kategori Minuman]
 ├─ Natural Soda ──> [Pilih Jenis: Ginger Bug / Kefir / Tepache / Yeast Water / Kvass]
 ├─ Beer ──────────> [Isi Style, Pilih IBU, Pilih SRM, Pilih Metode All-Grain/Extract]
 ├─ Wine ──────────> [Pilih Jenis Wine & Tingkat Kemanisan]
 ├─ Infused Liqueur> [Pilih Base Spirit (Arak/Rum/Vodka/Whiskey) & Target ABV]
 └─ Base Spirits ──> [Arak / Rum / Vodka / Whiskey]
       │
       ▼
[Tentukan Target Volume (Liter) & Tingkat Keahlian]
       │
       ▼
[Opsional: Tambahkan Bahan Kustom (Nama, Jumlah, Satuan)]
       │
       ▼
[Klik "Hasilkan Resep"]
       │
       ▼
[Sistem memanggil Gemini 2.5 Flash dengan skema JSON terstruktur]
       │
       ▼
[Tampilkan Rincian Resep & Simpan Otomatis ke IndexedDB]
```

### 2. Alur Tinjauan & Ekspor Resep (Review & Export Workflow) - *Implemented*
```
[Buka Layar "Resep Saya"]
       │
       ▼
[Aplikasi memuat semua resep dari IndexedDB]
       │
       ▼
[Daftar dikelompokkan berdasarkan Kategori Minuman]
       │
       ├─ Klik Card Resep ────> [Tampilkan Layar Detail Resep Penuh]
       ├─ Klik Tombol PDF ────> [Kompilasi & Unduh Berkas PDF (.pdf)]
       └─ Klik Tombol JSON ───> [Unduh Berkas Data (.json)]
```

---

## Functional Requirements

| ID | Kebutuhan Fungsional | Status | Catatan Implementasi Aktual |
|---|---|---|---|
| **FR-01** | Pemilihan 8 kategori minuman utama | **Implemented** | `BEVERAGE_TYPES` di `constants.ts` (Soda, Beer, Wine, Liqueur, Arak, Rum, Vodka, Whiskey). |
| **FR-02** | Sub-formulir dinamis berbasis kategori | **Implemented** | Sub-komponen muncul bersyarat: `BeerForm`, `WineForm`, `LiqueurForm`, `NaturalSodaForm`. Spirit murni tidak memiliki sub-form khusus. |
| **FR-03** | Input bahan kustom tanpa batas | **Implemented** | Pengguna dapat menambah baris input dinamis (Nama, Kuantitas angka, Satuan). |
| **FR-04** | Validasi input non-negatif | **Implemented** | Helper `handleNonNegativeChange` mencegah input angka negatif pada target volume dan ABV. |
| **FR-05** | Alih Bahasa Dinamis (ID / EN) | **Implemented** | `LanguageContext` + `LOCALIZATION_STRINGS` menyediakan kamus lengkap dan menginstruksikan LLM mengeluarkan bahasa yang sesuai. |
| **FR-06** | Generasi formula via LLM terstruktur | **Implemented** | Menggunakan `@google/genai` dengan skema `recipeSchema` bertipe kuat via `gemini-2.5-flash`. |
| **FR-07** | Estimasi data teknis bir (IBU, SRM, OG, FG) | **Implemented** | Dihitung dan diproyeksikan oleh prompt Gemini, dirender pada kartu metrik. |
| **FR-08** | Estimasi data nutrisi (Kalori, Gula, Serving) | **Implemented** | Ditampilkan jika disediakan oleh model Gemini. |
| **FR-09** | Kotak Peringatan Keselamatan Eksplisit | **Implemented** | Ditampilkan mencolok dengan latar belakang merah Bauhaus jika instruksi mengandung risiko. |
| **FR-10** | Simpan otomatis ke IndexedDB | **Implemented** | Setiap resep yang berhasil di-generate langsung dipanggil `addRecipe(recipe)`. |
| **FR-11** | Deteksi status luring (Offline Banner) | **Implemented** | Event listener `online`/`offline` pada window menampilkan banner kuning Bauhaus saat offline. |
| **FR-12** | Ekspor PDF langsung di browser | **Implemented** | Modul `pdfService.ts` merakit berkas PDF berbasis koordinat dengan font `Cinzel` & `Poppins`. |
| **FR-13** | Ekspor JSON langsung di browser | **Implemented** | Fungsi unduhan JSON berbasis `downloadjs`. |
| **FR-14** | Penghapusan resep tersimpan | **Not Implemented** | Tidak ada tombol atau API untuk menghapus resep di `MyRecipesScreen` maupun `dbService.ts`. |
| **FR-15** | Penyuntingan resep tersimpan | **Not Implemented** | Resep bersifat *read-only* setelah disimpan. |
| **FR-16** | Autentikasi Pengguna & Cloud Storage | **Not Implemented / Stub** | Tombol "Login" ada di Header tetapi tidak memiliki `onClick` atau integrasi backend apa pun. |

---

## Business Rules

1. **Skalabilitas Volume Wajib**: Model AI diinstruksikan secara tegas bahwa seluruh takaran bahan dan instruksi wajib diskalakan tepat sesuai angka liter yang diminta pengguna (`targetVolumeLiters`).
2. **Kewajiban Nuansa Lokal Indonesia**: Prompt sistem mengunci tema: jika pengguna tidak memasukkan bahan kustom, AI wajib menyisipkan bahan tradisional Indonesia (gula aren, rempah nusantara, buah tropis).
3. **Kepatuhan Satuan Metrik**: Seluruh takaran wajib menggunakan sistem metrik (gram, kilogram, mililiter, liter).
4. **Protokol Keselamatan Mutlak**: Peringatan bahaya wajib disertakan, khususnya terkait distilasi alkohol (uap mudah terbakar, pembuangan fraksi awal/methanol) dan karbonasi botol (*burping* botol soda untuk menghindari ledakan).
5. **Kategori Non-Alkohol / Rendah Alkohol**: Pada kategori *Natural Soda*, instruksi AI mengunci produk akhir harus non-alkohol atau memiliki ABV < 0.5%.

---

## Data / Entities

### 1. `Recipe` *(Implemented)*
- `id` (Number, auto-increment IndexedDB)
- `title` (String)
- `description` (String)
- `spiritType` (String)
- `skillLevel` (String: "Beginner" | "Intermediate" | "Advanced")
- `prepTimeMinutes` (Number)
- `fermentationTimeDays` (Number)
- `finalABV` (Number)
- `targetVolumeLiters` (Number)
- `safetyPrecautions` (String)
- `ingredients` (Array of `RecipeIngredient`)
- `steps` (Array of `RecipeStep`)
- `equipmentUsed` (Optional Array of String)
- *Beer Specific*: `beerStyle`, `ibu`, `srm`, `originalGravity`, `finalGravity`
- *Wine Specific*: `wineType`
- *Nutritional Info*: `caloriesPerServing`, `sugarPerServingGrams`, `servingSizeMl`

### 2. `RecipeIngredient` *(Implemented)*
- `name` (String)
- `quantityValue` (Number)
- `quantityUnit` (String)

### 3. `RecipeStep` *(Implemented)*
- `stepNumber` (Number)
- `instruction` (String)

---

## AI Capabilities

- **Model yang Digunakan**: `gemini-2.5-flash` via `@google/genai`. *(Implemented)*
- **Structured Output Generation**: Menggunakan fitur `responseSchema` (Type.OBJECT) dari Gemini API untuk memastikan respon 100% berupa JSON valid yang langsung cocok dengan antarmuka TypeScript `Recipe`. *(Implemented)*
- **Multi-Role Prompting**: Instruksi dinamis menyesuaikan kategori:
  - *Natural soda*: Bertindak sebagai pakar fermentasi mikroba (*ginger bug*, *kefir*, *tepache*).
  - *Beer*: Bertindak sebagai *master brewer* dengan kalkulasi *mashing*, *boiling*, *hop schedule*.
  - *Wine*: Bertindak sebagai *winemaker* (penyiapan sari buah, fermentasi, penjernihan, penuaan).
  - *Infused Liqueur*: Bertindak sebagai ahli likur dengan formula pengenceran (*dilution*) ke target ABV.
  - *Spirits*: Bertindak sebagai *master distiller*.
- **Language Conditioning**: Prompt menginstruksikan seluruh teks keluaran (judul, deskripsi, langkah, peringatan) diterjemahkan ke Bahasa Indonesia jika bahasa aktif adalah `'id'`. *(Implemented)*

---

## Integrations

- **Google Gen AI API**: Integrasi langsung di peramban via `@google/genai` (kunci API dimuat via `process.env.API_KEY`). *(Implemented)*
- **IndexedDB**: Integrasi browser storage native untuk penyimpanan resep luring. *(Implemented)*
- **PDF-Lib & Downloadjs**: Integrasi pustaka visual canvas PDF via script CDN pihak ketiga. *(Implemented)*
- **Autentikasi / Database Cloud**: Tidak ada integrasi backend (Firebase, Supabase, OAuth tidak ada). *(Not Implemented)*

---

## UX Principles

1. **Gaya Desain Bauhaus Khas**:
   - Penggunaan palet warna primer kontras tinggi: *Bauhaus Red* (`#d93f3d`), *Bauhaus Yellow* (`#f5dd2a`), *Bauhaus Blue* (`#4c80c2`), dengan kanvas netral krem hangat (`#f3f0e9`) dan teks gelap arang (`#1e1e1e`).
   - Garis batas tebal berbobot 2px hingga 4px (`border-2 border-bauhaus-dark`) tanpa *drop-shadow* lembut modern, mengadopsi prinsip desain struktural fungsionalis.
2. **Tipografi Berkarakter**:
   - Paduan font klasik display serif berkarakter megah (`Cinzel`) untuk judul utama resep dan heading tebal, dipadukan dengan sans-serif modern (`Poppins`) untuk keterbacaan instruksi teknis dan formulir.
3. **Formulir Modular Sesuai Konteks**:
   - Antarmuka hanya menampilkan input relevan (misal parameter IBU/SRM hanya terbuka saat Bir dipilih).
4. **Indikasi Status Jelas**:
   - Tombol berubah menjadi status nonaktif (*disabled*) dan menampilkan animasi pemintal (*spinner*) saat proses kalkulasi resep berlangsung.

---

## Current Scope

- Pemilihan 8 jenis kategori minuman.
- Pengaturan parameter teknis bir, anggur, likur, dan soda alami.
- Penyisipan bahan lokal manual oleh pengguna.
- Pembuatan resep berbasis Gemini dengan format JSON kaku.
- Tampilan detail resep terstruktur (bahan, alat, instruksi, keselamatan, nutrisi).
- Penyimpanan lokal otomatis via IndexedDB.
- Layar daftar resep tersimpan yang dikelompokkan berdasarkan kategori.
- Ekspor PDF bergaya Bauhaus dan ekspor berkas JSON mentah.
- Alih bahasa antarmuka dan resep (Inggris dan Indonesia).
- Indikator status jaringan luring.

---

## Out of Scope

- Autentikasi pengguna, registrasi, atau profil perajin.
- Sinkronisasi cloud antar perangkat.
- Fitur pencarian (*search*), penyortiran (*sorting*), atau pemfilteran (*filtering*) di layar "Resep Saya".
- Fungsi edit atau hapus resep di IndexedDB.
- Fitur berbagi tautan (*shareable web link*) untuk resep.
- Pengatur waktu fermentasi (*fermentation timer / logging / brewing journal*).
- Kalkulator konversi hidrometer interaktif mandiri di luar respon AI.

---

## Known Limitations

- **Keamanan Kunci API**: Kunci Gemini API berada di sisi klien (Vite define bundle).
- **Dependensi Jaringan CDN**: Jika unpkg atau CDN Tailwind down, PDF exporter atau tampilan aplikasi akan terdegradasi.
- **Data Statis / Ketiadaan Manipulasi Data**: Tidak ada mekanisme menghapus data resep yang salah dibuat; pengguna harus menghapus cache browser IndexedDB secara manual jika ingin membersihkan daftar.
- **Keterbatasan Validasi LLM**: AI dapat menghasilkan kombinasi bahan yang terdengar masuk akal namun secara biokimia sulit difermentasi atau menghasilkan rasa kurang sedap.

---

## Future Opportunities

1. **Jurnal Fermentasi Terintegrasi**: Mengubah resep menjadi batch aktif dengan pencatatan harian (suhu ruangan, pembacaan gravitasi berkala, foto proses).
2. **Kalkulator Biokimia Terintegrasi**: Menggabungkan formula matematis eksak (kalkulasi ABV dari OG/FG, rumus IBU Tinseth) untuk memvalidasi atau menyempurnakan keluaran AI.
3. **Penyimpanan Berbasis Cloud (Firebase/Supabase)**: Memungkinkan pengguna menyimpan koleksi resep mereka ke akun personal yang dapat diakses di berbagai perangkat.
4. **Komunitas Berbagi Resep**: Fitur membagikan racikan resep lokal teruji ke feed publik perajin nusantara.
