export const BEVERAGE_TYPES = [
    { id: 'natural_soda', nameEn: 'Natural Soda', nameId: 'Soda Alami' },
    { id: 'beer', nameEn: 'Beer', nameId: 'Bir' },
    { id: 'wine', nameEn: 'NG Wine', nameId: 'Anggur NG' },
    { id: 'infused_liqueur', nameEn: 'Infused Liqueur', nameId: 'Liqueur Infus' },
    { id: 'arak', nameEn: 'Arak', nameId: 'Arak' },
    { id: 'rum', nameEn: 'Rum', nameId: 'Rum' },
    { id: 'vodka', nameEn: 'Vodka', nameId: 'Vodka' },
    { id: 'whiskey', nameEn: 'Whiskey', nameId: 'Wiski' },
];

export const NATURAL_SODA_TYPES = [
    { id: 'ginger_bug', nameEn: 'Ginger Bug Soda', nameId: 'Soda Ragi Jahe' },
    { id: 'water_kefir', nameEn: 'Water Kefir', nameId: 'Kefir Air' },
    { id: 'tepache', nameEn: 'Tepache', nameId: 'Tepache' },
    { id: 'fruit_yeast_water', nameEn: 'Fruit Yeast Water Soda', nameId: 'Soda Ragi Buah' },
    { id: 'kvass', nameEn: 'Kvass', nameId: 'Kvass' },
];

export const IBU_LEVELS = [
    { id: 'low', value: 20, nameEn: 'Low', nameId: 'Rendah', descriptionEn: 'Lightly bitter, approachable.', descriptionId: 'Sedikit pahit, mudah dinikmati.' },
    { id: 'moderate', value: 40, nameEn: 'Moderate', nameId: 'Sedang', descriptionEn: 'Balanced bitterness, a popular choice.', descriptionId: 'Pahit seimbang, pilihan populer.' },
    { id: 'high', value: 60, nameEn: 'High', nameId: 'Tinggi', descriptionEn: 'Assertively hoppy and bitter.', descriptionId: 'Rasa hop yang kuat dan pahit.' },
    { id: 'very_high', value: 80, nameEn: 'Very High', nameId: 'Sangat Tinggi', descriptionEn: 'For true hop lovers, intensely bitter.', descriptionId: 'Untuk pecinta hop sejati, sangat pahit.' },
];

export const SRM_LEVELS = [
    { id: 'pale_straw', value: 3, nameEn: 'Pale Straw', nameId: 'Kuning Pucat', descriptionEn: 'Very light, like pilsner.', descriptionId: 'Sangat terang, seperti pilsner.' },
    { id: 'golden', value: 6, nameEn: 'Golden', nameId: 'Keemasan', descriptionEn: 'Slightly darker, like pale ale.', descriptionId: 'Sedikit lebih gelap, seperti pale ale.' },
    { id: 'amber', value: 12, nameEn: 'Amber', nameId: 'Amber', descriptionEn: 'Amber to coppery color.', descriptionId: 'Warna amber hingga tembaga.' },
    { id: 'dark_brown', value: 25, nameEn: 'Dark Brown', nameId: 'Coklat Tua', descriptionEn: 'Deep brown, like a porter.', descriptionId: 'Coklat pekat, seperti porter.' },
    { id: 'black', value: 40, nameEn: 'Black', nameId: 'Hitam', descriptionEn: 'Opaque black, like a stout.', descriptionId: 'Hitam pekat, seperti stout.' },
];

export const BREWING_METHODS = [
    { id: 'all_grain', nameEn: 'All-Grain', nameId: 'All-Grain' },
    { id: 'extract', nameEn: 'Extract', nameId: 'Ekstrak' },
];

export const WINE_TYPES = [
    { id: 'fruit_wine', nameEn: 'Fruit Wine', nameId: 'Anggur Buah' },
    { id: 'flower_herbal_wine', nameEn: 'Flower & Herbal Wine', nameId: 'Anggur Bunga & Herbal' },
    { id: 'grain_wine', nameEn: 'Grain Wine', nameId: 'Anggur Biji-bijian' },
    { id: 'mead', nameEn: 'Mead', nameId: 'Mead (Anggur Madu)' },
];

export const WINE_SWEETNESS = [
    { id: 'dry', nameEn: 'Dry', nameId: 'Kering (Dry)' },
    { id: 'semi_sweet', nameEn: 'Semi-Sweet', nameId: 'Semi-Manis' },
    { id: 'sweet', nameEn: 'Sweet', nameId: 'Manis' },
];

export const SKILL_LEVELS = [
    { id: 'beginner', nameEn: 'Beginner', nameId: 'Pemula' },
    { id: 'intermediate', nameEn: 'Intermediate', nameId: 'Menengah' },
    { id: 'advanced', nameEn: 'Advanced', nameId: 'Mahir' },
];

export const LOCALIZATION_STRINGS = {
    // Header
    appTitle: { en: 'Nusa Elixir', id: 'Nusa Elixir' },
    login: { en: 'Login', id: 'Masuk' },
    myRecipes: { en: 'My Recipes', id: 'Resep Saya' },

    // Home Screen
    discoverTitle: { en: 'Discover Your Next Creation', id: 'Temukan Ciptaan Anda Berikutnya' },
    discoverSubtitle: { en: 'Generate a unique Indonesian spirit, beer, or wine recipe tailored to your needs.', id: 'Hasilkan resep spirit, bir, atau anggur unik Indonesia yang disesuaikan dengan kebutuhan Anda.' },
    spiritTypeLabel: { en: 'Beverage Type', id: 'Jenis Minuman' },
    skillLevelLabel: { en: 'Skill Level', id: 'Tingkat Keahlian' },
    targetProductionLabel: { en: 'Yield (Liters)', id: 'Hasil (Liter)' },
    targetProductionPlaceholder: { en: 'e.g., 10', id: 'Contoh: 10' },
    baseSpiritLabel: { en: 'Base Spirit', id: 'Spirit Dasar' },
    desiredAbvLabel: { en: 'Desired ABV (%)', id: 'ABV yang Diinginkan (%)' },
    desiredAbvPlaceholder: { en: 'e.g., 25', id: 'Contoh: 25' },
    customIngredientsLabel: { en: 'Custom Ingredients (Optional)', id: 'Bahan Kustom (Opsional)' },
    addIngredientBtn: { en: 'Add Ingredient', id: 'Tambah Bahan' },
    removeIngredientBtn: { en: 'Remove Ingredient', id: 'Hapus Bahan' },
    ingredientNamePlaceholder: { en: 'Ingredient Name (e.g., Salak)', id: 'Nama Bahan (Contoh: Salak)' },
    quantityPlaceholder: { en: 'Qty', id: 'Jml' },
    unitPlaceholder: { en: 'Unit (e.g., grams)', id: 'Unit (Contoh: gram)' },
    generateRecipeBtn: { en: 'Generate Recipe', id: 'Hasilkan Resep' },
    generatingRecipe: { en: 'Generating your masterpiece...', id: 'Menghasilkan mahakarya Anda...' },
    errorTitle: { en: 'An Error Occurred', id: 'Terjadi Kesalahan' },
    errorDescription: { en: 'Could not generate a recipe. Please check your connection or try again later.', id: 'Tidak dapat menghasilkan resep. Silakan periksa koneksi Anda atau coba lagi nanti.' },
    
    // Liqueur Form
    liqueurSection: { en: 'Liqueur Details', id: 'Detail Liqueur' },

    // Beer Form
    beerCraftingSection: { en: 'Beer Crafting Details', id: 'Detail Pembuatan Bir' },
    beerStyleLabel: { en: 'Beer Style', id: 'Gaya Bir' },
    beerStylePlaceholder: { en: 'e.g., Indonesian Pale Ale', id: 'Contoh: Pale Ale Indonesia' },
    targetIbuLabel: { en: 'Target IBU', id: 'Target IBU' },
    targetIbuPlaceholder: { en: 'e.g., 40', id: 'Contoh: 40' },
    targetSrmLabel: { en: 'Target SRM (Color)', id: 'Target SRM (Warna)' },
    targetSrmPlaceholder: { en: 'e.g., 8', id: 'Contoh: 8' },
    brewingMethodLabel: { en: 'Brewing Method', id: 'Metode Pembuatan' },

    // Wine Form
    wineMakingSection: { en: 'Wine Making Details', id: 'Detail Pembuatan Anggur' },
    wineTypeLabel: { en: 'Wine Type', id: 'Jenis Anggur' },
    wineSweetnessLabel: { en: 'Desired Sweetness', id: 'Tingkat Kemanisan' },

    // Natural Soda Form
    naturalSodaSection: { en: 'Natural Soda Details', id: 'Detail Soda Alami' },
    naturalSodaTypeLabel: { en: 'Soda Type', id: 'Jenis Soda' },

    // Recipe Detail
    overview: { en: 'Overview', id: 'Gambaran' },
    prepTime: { en: 'Prep Time', id: 'Waktu Persiapan' },
    fermentationTime: { en: 'Fermentation', id: 'Waktu Fermentasi' },
    minutes: { en: 'minutes', id: 'menit' },
    days: { en: 'days', id: 'hari' },
    liters: { en: 'Liters', id: 'Liter' },
    targetProduction: { en: 'Yield', id: 'Hasil' },
    abvLabel: { en: 'Final ABV', id: 'ABV Akhir' },
    equipmentNeeded: { en: 'Equipment Needed', id: 'Peralatan yang Dibutuhkan' },
    ingredients: { en: 'Ingredients', id: 'Bahan-Bahan' },
    instructions: { en: 'Instructions', id: 'Instruksi' },
    safetyPrecautions: { en: 'Safety Precautions', id: 'Tindakan Pengamanan' },
    ibuLabel: { en: 'IBU', id: 'IBU' },
    srmLabel: { en: 'SRM (Color)', id: 'SRM (Warna)' },
    ogLabel: { en: 'Original Gravity', id: 'Gravitasi Awal' },
    fgLabel: { en: 'Final Gravity', id: 'Gravitasi Akhir' },
    beerStyle: { en: 'Style', id: 'Gaya' },
    wineType: { en: 'Type', id: 'Jenis' },

    // Nutritional Info
    nutritionalInfo: { en: 'Nutritional Info (Approx.)', id: 'Informasi Gizi (Kira-kira)' },
    servingSize: { en: 'Serving Size', id: 'Ukuran Saji' },
    calories: { en: 'Calories', id: 'Kalori' },
    sugar: { en: 'Sugar', id: 'Gula' },

    // Exporters
    saveAsPdf: { en: 'Save as PDF', id: 'Simpan sebagai PDF' },
    savingPdf: { en: 'Saving...', id: 'Menyimpan...' },
    exportAsJson: { en: 'Export as JSON', id: 'Ekspor sebagai JSON' },
    exportingJson: { en: 'Exporting...', id: 'Mengekspor...' },

    // My Recipes Screen
    myRecipesTitle: { en: 'My Saved Recipes', id: 'Resep Saya yang Tersimpan' },
    noRecipesFound: { en: 'No recipes found.', id: 'Tidak ada resep yang ditemukan.' },
    noRecipesDescription: { en: 'Generate a new recipe on the home page to save it here!', id: 'Hasilkan resep baru di halaman beranda untuk menyimpannya di sini!' },
    backToRecipeList: { en: 'Back to Recipe List', id: 'Kembali ke Daftar Resep' },

    // Offline Banner
    offlineTitle: { en: "You're currently offline.", id: 'Anda sedang offline.' },
    offlineDesc: { en: "Functionality may be limited. Saved recipes are available.", id: 'Fungsionalitas mungkin terbatas. Resep yang tersimpan tersedia.' },
    
    // Footer
    footerText: { en: '© 2024 Nusa Elixir. Distill with passion.', id: '© 2024 Nusa Elixir. Distilasi dengan semangat.' },
};