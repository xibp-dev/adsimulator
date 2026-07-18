/**
 * ============================================================
 *  KONFIGURASI SURVEI PENGGUNA
 *  Edit file ini untuk mengubah pertanyaan & pilihan jawaban.
 * ============================================================
 */

// ── Pertanyaan 1 ─────────────────────────────────────────────
export const Q1_LABEL = "Apakah kamu sudah pernah beriklan sebelumnya?";
export const Q1_OPTIONS = [
  { value: "Pernah",       display: "✅ Ya, Pernah" },
  { value: "Belum Pernah", display: "❌ Belum Pernah" },
] as const;
export type HasAdvertised = typeof Q1_OPTIONS[number]["value"];

// ── Pertanyaan 2 ─────────────────────────────────────────────
export const Q2_LABEL = "Profesi kamu saat ini?";
export const Q2_OPTIONS = [
  "Pebisnis / Pengusaha",
  "Freelancer / Kerja Mandiri",
  "Karyawan / Pegawai",
  "Mahasiswa / Pelajar",
  "Ibu Rumah Tangga",
  "Digital Marketer",
  "Content Creator",
  "Lainnya",
];

// ── Pertanyaan 3 ─────────────────────────────────────────────
export const Q3_LABEL = "Nomor WhatsApp kamu?";
export const Q3_PLACEHOLDER = "cth: 08123456789";
export const Q3_REQUIRED = true; // set false jika ingin opsional

// ── Pertanyaan 4 ─────────────────────────────────────────────
export const Q4_LABEL = "Apakah kamu punya website?";
export const Q4_OPTIONS = [
  { value: "Punya",       display: "🌐 Punya" },
  { value: "Belum Punya", display: "❌ Belum" },
] as const;
export type HasWebsite = typeof Q4_OPTIONS[number]["value"];

// ── Pertanyaan 5 ─────────────────────────────────────────────
export const Q5_LABEL = "Akun media sosial kamu?";
export const Q5_SUBLABEL = "Instagram, TikTok, Facebook, YouTube, dll.";
export const Q5_PLACEHOLDER = "cth: @namakamu atau https://instagram.com/...";
export const Q5_REQUIRED = false; // opsional — ubah ke true jika wajib diisi
