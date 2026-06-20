export const MOCK_LOCATIONS = [
  "Indonesia", "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar",
  "Semarang", "Bali", "Yogyakarta", "Palembang", "Tangerang",
  "Malaysia", "Singapura", "Thailand", "Filipina",
  "Australia", "Amerika Serikat", "Inggris",
];

// Penargetan terperinci (Detailed Targeting) — mengikuti taksonomi Meta Ads:
// 3 tipe (Minat, Perilaku, Demografi) dengan jalur kategori seperti di Meta asli.
export type TargetingType = "Minat" | "Perilaku" | "Demografi";

export interface DetailedTargetingItem {
  name: string;          // nama yang dipilih & disimpan
  type: TargetingType;   // klasifikasi Meta
  path: string;          // jalur kategori, mis. "Belanja dan fashion > Belanja"
}

export const META_DETAILED_TARGETING: DetailedTargetingItem[] = [
  // ===== MINAT — Bisnis dan industri =====
  { name: "Periklanan", type: "Minat", path: "Bisnis dan industri > Pemasaran" },
  { name: "Pemasaran digital", type: "Minat", path: "Bisnis dan industri > Pemasaran" },
  { name: "Pemasaran online", type: "Minat", path: "Bisnis dan industri > Pemasaran" },
  { name: "Kewirausahaan", type: "Minat", path: "Bisnis dan industri > Bisnis" },
  { name: "Bisnis kecil", type: "Minat", path: "Bisnis dan industri > Bisnis" },
  { name: "Manajemen bisnis", type: "Minat", path: "Bisnis dan industri > Bisnis" },
  { name: "E-commerce", type: "Minat", path: "Bisnis dan industri > Bisnis" },
  { name: "Real estat", type: "Minat", path: "Bisnis dan industri > Properti" },
  { name: "Konstruksi", type: "Minat", path: "Bisnis dan industri > Industri" },
  { name: "Pertanian", type: "Minat", path: "Bisnis dan industri > Industri" },

  // ===== MINAT — Belanja dan fashion =====
  { name: "Belanja online", type: "Minat", path: "Belanja dan fashion > Belanja" },
  { name: "Pusat perbelanjaan", type: "Minat", path: "Belanja dan fashion > Belanja" },
  { name: "Mode (fashion)", type: "Minat", path: "Belanja dan fashion > Pakaian" },
  { name: "Pakaian wanita", type: "Minat", path: "Belanja dan fashion > Pakaian" },
  { name: "Pakaian pria", type: "Minat", path: "Belanja dan fashion > Pakaian" },
  { name: "Sepatu", type: "Minat", path: "Belanja dan fashion > Aksesori" },
  { name: "Tas tangan", type: "Minat", path: "Belanja dan fashion > Aksesori" },
  { name: "Perhiasan", type: "Minat", path: "Belanja dan fashion > Aksesori" },
  { name: "Kosmetik", type: "Minat", path: "Belanja dan fashion > Kecantikan" },
  { name: "Perawatan kulit (skincare)", type: "Minat", path: "Belanja dan fashion > Kecantikan" },
  { name: "Salon kecantikan", type: "Minat", path: "Belanja dan fashion > Kecantikan" },

  // ===== MINAT — Makanan dan minuman =====
  { name: "Masakan", type: "Minat", path: "Makanan dan minuman > Memasak" },
  { name: "Restoran", type: "Minat", path: "Makanan dan minuman > Restoran" },
  { name: "Kopi", type: "Minat", path: "Makanan dan minuman > Minuman" },
  { name: "Teh", type: "Minat", path: "Makanan dan minuman > Minuman" },
  { name: "Makanan organik", type: "Minat", path: "Makanan dan minuman > Makanan" },
  { name: "Vegetarian", type: "Minat", path: "Makanan dan minuman > Makanan" },
  { name: "Kuliner", type: "Minat", path: "Makanan dan minuman > Makanan" },

  // ===== MINAT — Hobi dan aktivitas =====
  { name: "Fotografi", type: "Minat", path: "Hobi dan aktivitas > Seni dan musik" },
  { name: "Musik", type: "Minat", path: "Hobi dan aktivitas > Seni dan musik" },
  { name: "Melukis", type: "Minat", path: "Hobi dan aktivitas > Seni dan musik" },
  { name: "Berkebun", type: "Minat", path: "Hobi dan aktivitas > Rumah dan taman" },
  { name: "Hewan peliharaan", type: "Minat", path: "Hobi dan aktivitas > Hewan peliharaan" },
  { name: "Perjalanan (traveling)", type: "Minat", path: "Hobi dan aktivitas > Perjalanan" },
  { name: "Otomotif", type: "Minat", path: "Hobi dan aktivitas > Kendaraan" },
  { name: "Sepeda motor", type: "Minat", path: "Hobi dan aktivitas > Kendaraan" },

  // ===== MINAT — Kebugaran dan kesehatan =====
  { name: "Kebugaran (fitness)", type: "Minat", path: "Kebugaran dan kesehatan > Kebugaran" },
  { name: "Gym", type: "Minat", path: "Kebugaran dan kesehatan > Kebugaran" },
  { name: "Yoga", type: "Minat", path: "Kebugaran dan kesehatan > Kebugaran" },
  { name: "Lari", type: "Minat", path: "Kebugaran dan kesehatan > Kebugaran" },
  { name: "Nutrisi", type: "Minat", path: "Kebugaran dan kesehatan > Gizi" },
  { name: "Meditasi", type: "Minat", path: "Kebugaran dan kesehatan > Kesehatan" },

  // ===== MINAT — Olahraga dan kegiatan luar ruangan =====
  { name: "Sepak bola", type: "Minat", path: "Olahraga dan kegiatan luar ruangan > Olahraga" },
  { name: "Bola basket", type: "Minat", path: "Olahraga dan kegiatan luar ruangan > Olahraga" },
  { name: "Bulu tangkis", type: "Minat", path: "Olahraga dan kegiatan luar ruangan > Olahraga" },
  { name: "Bersepeda", type: "Minat", path: "Olahraga dan kegiatan luar ruangan > Olahraga" },
  { name: "Mendaki gunung", type: "Minat", path: "Olahraga dan kegiatan luar ruangan > Luar ruangan" },

  // ===== MINAT — Teknologi & Hiburan =====
  { name: "Telepon pintar (smartphone)", type: "Minat", path: "Teknologi > Elektronik konsumen" },
  { name: "Gawai (gadget)", type: "Minat", path: "Teknologi > Elektronik konsumen" },
  { name: "Komputer", type: "Minat", path: "Teknologi > Komputasi" },
  { name: "Perangkat lunak", type: "Minat", path: "Teknologi > Komputasi" },
  { name: "Kecerdasan buatan (AI)", type: "Minat", path: "Teknologi > Komputasi" },
  { name: "Game video", type: "Minat", path: "Hiburan > Game" },
  { name: "Game seluler", type: "Minat", path: "Hiburan > Game" },
  { name: "Film", type: "Minat", path: "Hiburan > Film" },
  { name: "Membaca buku", type: "Minat", path: "Hiburan > Bacaan" },

  // ===== MINAT — Pendidikan & Keuangan =====
  { name: "Pendidikan online", type: "Minat", path: "Pendidikan > Pembelajaran" },
  { name: "Investasi", type: "Minat", path: "Keuangan > Investasi" },
  { name: "Reksa dana", type: "Minat", path: "Keuangan > Investasi" },

  // ===== PERILAKU =====
  { name: "Pembeli online (online shopper)", type: "Perilaku", path: "Perilaku pembelian" },
  { name: "Pembelanja yang terlibat", type: "Perilaku", path: "Perilaku pembelian" },
  { name: "Pembeli musiman", type: "Perilaku", path: "Perilaku pembelian" },
  { name: "Pengguna perangkat seluler", type: "Perilaku", path: "Pengguna perangkat seluler" },
  { name: "Pengguna iPhone", type: "Perilaku", path: "Pengguna perangkat seluler > Merek" },
  { name: "Pengguna Android", type: "Perilaku", path: "Pengguna perangkat seluler > Sistem operasi" },
  { name: "Pengguna Samsung", type: "Perilaku", path: "Pengguna perangkat seluler > Merek" },
  { name: "Pengadopsi teknologi awal", type: "Perilaku", path: "Aktivitas digital" },
  { name: "Admin Halaman Facebook", type: "Perilaku", path: "Aktivitas digital" },
  { name: "Sering bepergian", type: "Perilaku", path: "Perjalanan" },
  { name: "Komuter", type: "Perilaku", path: "Perjalanan" },
  { name: "Wisatawan internasional", type: "Perilaku", path: "Perjalanan" },

  // ===== DEMOGRAFI — Pendidikan =====
  { name: "Mahasiswa", type: "Demografi", path: "Pendidikan > Tingkat pendidikan" },
  { name: "Lulusan S1", type: "Demografi", path: "Pendidikan > Tingkat pendidikan" },
  { name: "Lulusan S2", type: "Demografi", path: "Pendidikan > Tingkat pendidikan" },
  { name: "Lulusan SMA", type: "Demografi", path: "Pendidikan > Tingkat pendidikan" },

  // ===== DEMOGRAFI — Peristiwa penting =====
  { name: "Baru menikah", type: "Demografi", path: "Peristiwa penting" },
  { name: "Baru bertunangan", type: "Demografi", path: "Peristiwa penting" },
  { name: "Baru pindah rumah", type: "Demografi", path: "Peristiwa penting" },
  { name: "Ulang tahun dalam waktu dekat", type: "Demografi", path: "Peristiwa penting" },
  { name: "Memulai pekerjaan baru", type: "Demografi", path: "Peristiwa penting" },

  // ===== DEMOGRAFI — Orang tua =====
  { name: "Orang tua baru (0-12 bulan)", type: "Demografi", path: "Orang tua" },
  { name: "Orang tua dengan balita", type: "Demografi", path: "Orang tua" },
  { name: "Orang tua dengan anak remaja", type: "Demografi", path: "Orang tua" },
  { name: "Calon orang tua", type: "Demografi", path: "Orang tua" },

  // ===== DEMOGRAFI — Pekerjaan & Keuangan =====
  { name: "Pemilik bisnis kecil", type: "Demografi", path: "Pekerjaan" },
  { name: "Profesional TI", type: "Demografi", path: "Pekerjaan" },
  { name: "Tenaga kesehatan", type: "Demografi", path: "Pekerjaan" },
  { name: "Pendidik / guru", type: "Demografi", path: "Pekerjaan" },
  { name: "Berpendapatan tinggi", type: "Demografi", path: "Keuangan > Pendapatan" },
  { name: "Pemilik kartu kredit", type: "Demografi", path: "Keuangan" },
];

// Daftar nama datar untuk kompatibilitas (mis. pencarian sederhana / preset lama)
export const MOCK_INTERESTS = META_DETAILED_TARGETING.map((t) => t.name);

export const MOCK_LANGUAGES = [
  "Bahasa Indonesia", "Bahasa Inggris", "Bahasa Jawa", "Bahasa Sunda",
  "Bahasa Melayu", "Bahasa Mandarin", "Bahasa Arab",
];

export const MOCK_PAGES = [
  "AdSimulator Official",
  "Toko Online Budi",
  "Sari Beauty Store",
  "Andi Digital Agency",
  "Brand Indonesia",
];

export const MOCK_INSTAGRAM = [
  "@AdSimulator.id",
  "@tokoonlinebudi",
  "@saribeautystore",
  "@andidigital",
  "@brandindo",
];

export const MOCK_PIXELS = [
  "Pixel AdSimulator",
  "Pixel Toko Budi",
  "Pixel Sari Beauty",
];

export const MOCK_CUSTOM_AUDIENCES = [
  "Pengunjung Situs 30 Hari",
  "Lookalike Pembeli 1%",
  "Daftar Pelanggan Email",
  "Interaksi Instagram 365 Hari",
  "Penonton Video 75%",
];

export const CONVERSION_EVENTS = [
  { value: "PURCHASE", label: "Pembelian" },
  { value: "ADD_TO_CART", label: "Tambah ke Keranjang" },
  { value: "INITIATE_CHECKOUT", label: "Mulai Checkout" },
  { value: "LEAD", label: "Prospek" },
  { value: "COMPLETE_REGISTRATION", label: "Pendaftaran Selesai" },
  { value: "VIEW_CONTENT", label: "Lihat Konten" },
  { value: "CONTACT", label: "Kontak" },
];

export const PLACEMENT_OPTIONS = [
  { id: "facebook_feed", label: "Feed Facebook", platform: "Facebook" },
  { id: "instagram_feed", label: "Feed Instagram", platform: "Instagram" },
  { id: "facebook_stories", label: "Stories Facebook", platform: "Facebook" },
  { id: "instagram_stories", label: "Stories Instagram", platform: "Instagram" },
  { id: "facebook_reels", label: "Reels Facebook", platform: "Facebook" },
  { id: "instagram_reels", label: "Reels Instagram", platform: "Instagram" },
  { id: "facebook_marketplace", label: "Marketplace Facebook", platform: "Facebook" },
  { id: "facebook_video_feeds", label: "Feed Video Facebook", platform: "Facebook" },
  { id: "audience_network", label: "Audience Network", platform: "Audience Network" },
  { id: "messenger_inbox", label: "Kotak Masuk Messenger", platform: "Messenger" },
];

export const PERFORMANCE_GOALS: Record<string, { label: string; value: string }[]> = {
  AWARENESS: [
    { value: "MAXIMIZE_REACH", label: "Maksimalkan jangkauan iklan" },
    { value: "MAXIMIZE_IMPRESSIONS", label: "Maksimalkan jumlah tayangan" },
    { value: "MAXIMIZE_BRAND_AWARENESS", label: "Maksimalkan peningkatan ingatan iklan" },
  ],
  TRAFFIC: [
    { value: "MAXIMIZE_LINK_CLICKS", label: "Maksimalkan jumlah klik tautan" },
    { value: "MAXIMIZE_LANDING_PAGE_VIEWS", label: "Maksimalkan jumlah tayangan halaman tujuan" },
  ],
  ENGAGEMENT: [
    { value: "MAXIMIZE_POST_ENGAGEMENT", label: "Maksimalkan jumlah interaksi postingan" },
    { value: "MAXIMIZE_PAGE_LIKES", label: "Maksimalkan jumlah suka Halaman" },
    { value: "MAXIMIZE_EVENT_RESPONSES", label: "Maksimalkan jumlah respons acara" },
  ],
  LEADS: [
    { value: "MAXIMIZE_LEADS", label: "Maksimalkan jumlah prospek" },
    { value: "MAXIMIZE_CONVERSIONS", label: "Maksimalkan jumlah konversi" },
    { value: "MINIMIZE_COST_PER_LEAD", label: "Minimalkan biaya per prospek" },
  ],
  APP_PROMOTION: [
    { value: "MAXIMIZE_APP_INSTALLS", label: "Maksimalkan jumlah penginstalan aplikasi" },
    { value: "MAXIMIZE_APP_EVENTS", label: "Maksimalkan jumlah peristiwa aplikasi" },
  ],
  SALES: [
    { value: "MAXIMIZE_CONVERSIONS", label: "Maksimalkan jumlah konversi" },
    { value: "MAXIMIZE_VALUE", label: "Maksimalkan nilai konversi" },
    { value: "MINIMIZE_COST_PER_RESULT", label: "Minimalkan biaya per hasil" },
  ],
};

export const CONVERSION_LOCATIONS: Record<string, { value: string; label: string }[]> = {
  AWARENESS: [
    { value: "WEBSITE", label: "Situs web" },
  ],
  TRAFFIC: [
    { value: "WEBSITE", label: "Situs web" },
    { value: "APP", label: "Aplikasi" },
    { value: "MESSENGER", label: "Messenger" },
    { value: "WHATSAPP", label: "WhatsApp" },
    { value: "CALLS", label: "Panggilan" },
  ],
  ENGAGEMENT: [
    { value: "WEBSITE", label: "Situs web" },
    { value: "MESSENGER", label: "Messenger" },
    { value: "WHATSAPP", label: "WhatsApp" },
  ],
  LEADS: [
    { value: "WEBSITE", label: "Situs web" },
    { value: "APP", label: "Aplikasi" },
    { value: "MESSENGER", label: "Formulir Instan" },
    { value: "WHATSAPP", label: "WhatsApp" },
    { value: "CALLS", label: "Panggilan" },
  ],
  APP_PROMOTION: [
    { value: "APP", label: "Aplikasi" },
  ],
  SALES: [
    { value: "WEBSITE", label: "Situs web" },
    { value: "APP", label: "Aplikasi" },
    { value: "MESSENGER", label: "Messenger" },
    { value: "WHATSAPP", label: "WhatsApp" },
  ],
};

export const MOCK_INSTANT_FORMS = [
  "Formulir Prospek - Webinar",
  "Formulir Kontak Penjualan",
  "Formulir Unduh Katalog",
];

// CTA default & tipe tujuan iklan per tujuan kampanye
export const DEFAULT_CTA: Record<string, string> = {
  AWARENESS: "LEARN_MORE",
  TRAFFIC: "LEARN_MORE",
  ENGAGEMENT: "SEND_MESSAGE",
  LEADS: "SIGN_UP",
  APP_PROMOTION: "INSTALL_NOW",
  SALES: "SHOP_NOW",
};

export const MOCK_APPS = [
  "AdSimulator App (Android)",
  "AdSimulator App (iOS)",
  "Toko Budi (Android)",
];

export const APP_STORES = [
  { value: "GOOGLE_PLAY", label: "Google Play" },
  { value: "APP_STORE", label: "Apple App Store" },
];

// Konfigurasi pengaturan set iklan yang BERBEDA per tujuan kampanye (seperti Meta asli)
export const OBJECTIVE_ADSET_CONFIG: Record<string, {
  showConversion: boolean;       // tampilkan seksi Konversi (lokasi konversi)
  pixelEvent: "required" | "optional" | "none"; // pixel+peristiwa saat lokasi web/app
  frequencyControl: boolean;     // kontrol batas frekuensi (khas Awareness)
  catalog: boolean;              // opsi katalog (khas Penjualan)
  appSelection: boolean;         // pilih aplikasi (khas Promosi aplikasi)
  dynamicCreative: boolean;      // materi iklan dinamis tersedia
  costGoalLabel: string;         // label sasaran biaya per hasil
  bidStrategies: string[];       // strategi penawaran yang tersedia
}> = {
  AWARENESS: {
    showConversion: false, pixelEvent: "none", frequencyControl: true, catalog: false,
    appSelection: false, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per 1.000 tayangan (opsional)",
    bidStrategies: ["LOWEST_COST", "BID_CAP"],
  },
  TRAFFIC: {
    showConversion: true, pixelEvent: "optional", frequencyControl: false, catalog: false,
    appSelection: false, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per klik tautan (opsional)",
    bidStrategies: ["LOWEST_COST", "COST_CAP", "BID_CAP"],
  },
  ENGAGEMENT: {
    showConversion: true, pixelEvent: "optional", frequencyControl: false, catalog: false,
    appSelection: false, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per interaksi (opsional)",
    bidStrategies: ["LOWEST_COST", "COST_CAP", "BID_CAP"],
  },
  LEADS: {
    showConversion: true, pixelEvent: "required", frequencyControl: false, catalog: false,
    appSelection: false, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per prospek (opsional)",
    bidStrategies: ["LOWEST_COST", "COST_CAP", "BID_CAP"],
  },
  APP_PROMOTION: {
    showConversion: false, pixelEvent: "none", frequencyControl: false, catalog: false,
    appSelection: true, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per penginstalan (opsional)",
    bidStrategies: ["LOWEST_COST", "COST_CAP", "BID_CAP", "MIN_ROAS"],
  },
  SALES: {
    showConversion: true, pixelEvent: "required", frequencyControl: false, catalog: true,
    appSelection: false, dynamicCreative: true,
    costGoalLabel: "Sasaran biaya per pembelian (opsional)",
    bidStrategies: ["LOWEST_COST", "COST_CAP", "BID_CAP", "MIN_ROAS"],
  },
};

export const BID_STRATEGIES = [
  { value: "LOWEST_COST", label: "Biaya terendah (otomatis)", desc: "Meta mengejar hasil terbanyak dengan anggaran Anda." },
  { value: "COST_CAP", label: "Batas biaya", desc: "Jaga biaya rata-rata per hasil di sekitar jumlah tertentu." },
  { value: "BID_CAP", label: "Batas tawaran", desc: "Tetapkan tawaran maksimum di lelang." },
  { value: "MIN_ROAS", label: "ROAS minimum", desc: "Targetkan laba minimum dari belanja iklan." },
];

export const SPECIAL_AD_CATEGORIES = [
  { value: "CREDIT", label: "Kredit", desc: "Iklan terkait pinjaman, kartu kredit, atau jasa keuangan." },
  { value: "EMPLOYMENT", label: "Pekerjaan", desc: "Iklan lowongan kerja, magang, atau peluang bisnis." },
  { value: "HOUSING", label: "Perumahan", desc: "Iklan jual/sewa properti, KPR, atau layanan relokasi." },
  { value: "SOCIAL_ISSUES", label: "Isu sosial, pemilu, atau politik", desc: "Termasuk iklan donasi, kampanye sosial, dan advokasi. Wajib verifikasi identitas di Meta." },
];

export const CTA_OPTIONS: { value: string; label: string }[] = [
  { value: "LEARN_MORE", label: "Pelajari Selengkapnya" },
  { value: "SHOP_NOW", label: "Belanja Sekarang" },
  { value: "SIGN_UP", label: "Daftar" },
  { value: "BOOK_NOW", label: "Pesan Sekarang" },
  { value: "CONTACT_US", label: "Hubungi Kami" },
  { value: "DOWNLOAD", label: "Unduh" },
  { value: "GET_OFFER", label: "Dapatkan Penawaran" },
  { value: "GET_QUOTE", label: "Dapatkan Penawaran Harga" },
  { value: "SUBSCRIBE", label: "Berlangganan" },
  { value: "WATCH_MORE", label: "Tonton Lebih Lanjut" },
  { value: "SEND_MESSAGE", label: "Kirim Pesan" },
  { value: "INSTALL_NOW", label: "Instal Sekarang" },
  { value: "USE_APP", label: "Gunakan Aplikasi" },
  { value: "CALL_NOW", label: "Telepon Sekarang" },
  { value: "WHATSAPP_MESSAGE", label: "Kirim Pesan WhatsApp" },
  { value: "APPLY_NOW", label: "Lamar Sekarang" },
];

export const OBJECTIVE_INFO = {
  AWARENESS: {
    icon: "Megaphone",
    label: "Awareness",
    description: "Tampilkan iklan Anda ke orang yang kemungkinan besar akan mengingatnya.",
  },
  TRAFFIC: {
    icon: "MousePointerClick",
    label: "Traffic",
    description: "Kirim orang ke destinasi, seperti situs web, aplikasi, atau acara Facebook.",
  },
  ENGAGEMENT: {
    icon: "Heart",
    label: "Interaksi",
    description: "Dapatkan lebih banyak pesan, tayangan video, interaksi postingan, suka Halaman, atau respons acara.",
  },
  LEADS: {
    icon: "Users",
    label: "Prospek",
    description: "Kumpulkan prospek untuk bisnis atau merek Anda.",
  },
  APP_PROMOTION: {
    icon: "Smartphone",
    label: "Promosi aplikasi",
    description: "Cari orang baru untuk menginstal aplikasi Anda dan terus menggunakannya.",
  },
  SALES: {
    icon: "ShoppingCart",
    label: "Penjualan",
    description: "Cari orang yang kemungkinan akan membeli produk atau layanan Anda.",
  },
};
