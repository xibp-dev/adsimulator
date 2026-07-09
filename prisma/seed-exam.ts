import * as fs from "fs";
import * as path from "path";

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
const ws = require("ws");
(globalThis as any).WebSocket = (globalThis as any).WebSocket || ws;
const { randomUUID } = require("crypto");

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Bank soal Meta Ads (pilihan pertama = jawaban benar; nanti diacak posisinya)
const BANK: { q: string; correct: string; wrong: string[] }[] = [
  { q: "Apa kepanjangan dari CTR?", correct: "Click-Through Rate (rasio klik-tayang)", wrong: ["Cost To Reach", "Click Total Ratio", "Conversion Tracking Rate"] },
  { q: "Metrik ROAS mengukur apa?", correct: "Pendapatan yang dihasilkan per rupiah belanja iklan", wrong: ["Jumlah klik per hari", "Biaya rata-rata per tayangan", "Persentase orang yang mengeklik"] },
  { q: "CPM adalah biaya per...", correct: "1.000 tayangan (impresi)", wrong: ["1 klik", "1 konversi", "1.000 klik"] },
  { q: "Urutan struktur akun Meta Ads dari paling atas adalah?", correct: "Campaign → Ad Set → Ad", wrong: ["Ad → Ad Set → Campaign", "Ad Set → Campaign → Ad", "Campaign → Ad → Ad Set"] },
  { q: "Apa fungsi utama Meta Pixel?", correct: "Melacak aksi pengunjung di website untuk optimasi & retargeting", wrong: ["Mempercantik tampilan iklan", "Menambah saldo iklan otomatis", "Membuat halaman fanspage"] },
  { q: "Audiens Lookalike dibuat berdasarkan apa?", correct: "Kemiripan dengan sumber audiens terbaik (mis. pembeli)", wrong: ["Lokasi acak di seluruh dunia", "Orang yang belum pernah pakai internet", "Daftar nomor telepon publik"] },
  { q: "Retargeting menargetkan siapa?", correct: "Orang yang sudah pernah berinteraksi dengan brand", wrong: ["Orang yang belum pernah tahu brand", "Hanya karyawan perusahaan", "Akun bot otomatis"] },
  { q: "Pada tahap funnel TOFU, tujuan utamanya adalah?", correct: "Dikenal & menjangkau audiens baru (awareness)", wrong: ["Menutup penjualan sebanyak mungkin", "Menagih pembayaran", "Menghapus audiens lama"] },
  { q: "Frekuensi iklan yang terlalu tinggi biasanya menyebabkan?", correct: "Ad fatigue (audiens jenuh) dan biaya naik", wrong: ["Iklan otomatis gratis", "Jangkauan tak terbatas", "Konversi selalu meningkat"] },
  { q: "CBO (Campaign Budget Optimization) mengatur anggaran di level?", correct: "Kampanye (campaign)", wrong: ["Ad Set", "Iklan (ad)", "Akun pengguna"] },
  { q: "Metrik CPA mengukur?", correct: "Biaya rata-rata untuk satu aksi/konversi", wrong: ["Jumlah total tayangan", "Rasio klik terhadap tayangan", "Saldo tersisa di akun"] },
  { q: "Placement 'Reels' paling cocok untuk format?", correct: "Video vertikal 9:16", wrong: ["Dokumen PDF", "Gambar horizontal 16:9 saja", "Teks tanpa gambar"] },
];

const QUESTIONS_PER_COURSE = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

async function main() {
  console.log("Seeding soal ujian...");
  const { data: courses, error } = await supabase.from("Course").select("id, title");
  if (error) { console.error("Gagal ambil Course:", error.message); process.exit(1); }
  if (!courses || courses.length === 0) { console.log("Tidak ada kelas. Seed kelas dulu."); return; }

  // Bersihkan soal lama (idempotent)
  await supabase.from("ExamQuestion").delete().neq("id", "");

  const rows: any[] = [];
  for (const c of courses) {
    const picked = shuffle(BANK).slice(0, QUESTIONS_PER_COURSE);
    picked.forEach((item, i) => {
      // Susun 4 pilihan lalu acak posisi jawaban benar
      const opts = shuffle([item.correct, ...item.wrong.slice(0, 3)]);
      const correctIndex = opts.indexOf(item.correct);
      rows.push({
        id: randomUUID(),
        courseId: c.id,
        question: item.q,
        options: JSON.stringify(opts),
        correctIndex,
        sortOrder: i,
        createdAt: new Date().toISOString(),
      });
    });
  }

  const { error: insErr } = await supabase.from("ExamQuestion").insert(rows);
  if (insErr) { console.error("Gagal insert soal:", insErr.message); process.exit(1); }

  console.log(`✅ ${rows.length} soal dibuat untuk ${courses.length} kelas (${QUESTIONS_PER_COURSE} soal/kelas).`);
  console.log("   Nilai lulus: > 85 (perlu 8/8 = 100, atau 7/8 = 88).");
}

main().catch((e) => { console.error(e); process.exit(1); });
