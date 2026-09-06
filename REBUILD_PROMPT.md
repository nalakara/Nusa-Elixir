# Master Rebuild Prompt: Nusa Elixir

Gunakan instruksi di bawah ini sebagai **Master Build Prompt** komprehensif untuk membangun ulang aplikasi **Nusa Elixir** dari nol menggunakan coding agent AI (seperti Google AI Studio, Antigravity, Cursor, atau Claude Code) tanpa perlu merujuk pada kode sumber lama.

---

```markdown
# MISSION & SPECIFICATION: NUSA ELIXIR (CRAFT BEVERAGE & FERMENTATION STUDIO)

Anda adalah seorang Lead Full-Stack Engineer dan UI/UX Designer artisan kelas dunia. Tugas Anda adalah membangun aplikasi web bernama **"Nusa Elixir"** dari awal hingga selesai, sebuah studio formulasi resep minuman fermentasi, bir kriya, mead/anggur buah, likur infus, dan soda probiotik alami yang memanfaatkan kekayaan hayati bahan lokal Indonesia dengan panduan berbasis AI.

---

## 1. PRODUCT PURPOSE & PROBLEM

### Tujuan Produk
Memberdayakan perajin rumahan (*homebrewers*), mikromikologis, dan peracik minuman nusantara untuk merancang formula minuman fermentasi dan spirit kriya yang presisi, berskala fleksibel, terukur secara teknis, dan mengedepankan protokol keselamatan kerja, dengan memanfaatkan komoditas tropis asli Indonesia (rempah kepulauan, gula aren, nira, buah tropis, ragi lokal).

### Masalah yang Diselesaikan
1. Literatur pembuatan bir, anggur, dan soda kriya dunia hampir seluruhnya mengasumsikan bahan iklim dingin (barley malt, hop Eropa, anggur Vitis vinifera). Tidak ada panduan terstandardisasi untuk bahan tropis Indonesia.
2. Kesulitan kalkulasi skala resep perajin rumahan (menghitung gramasi bahan saat batch diubah dari 5L, 10L, ke 25L).
3. Risiko fatal keselamatan pada proses fermentasi (ledakan botol kaca bertekanan karbonasi tinggi) dan distilasi spirit (uap mudah terbakar, pembentukan metanol beracun).

---

## 2. TARGET USERS
- **Homebrewers & Fermentation Enthusiasts**: Penggemar fermentasi mandiri yang bereksperimen dengan bir kriya, mead, tepache, dan soda alami.
- **Artisanal Bartenders / Mixologists**: Peracik minuman yang ingin membuat likur infus kriya (*craft infused liqueur*) berbasis spirit nusantara (Arak, rum tebu lokal).
- **Komunitas Pangan Sehat & Alami**: Pengrajin minuman probiotik fermentasi non-alkohol berbasis ragi liar (*ginger bug*, kefir air).

---

## 3. CORE CONCEPT & BEVERAGE TAXONOMY

Aplikasi harus mendukung 8 jenis minuman utama yang terbagi dalam parameter teknis spesifik:
1. **Natural Soda (Soda Alami Probiotik)**:
   - Sub-kategori: *Ginger Bug*, *Water Kefir*, *Tepache*, *Fruit Yeast Water*, *Kvass*.
   - Karakter: Non-alkohol atau ABV sangat rendah (< 0.5%), fokus karbonasi alami dalam botol tertutup.
2. **Beer (Bir Kriya)**:
   - Parameter: Gaya bir (misal *Indonesian Pale Ale*, *Tropical Stout*), Target IBU (Low ~20, Moderate ~40, High ~60, Very High ~80), Target Warna SRM (Pale Straw ~3, Golden ~6, Amber ~12, Dark Brown ~25, Black ~40), Metode Brewing (*All-Grain* atau *Extract*).
3. **Wine / Mead (Anggur Buah & Madu)**:
   - Parameter: Tipe (*Fruit Wine*, *Flower & Herbal Wine*, *Grain Wine*, *Mead*), Tingkat Kemanisan (*Dry*, *Semi-Sweet*, *Sweet*).
4. **Infused Liqueur (Likur Infus)**:
   - Parameter: Spirit Dasar (*Arak*, *Rum*, *Vodka*, *Whiskey*), Target Final ABV (misal 20% - 35%), dengan instruksi pengenceran sirup/gula.
5. **Traditional Distilled Spirits (Spirit Distilasi Tradisional)**:
   - Kategori: *Arak Tradisional*, *Rum*, *Vodka*, *Whiskey*.
   - Karakter: Menekankan instruksi distilasi, pemisahan fraksi (*heads/hearts/tails*), dan peringatan metanol.

---

## 4. CORE FEATURES

1. **Parameter & Custom Ingredient Form**:
   - Pemilihan kategori minuman, target volume hasil (liter), dan tingkat keahlian (*Beginner*, *Intermediate*, *Advanced*).
   - Sub-formulir dinamis yang hanya muncul sesuai kategori yang dipilih.
   - Input baris dinamis "Bahan Kustom" (Nama, Jumlah, Satuan) agar pengguna dapat menyisipkan komoditas lokal spesifik (misal: "300 gram Jahe Merah", "1 kg Buah Salak").
2. **AI Recipe Generation Engine**:
   - Memanggil model AI dengan *Structured Output Schema* untuk menjamin respon berupa JSON valid tanpa halusinasi format.
   - Perhitungan estimasi waktu persiapan, durasi fermentasi, estimasi ABV, takaran metrik lengkap, daftar alat, instruksi bernomor urut, dan estimasi nutrisi kasar.
   - **Kotak Peringatan Bahaya (Safety Precautions)** yang wajib muncul secara mencolok.
3. **Local-First Persistence (IndexedDB)**:
   - Setiap resep yang berhasil dibuat otomatis disimpan ke basis data lokal peramban.
   - Halaman "Resep Saya" menampilkan kartu resep yang dikelompokkan berdasarkan kategori minuman.
   - Fitur hapus resep (*Delete*) dari IndexedDB.
4. **Export Engine**:
   - **PDF Export**: Kompilasi dokumen PDF bergaya cetak rapi langsung dari peramban (dua kolom: bahan & peralatan, instruksi bernomor, kotak keselamatan merah, penomoran halaman).
   - **JSON Export**: Unduh berkas data mentah untuk interoperabilitas.
5. **Bilingual Support (ID / EN)**:
   - Saklar pengubah bahasa (ID/EN) yang mengubah seluruh teks antarmuka dan secara dinamis menginstruksikan AI untuk memproduksi teks resep dalam bahasa yang dipilih.
6. **Offline Indicator**:
   - Banner visual yang menginformasikan jika pengguna sedang dalam status jaringan luring (resep tersimpan tetap dapat diakses).

---

## 5. TECHNICAL & ARCHITECTURE REQUIREMENTS

- **Frontend**: React 19 / Vite / TypeScript.
- **Backend Architecture**: **Wajib Full-Stack (Server-Side Proxy)**.
  - Sediakan server API backend (Express atau Vite backend middleware) pada port 3000.
  - Endpoint `POST /api/generate-recipe` bertindak sebagai perantara yang memanggil Google GenAI SDK (`gemini-2.5-flash`).
  - **Dilarang keras mengekspos `GEMINI_API_KEY` ke sisi peramban klien**.
- **Styling**: Tailwind CSS terkompilasi resmi via bundle (bukan CDN runtime script).
- **PDF Generation**: Gunakan `pdf-lib` dan `downloadjs` yang diinstal via package npm resmi (`package.json`), bukan via skrip CDN unpkg.
- **Storage**: Browser Native IndexedDB (bisa menggunakan helper seperti `idb`).

---

## 6. VISUAL DIRECTION & DESIGN SYSTEM: "BAUHAUS CRAFT"

Jangan membuat tampilan modern generik dengan gradien ungu, kartu transparan melayang, atau font Inter yang membosankan. Terapkan identitas **Bauhaus Kriya**:
- **Palet Warna**:
  - *Bauhaus Red*: `#d93f3d` (Aksen tombol utama & kotak bahaya keselamatan).
  - *Bauhaus Yellow*: `#f5dd2a` (Aksen badge & hover state).
  - *Bauhaus Blue*: `#4c80c2` (Penomoran langkah & elemen pendukung).
  - *Bauhaus Canvas/Background*: `#f3f0e9` (Latar netral hangat bertekstur kertas).
  - *Bauhaus Dark*: `#1e1e1e` (Teks tebal & garis batas tegas).
- **Borders & Shapes**:
  - Garis batas tegas berbobot 2px hingga 4px (`border-2 border-bauhaus-dark` atau `border-b-4`).
  - Sudut tajam atau sedikit membulat tipis (maksimal 4px - 8px), tanpa drop shadow buram.
- **Tipografi**:
  - Heading & Judul: Font serif berkarakter megah seperti **Cinzel** atau serif klasik sejenis.
  - Body & Label Form: Font sans-serif bersih dengan tracking tegas seperti **Poppins** (uppercase untuk label & badge).

---

## 7. DATA MODEL

```typescript
export interface RecipeIngredient {
  name: string;
  quantityValue: number;
  quantityUnit: string; // 'gram', 'kg', 'ml', 'liter', 'butir'
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  spiritType: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  prepTimeMinutes: number;
  fermentationTimeDays: number;
  finalABV: number;
  targetVolumeLiters: number;
  safetyPrecautions: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  equipmentUsed?: string[];
  
  // Specific properties
  beerStyle?: string;
  ibu?: number;
  srm?: number;
  originalGravity?: number;
  finalGravity?: number;
  wineType?: string;
  
  // Nutritional estimates
  caloriesPerServing?: number;
  sugarPerServingGrams?: number;
  servingSizeMl?: number;
  createdAt?: string;
}
```

---

## 8. AI BEHAVIOR & SYSTEM PROMPT SPECIFICATION

Ketika endpoint `/api/generate-recipe` dipanggil, susun prompt untuk `gemini-2.5-flash`:
1. **Peran Khusus**:
   - Jika bir: bertindak sebagai *Master Brewer*. Hitung rasio malt, estimasi OG/FG, serta jadwal penambahan hop.
   - Jika soda alami: bertindak sebagai *Fermentation Specialist*. Jelaskan pembuatan ragi aktif (*ginger bug* atau cairan ragi liar), proses fermentasi F1 & F2, dan instruksi *burping* botol.
   - Jika likur: bertindak sebagai *Liqueur Craft Specialist*. Hitung rasio sirup gula dan pengenceran untuk mencapai target ABV.
   - Jika distilasi: tekankan pembuangan fraksi racun metanol (*foreshots*).
2. **Kewajiban Bahan Lokal**: Jika pengguna tidak memberikan bahan kustom, sertakan bahan nusantara (gula kelapa/aren, rempah-rempah seperti cengkeh, kayu manis, jahe, pala, atau buah tropis).
3. **Skala Presisi**: Skalakan seluruh kuantitas bahan agar menghasilkan total volume sesuai `targetVolumeLiters`.
4. **Bahasa**: Patuhi instruksi bahasa (`id` = Bahasa Indonesia penuh; `en` = Bahasa Inggris).
5. **Skema JSON**: Gunakan `responseMimeType: "application/json"` dengan `responseSchema` bertipe kuat.

---

## 9. WHAT NOT TO BUILD (STRICT CONSTRAINTS)

- **JANGAN** membuat tombol Login atau modul Autentikasi palsu tanpa fungsi nyata. Aplikasi ini berprinsip *Local-First*.
- **JANGAN** menggunakan CDN runtime script untuk Tailwind atau PDF; seluruh paket harus dikompilasi melalui npm.
- **JANGAN** menambahkan fitur sosial (chat publik, profil pengguna bertingkat, follow/like) yang keluar dari fokus utama peracikan kriya.
- **JANGAN** mengabaikan kotak peringatan keselamatan (*Safety Precautions*). Peringatan ini adalah fitur inti etis produk.

---

## 10. DEFINITION OF DONE

1. Aplikasi dapat berjalan penuh via `npm run dev` dan lulus uji `npm run build`.
2. Formulir dinamis merespons pemilihan jenis minuman secara instan.
3. Kunci API Gemini tersimpan aman di server (`process.env.GEMINI_API_KEY`) dan tidak bocor ke peramban.
4. Generasi resep menghasilkan data valid yang langsung tampil dalam kartu rincian lengkap dan tersimpan otomatis ke IndexedDB.
5. Pada tab "Resep Saya", pengguna dapat membuka resep lama, menghapus resep yang tidak diinginkan, serta mengekspor berkas ke PDF (dengan styling rapi dua kolom) dan JSON.
6. Pengalihan bahasa (ID/EN) berfungsi mulus pada antarmuka dan resep AI.
```
