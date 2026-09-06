# Product Review

---

## Current Maturity

**Status: Functional Prototype**

### Alasan Penilaian
Nusa Elixir berada pada tahap **Functional Prototype (Purwarupa Fungsional)** karena:
1. **Alur Inti Bekerja Penuh**: Alur utama aplikasi (*Happy Path*) berfungsi secara nyata dari ujung ke ujung. Pengguna dapat memilih parameter teknis, memanggil model Gemini 2.5 Flash, menerima resep dengan format JSON terstruktur yang valid, menyimpan resep secara otomatis ke IndexedDB, meninjau kembali resep dari daftar tersimpan, serta mengekspornya ke dalam format PDF berformat indah dan berkas data JSON.
2. **Belum Memenuhi Syarat MVP/Produksi**:
   - Kunci API Gemini terekspos langsung di sisi klien peramban (*client-side bundle exposure*).
   - Fitur manipulasi data dasar (CRUD) belum lengkap—resep yang telah disimpan tidak dapat dihapus atau disunting.
   - Masih terdapat elemen antarmuka yang berupa *dummy/stub* (tombol "Login" di bilah navigasi atas tidak memiliki logika apa pun).
   - Bergantung pada pustaka CDN publik pihak ketiga tanpa mekanisme *fallback*.

---

## What Works Well

- **Kualitas & Ketepatan Prompt Gemini**: Implementasi skema terstruktur (`recipeSchema`) dengan `@google/genai` bekerja sangat konsisten. AI menghasilkan resep yang menghormati target volume, memperhitungkan batasan ABV, menyertakan langkah-langkah realistis, dan mematuhi takaran metrik.
- **Injeksi Bahan Kustom**: Fitur penambahan bahan lokal manual berhasil dipadukan ke dalam prompt sistem sehingga resep yang dihasilkan benar-benar mengintegrasikan bahan yang dimasukkan pengguna (misal: salak, jahe merah, atau gula aren).
- **Mesin Ekspor PDF Klien**: Implementasi `pdfService.ts` dengan `pdf-lib` sangat impresif untuk ukuran purwarupa. Tata letak PDF memperhitungkan pemotongan baris (*word-wrapping*), pembagian kolom bahan & alat, kotak bahaya keselamatan bertinta merah, penomoran halaman otomatis, hingga pengunduhan font Google (`Cinzel` dan `Poppins`).
- **Eksekusi Desain Visual Bauhaus**: Identitas visual sangat kuat dan konsisten. Pilihan warna primer tegas (merah, biru, kuning) dengan border gelap tebal dan latar kanvas krem memberikan kesan produk kriya artisan yang berkarakter, jauh dari kesan "AI Slop" generik.
- **Dukungan Dua Bahasa (Bilingual)**: Pengalihan bahasa (ID/EN) tidak hanya mengubah label antarmuka pengguna, tetapi juga secara adaptif mengubah instruksi ke LLM agar memproduksi resep dalam bahasa yang dipilih.

---

## What Is Valuable

- **Niche yang Spesifik dan Menarik**: Minuman kriya fermentasi dengan fokus bahan lokal Indonesia adalah konsep produk yang segar dan bernilai otentik tinggi.
- **Penekanan pada Keselamatan Kerja (*Safety First*)**: Peringatan bahaya distilasi (methanol/kebakaran) dan tekanan botol karbonasi memberikan nilai tambah edukatif yang penting bagi komunitas perajin rumahan.
- **Akses Luring (Offline-First Capability)**: Kemampuan membuka resep tersimpan tanpa jaringan internet sangat relevan dengan realitas ruang kerja fermentasi (*brewhouse*, dapur, atau kebun) yang kerap minim koneksi.

---

## UX Issues

1. **Tombol "Login" Tanpa Respons**: Tombol *Login* di Header terlihat aktif dan mengundang interaksi, tetapi ketika diklik tidak melakukan apa-apa. Ini menimbulkan kebingungan bagi pengguna.
2. **Ketiadaan Konfirmasi Saat Resep Tersimpan**: Penyimpanan ke IndexedDB terjadi secara otomatis di latar belakang tanpa adanya notifikasi *toast* atau indikator visual bahwa resep telah tersimpan dengan aman di "Resep Saya".
3. **Ketiadaan Tombol Hapus Resep**: Jika pengguna bereksperimen menghasilkan banyak resep percobaan, daftar di "Resep Saya" akan terus menumpuk tanpa opsi untuk membersihkan atau menghapus resep yang tidak diinginkan.
4. **Hilangnya Status Pilihan Bahasa Saat Refresh**: Pilihan bahasa disimpan di memori komponen React. Ketika halaman di-*refresh*, bahasa selalu kembali ke Bahasa Inggris.
5. **Scroll Position Pasca-Generasi**: Setelah tombol "Hasilkan Resep" diklik dan resep selesai dibuat, layar tidak otomatis menggulir (*auto-scroll*) ke bagian hasil resep di bawah formulir panjang.

---

## Product Issues

1. **Validasian Biokimiawi Belum Teruji**: Model bahasa menyusun resep berdasarkan pola probabilitas teks. Tidak ada lapis verifikasi apakah rasio gula-terhadap-ragi atau tingkat keasaman (pH) secara riil dapat difermentasi dengan baik di dunia nyata tanpa terkontaminasi bakteri.
2. **Kategori Spirit Tanpa Sub-Formulir Khusus**: Kategori spirit murni (Arak, Rum, Vodka, Whiskey) tidak memiliki sub-parameter khusus seperti bir (IBU/SRM) atau likur (Base Spirit/ABV). Formulir hanya menampilkan input volume dan keahlian, sehingga terasa kurang mendalam dibanding kategori bir.
3. **Ketiadaan Jurnal / Catatan Pembuatan**: Dalam dunia pembuatan minuman kriya, pengguna membutuhkan catatan proses (misal: "Hari ke-3 aroma asam tercium, suhu 28°C"). Saat ini aplikasi hanya menyediakan resep statis.

---

## Technical Issues

1. **Kebocoran Kunci API (API Key Exposure)**:
   - `GEMINI_API_KEY` diinjeksi via `vite.config.ts` ke dalam variabel global browser. Siapa pun dapat mengekstrak kunci API ini melalui DevTools.
2. **Tautan CSS 404**:
   - Berkas `index.html` memanggil `<link rel="stylesheet" href="/index.css">`, padahal berkas tersebut tidak pernah dibuat di repositori.
3. **Ketergantungan CDN Eksternal**:
   - `pdf-lib`, `downloadjs`, dan `tailwindcss` dimuat dari CDN publik. Jika koneksi ke unpkg terganggu, fitur ekspor PDF dan seluruh styling aplikasi akan rusak.
4. **Eror TypeScript Terselubung**:
   - `pdfService.ts` dan komponen lain mengandalkan deklarasi global `declare const PDFLib: any;` dan `declare const download: any;` yang mematikan manfaat pemeriksaan tipe statis TypeScript.

---

## Technical Debt

- Penggunaan Tailwind via CDN script daripada instalasi paket npm lokal resmi.
- Ketiadaan migrasi skema terkelola untuk IndexedDB (misal menggunakan pembungkus modern seperti `idb` atau Dexie.js).
- Logika state formulir di `HomeScreen.tsx` terkonsentrasi dalam belasan `useState` terpisah daripada menggunakan `useReducer` atau pustaka formulir terstruktur.

---

## Missing Functionality

- Fungsi Hapus (*Delete*) dan Edit pada resep tersimpan.
- Fitur pencarian (*search*) atau penyaringan (*filter*) berdasarkan kategori atau bahan di layar "Resep Saya".
- Fitur pencatatan log/jurnal fermentasi (*brewing notes*).
- Fitur berbagi (*share recipe*) via tautan publik.
- Sistem autentikasi pengguna nyata (atau hapus tombol Login jika memang berorientasi *local-first*).

---

## Risks

1. **Risiko Keamanan Finansial**: Karena kunci API Gemini terekspos di sisi klien, kuota API berbayar pengguna dapat disalahgunakan oleh pihak ketiga jika repositori dipublikasikan secara terbuka di GitHub tanpa perbaikan.
2. **Risiko Keselamatan Fisik & Hukum**: Pembuatan spirit distilasi rumahan memiliki risiko hukum di yurisdiksi tertentu (termasuk regulasi ketat alkohol di Indonesia) serta risiko kesehatan (keracunan metanol). Walaupun kotak *Safety Precautions* sudah ada, penafian hukum (*legal disclaimer*) formal belum tersedia.

---

## What Should Be Preserved

- **Identitas Visual Bauhaus**: Skema warna merah/kuning/biru dengan garis batas tebal dan perpaduan tipografi `Cinzel` + `Poppins` memberikan jiwa artisan yang sangat kuat pada produk ini. Jangan diubah menjadi template SaaS modern generik yang membosankan.
- **Skema Output Terstruktur JSON**: Integrasi skema Gemini di `geminiService.ts` terbukti solid, konsisten, dan bebas dari kerusakan format.
- **Logika Generator PDF Klien**: Implementasi tata letak PDF dua kolom dengan penomoran langkah dan kotak keselamatan sudah sangat matang dan siap pakai.
- **Konsep Lokalitas Nusantara**: Fokus pada rempah, ragi, buah lokal, dan spirit tradisional Indonesia adalah keunggulan nilai produk paling berharga.

---

## What Should Be Changed

1. **Pindahkan Panggilan AI ke Backend**: Buat endpoint server (misal Express sederhana atau serverless function) untuk menyembunyikan `GEMINI_API_KEY`.
2. **Lengkapi Operasi Hapus di IndexedDB**: Tambahkan ikon tempat sampah pada kartu resep di "Resep Saya" untuk menghapus resep.
3. **Hapus atau Sempurnakan Tombol "Login"**: Jika aplikasi diposisikan sebagai alat *local-first*, hapus tombol *Login*. Jika ingin fitur cloud, pasang Firebase/Supabase Auth sungguhan.
4. **Bundling Dependensi**: Pasang `tailwindcss`, `pdf-lib`, dan `downloadjs` sebagai paket resmi di `package.json` untuk menghilangkan ketergantungan pada CDN publik.

---

## What Should NOT Be Over-Engineered

- Jangan mengganti IndexedDB dengan database cloud yang kompleks (seperti Spanner atau Cloud SQL) hanya untuk menyimpan resep lokal perorangan. Filosofi *local-first* sudah sangat tepat untuk kebutuhan perajin rumahan.
- Jangan menambahkan sistem perpesanan sosial atau feed komunitas yang rumit sebelum fungsionalitas dasar peracikan dan pencatatan batch teruji dengan baik.
- Jangan menambahkan integrasi hardware IoT (seperti sensor suhu/tekanan digital) pada tahap ini.

---

## Recommended Direction

### Rekomendasi Utama: **POLISH**

### Alasan Objektif:
Aplikasi ini **TIDAK PERLU DIBANGUN ULANG DARI NOL (REBUILD)** dan **SANGAT SAYANG JIKA DIARSIPKAN (ARCHIVE)**. 

Struktur kodenya di React 19 dan TypeScript sudah tertata dengan rapi dan modular. Identitas visual Bauhaus-nya sudah terbentuk secara unik dan berkarakter, alur data JSON terstrukturnya sudah solid, dan mesin pembuat PDF-nya sudah bekerja dengan sangat baik. Masalah terbesar yang menghambat aplikasi ini untuk langsung dipublikasikan ke GitHub hanyalah:
1. Kunci API Gemini yang masih berada di peramban klien.
2. Ketiadaan fitur hapus resep di IndexedDB.
3. Ketergantungan pada skrip CDN eksternal.
4. Elemen antarmuka yang mati (tombol Login).

Dengan melakukan tahap **POLISH** (sekitar 1–2 sesi pengembangan terarah untuk mengamankan backend API, merapikan dependensi lokal, dan menambahkan tombol hapus), Nusa Elixir akan langsung naik kelas dari sekadar eksperimen purwarupa menjadi sebuah portofolio produk open-source berkualitas tinggi yang siap dipamerkan di GitHub.
