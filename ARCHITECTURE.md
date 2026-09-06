# Architecture

Dokumentasi arsitektur ini disusun berdasarkan inspeksi langsung terhadap kode sumber proyek **Nusa Elixir**.

---

## Technology Stack

### Runtime & Core Framework
- **Runtime**: Browser Client Environment (SPA).
- **Core Library**: React 19 (`react` 19.1.1, `react-dom` 19.1.1).
- **Build Tool**: Vite 6 (`vite` 6.2.0, `@vitejs/plugin-react` 5.0.0).
- **Language**: TypeScript 5.8 (`typescript` ~5.8.2) dengan konfigurasi `moduleResolution: "bundler"`.

### Styling & Asset Delivery
- **CSS Framework**: Tailwind CSS (dimuat via CDN `https://cdn.tailwindcss.com` pada `index.html` dengan konfigurasi tema warna dan font kustom).
- **Web Fonts**: Google Fonts (`Cinzel` dan `Poppins`) dimuat via `<link>` tag di `index.html`.

### AI SDK & Document Generation
- **AI SDK**: `@google/genai` (v1.20.0).
- **PDF Engine**: `pdf-lib` (v1.17.1 dimuat via `<script>` CDN `unpkg.com`).
- **File Downloader**: `downloadjs` (v1.4.7 dimuat via `<script>` CDN `unpkg.com`).

### Storage
- **Client Database**: Native Browser HTML5 IndexedDB API.

---

## Project Structure

Struktur direktori dan berkas fisik pada repositori adalah sebagai berikut:

```
├── .env.local                    # Variabel lokal (GEMINI_API_KEY)
├── .gitignore                    # Konfigurasi ignore git
├── App.tsx                       # Komponen root aplikasi & router sederhana
├── index.html                    # Entry HTML, skrip CDN, Tailwind runtime & importmap
├── index.tsx                     # Entry mount React root & LanguageProvider
├── metadata.json                 # Metadata proyek AI Studio
├── package.json                  # Definisi dependensi & skrip Vite
├── tsconfig.json                 # Konfigurasi kompilasi TypeScript
├── vite.config.ts                # Konfigurasi build & define environment Vite
├── constants.ts                  # Konstanta opsi minuman, IBU/SRM, dan kamus lokalisasi
├── types.ts                      # Tipe data TypeScript (Recipe, Ingredient, Step, Language)
│
├── assets/
│   └── icon.svg                  # Asset ikon visual
│
├── components/
│   ├── Header.tsx                # Bilah navigasi atas, pengubah bahasa, & tombol login
│   ├── Footer.tsx                # Bilah informasi bawah
│   ├── OfflineBanner.tsx         # Banner penanda status luring
│   ├── RecipeDetail.tsx          # Komponen tampilan lengkap hasil resep
│   ├── Spinner.tsx               # Animasi pemintal saat pemuatan AI
│   └── form/
│       ├── BeerForm.tsx          # Sub-formulir khusus parameter bir
│       ├── WineForm.tsx          # Sub-formulir khusus parameter anggur
│       ├── LiqueurForm.tsx       # Sub-formulir khusus basis spirit & ABV likur
│       ├── NaturalSodaForm.tsx   # Sub-formulir jenis ragi/kultur soda alami
│       └── CustomIngredients.tsx # Input dinamis penambahan bahan kustom lokal
│
├── contexts/
│   └── LanguageContext.tsx       # React Context pengelola state bahasa (en / id)
│
├── hooks/
│   └── useLocalization.ts        # Custom hook pembungkus konteks & helper terjemahan
│
├── screens/
│   ├── HomeScreen.tsx            # Halaman formulir peracikan & tampilan hasil
│   └── MyRecipesScreen.tsx       # Halaman galeri resep tersimpan dari IndexedDB
│
└── services/
    ├── dbService.ts              # Driver pembungkus IndexedDB (NusaElixirDB)
    ├── geminiService.ts          # Layanan pemanggil Google GenAI SDK & skema JSON
    └── pdfService.ts             # Layanan layouting & pembuatan PDF berbasis pdf-lib
```

---

## Application Structure

Aplikasi dirancang sebagai **Single-Page Application (SPA)** berbasis komponen fungsional React tanpa *routing library* eksternal (seperti `react-router`). Navigasi dikendalikan oleh *state machine* sederhana di tingkat root (`App.tsx`):

- Layar Aktif (`currentScreen`): `'home'` | `'myRecipes'`.
- Header berada di posisi tetap (*sticky*) di bagian atas, merender tombol navigasi untuk beralih layar dan tombol pengalih bahasa.
- Banner luring (`OfflineBanner`) disuntikkan secara kondisional tepat di bawah header ketika browser mendeteksi `navigator.onLine === false`.

---

## Main Components

1. **`App` (`/App.tsx`)**:
   - Memegang state navigasi `currentScreen` dan pendeteksi status jaringan `isOnline`.
   - Menginisialisasi basis data `initDB()` pada siklus hidup `useEffect`.
2. **`HomeScreen` (`/screens/HomeScreen.tsx`)**:
   - Mengelola seluruh state input formulir (tipe minuman, volume, keahlian, parameter spesifik, bahan kustom).
   - Mengontrol siklus hidup pemanggilan API (loading, error handling, penyerahan data ke `RecipeDetail`).
   - Menyimpan otomatis resep yang berhasil dibuat ke IndexedDB.
3. **`MyRecipesScreen` (`/screens/MyRecipesScreen.tsx`)**:
   - Mengambil seluruh data resep dari IndexedDB saat pertama kali dimuat.
   - Mengelompokkan resep berdasarkan `spiritType` menggunakan `useMemo`.
   - Menangani pemilihan resep untuk ditinjau secara mendalam serta aksi unduh cepat (PDF/JSON) per kartu.
4. **`RecipeDetail` (`/components/RecipeDetail.tsx`)**:
   - Merender struktur dokumen resep: blok judul, kartu ringkasan metrik, daftar peralatan, takaran bahan, langkah bertahap berpenomoran, serta blok merah peringatan keselamatan.
   - Mengandung tombol aksi cetak PDF (`generateRecipePdf`) dan unduh berkas JSON.
5. **Form Sub-components (`/components/form/*`)**:
   - `BeerForm`, `WineForm`, `LiqueurForm`, `NaturalSodaForm`, dan `CustomIngredients`. Komponen formulir murni yang menerima props nilai dan *setter callback* dari induknya (`HomeScreen`).

---

## Data Model

Definisi entitas inti berpusat pada antarmuka `Recipe` di `/types.ts`:

```typescript
export interface RecipeIngredient {
  name: string;
  quantityValue: number;
  quantityUnit: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id?: number; // Auto-increment key IndexedDB
  title: string;
  description: string;
  spiritType: string;
  skillLevel: string;
  prepTimeMinutes: number;
  fermentationTimeDays: number;
  safetyPrecautions: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  finalABV: number;
  targetVolumeLiters: number;
  equipmentUsed?: string[];

  // Spesifik Bir
  beerStyle?: string;
  ibu?: number;
  srm?: number;
  originalGravity?: number;
  finalGravity?: number;

  // Spesifik Anggur
  wineType?: string;

  // Informasi Gizi
  caloriesPerServing?: number;
  sugarPerServingGrams?: number;
  servingSizeMl?: number;
}
```

---

## State Management

- **Local Component State**: Sebagian besar state aplikasi (form input, status loading, error message, selected recipe) disimpan secara lokal di dalam komponen React menggunakan `useState`.
- **Global Context**: State bahasa antarmuka dikelola melalui `LanguageContext` (`language: 'en' | 'id'`), yang disimpan di tingkat memori React dan dapat diubah melalui `useLocalization` hook. Tidak ada persistensi `localStorage` untuk pilihan bahasa (kembali ke `'en'` saat refresh).
- **Persistent State**: Resep yang dibuat disimpan di luar siklus hidup memori React, yaitu pada IndexedDB peramban pengguna.

---

## Data Flow

```
[User Input di Formulir HomeScreen]
       │
       ▼ (Submit Form Event)
[services/geminiService.ts: generateRecipe()]
       │
       ├─ Membangun Prompt Teknis & Spesifik Kategori
       ├─ Menyertakan Skema JSON (recipeSchema)
       ▼
[Google GenAI API (gemini-2.5-flash)]
       │
       ▼ (Valid JSON String Response)
[JSON.parse & validasi tipe]
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[setGeneratedRecipe(recipe)]    [services/dbService.ts: addRecipe(recipe)]
       │                                 │
       ▼                                 ▼
[Render RecipeDetail Component] [Tulis ke IndexedDB "recipes" store]
       │
       ├─ Klik Simpan PDF ──> [services/pdfService.ts -> downloadjs]
       └─ Klik Ekspor JSON ─> [JSON.stringify -> downloadjs]
```

---

## Storage / Persistence

Penyimpanan aplikasi sepenuhnya berada di sisi klien (*Client-Side Persistence*):
- **Database**: IndexedDB dengan nama `NusaElixirDB` (Versi 1).
- **Object Store**: `recipes` dengan konfigurasi `{ keyPath: 'id', autoIncrement: true }`.
- **Index**: Indeks sekunder dibuat pada kolom `spiritType` (`unique: false`).
- **Driver**: Dikelola secara manual melalui callback native `indexedDB.open` di `/services/dbService.ts`.
- **Operasi yang Disediakan**:
  - `initDB()`: Inisialisasi dan migrasi struktur store.
  - `addRecipe(recipe)`: Menambahkan resep baru (transaksi *readwrite*).
  - `getAllRecipes()`: Mengambil semua resep (transaksi *readonly*).
  - *Catatan*: Tidak ada implementasi untuk `deleteRecipe` atau `updateRecipe`.

---

## External Services

1. **Google Gemini API**:
   - Endpoint: Layanan resmi Google Generative Language.
   - Panggilan: Dilakukan langsung dari peramban menggunakan library `@google/genai`.
2. **Google Fonts CDN**:
   - Mengambil stylesheet dan file font `.woff2`/`.ttf` untuk `Cinzel` dan `Poppins`.
3. **Tailwind CDN**:
   - `https://cdn.tailwindcss.com` digunakan untuk menyusun utility classes saat runtime di peramban.
4. **Unpkg CDN**:
   - Menyediakan berkas distribusi mini untuk `pdf-lib` dan `downloadjs`.

---

## AI Integration

- **Library**: `@google/genai` (versi 1.20.0).
- **Model**: `gemini-2.5-flash`.
- **Karakteristik Implementasi**:
  - **Structured Outputs**: Memanfaatkan parameter `responseMimeType: "application/json"` dan `responseSchema: recipeSchema` dengan pendefinisian enum tipe yang presisi (`Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, `Type.INTEGER`, `Type.NUMBER`). Hal ini menjamin LLM tidak mengembalikan teks bebas di luar format JSON yang diharapkan.
  - **Dynamic Prompt Engineering**: Fungsi `getSpecificInstructions(params)` menyuntikkan arahan proses spesifik sesuai kategori (misal: penekanan pada *ginger bug starter* untuk soda alami, atau jadwal perebusan hop untuk bir).
  - **Bilingual Prompt Conditioning**: Prompt secara eksplisit menginstruksikan LLM menggunakan Bahasa Indonesia jika bahasa aktif adalah `'id'`.

---

## Important Dependencies

Berdasarkan berkas `package.json` dan skrip pada `index.html`:

| Dependensi | Lokasi / Versi | Peran |
|---|---|---|
| `react` | npm (`^19.1.1`) | Pustaka UI inti |
| `react-dom` | npm (`^19.1.1`) | Pengikatan DOM untuk React |
| `@google/genai` | npm (`^1.20.0`) | SDK resmi Gemini API |
| `vite` | dev npm (`^6.2.0`) | Bundler dan dev server |
| `@vitejs/plugin-react` | dev npm (`^5.0.0`) | Dukungan JSX/TSX Fast Refresh untuk Vite |
| `pdf-lib` | CDN (`1.17.1`) | Komposisi dokumen PDF koordinat rendah |
| `downloadjs` | CDN (`1.4.7`) | Utilitas pemicu unduhan file biner di browser |
| `tailwindcss` | CDN (`cdn.tailwindcss.com`) | Kompiler CSS runtime |

---

## Architectural Patterns

1. **Client-Centric / Serverless Prototype**:
   - Tidak ada tier aplikasi backend. Semua kalkulasi bisnis, pemanggilan AI, dan penyimpanan data berada di browser.
2. **Props Drilling / Dumb-Smart Component**:
   - Komponen layar (`HomeScreen`, `MyRecipesScreen`) bertindak sebagai penampung logika dan state (*smart component*), sementara formulir di dalamnya (`BeerForm`, `RecipeDetail`, dll.) bertindak sebagai *dumb component* yang menerima data lewat props.
3. **Structured Schema Pattern for LLM**:
   - Memanfaatkan skema kaku sebagai kontrak data antar AI dan UI, meminimalkan kebutuhan parsing regex manual.
4. **Layout Manager Koordinat Manual untuk PDF**:
   - Kelas `PdfLayoutManager` di `pdfService.ts` mengelola perhitungan koordinat Y, margin, pembungkusan teks (*word wrapping*), dan pemecahan halaman (*page break*) secara manual.

---

## Security Considerations

### ⚠️ Temuan Kritis: Kunci API Terekspos di Client
Pada `vite.config.ts`:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```
Dan pada `services/geminiService.ts`:
```typescript
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY! });
```
**Analisis Keamanan**: Konfigurasi ini menyalin nilai kunci API secara harfiah ke dalam bundel JavaScript yang dikirim ke browser pengguna. Siapa pun yang membuka DevTools (*Network* atau *Sources*) dapat mengambil kunci API ini dan menggunakannya untuk menghabiskan kuota atau biaya akun.
- **Rekomendasi Arsitektural**: Wajib membangun backend proksi (misal Express atau serverless function) yang menyimpan API key di lingkungan server dan menyediakan endpoint `/api/generate-recipe`.

---

## Current Technical Debt

1. **Beban Skrip CDN Global**: Pustaka kritis seperti `pdf-lib` dan `downloadjs` dimuat melalui tag `<script>` publik di `index.html` dan dideklarasikan secara global (`declare const PDFLib: any;`). Ini menghilangkan type-safety dan membuat aplikasi rentan gagal bila CDN tidak dapat diakses.
2. **Ketiadaan CSS Bundling Standar**: Tailwind dijalankan via runtime browser (`cdn.tailwindcss.com`), yang tidak direkomendasikan untuk produksi karena overhead performa dan hilangnya optimasi *purge unused CSS*.
3. **Tautan CSS Mati**: Di `index.html` terdapat `<link rel="stylesheet" href="/index.css">`, namun berkas `/index.css` sebenarnya tidak ada di dalam repositori (menghasilkan eror HTTP 404 di konsol).
4. **Operasi Database yang Belum Lengkap**: `dbService.ts` tidak menyediakan fungsi `deleteRecipe` atau `updateRecipe`, mengakibatkan akumulasi data di IndexedDB tanpa opsi pengelolaan oleh pengguna.
5. **State Bahasa Tidak Tersimpan**: `LanguageContext` tidak menyimpan preferensi bahasa ke `localStorage`, sehingga saat pengguna merefresh halaman, bahasa selalu kembali ke Bahasa Inggris.

---

## Scalability Considerations

- **Kapasitas Penyimpanan**: Penyimpanan di IndexedDB dibatasi oleh kuota peramban perangkat pengguna (umumnya beberapa ratus MB). Untuk data teks resep, kapasitas ini lebih dari cukup untuk ribuan resep.
- **Biaya API Gemini**: Karena pemanggilan API terjadi langsung per klik pengguna tanpa caching atau pembatasan laju (*rate limiting*), penggunaan skala besar dapat memicu lonjakan biaya API dengan cepat.
- **Beban Perangkat pada Pembuatan PDF**: Pembuatan PDF dilakukan di thread utama JavaScript peramban. Untuk resep yang sangat panjang dengan banyak langkah, hal ini dapat menyebabkan sedikit jeda antarmuka (*UI freeze*) pada perangkat ponsel berdaya rendah.

---

## Maintainability Considerations

- **Struktur Kode Sangat Bersih**: Pemisahan modul di `components/`, `screens/`, `services/`, dan `constants.ts` sangat rapi dan mudah dibaca oleh pengembang baru.
- **Skema Bertipe Kuat**: Penggunaan antarmuka TypeScript yang sinkron dengan skema JSON Gemini memudahkan refaktor data tanpa takut merusak alur data.
- **Komponen Formulir Terisolasi**: Pemisahan formulir per jenis minuman ke dalam folder `components/form/` membuat penambahan jenis minuman baru di masa mendatang menjadi sangat mudah.

---

## Architecture Assessment

### 1. What was actually found (Fakta Kode)
- Aplikasi SPA React 19 murni berbasis Vite tanpa server backend.
- Pemanggilan langsung ke `@google/genai` dari peramban dengan skema JSON kaku.
- Penyimpanan lokal native menggunakan IndexedDB.
- Modul PDF berbasis koordinat manual yang diimplementasikan sangat rapi.
- Ketergantungan pada beberapa skrip CDN eksternal.

### 2. Your interpretation (Interpretasi Penilai)
- Aplikasi ini dibangun sebagai purwarupa fungsional tingkat tinggi (*high-fidelity functional prototype*) untuk memvalidasi ide pembuatan resep minuman kriya berbasis AI. Pengembang lebih memprioritaskan kelancaran interaksi di peramban dan keindahan presentasi visual daripada keamanan infrastruktur *multi-tier*.

### 3. Your assumptions (Asumsi Penilai)
- Ketiadaan backend dan penggunaan CDN diperkirakan disengaja agar aplikasi dapat langsung di-*serve* dan diuji secara cepat dalam lingkungan sandbox container Google AI Studio tanpa perlu mengonfigurasi database server terpisah.
