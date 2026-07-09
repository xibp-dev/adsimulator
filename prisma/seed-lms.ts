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

interface LessonSeed {
  section: string;
  title: string;
  description: string;
  durationMin: number;
  content: string;
  isPreview?: boolean;
}
interface CourseSeed {
  slug: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnailEmoji: string;
  accent: string;
  isFree: boolean;
  lessons: LessonSeed[];
}

const p = (...paras: string[]) => paras.join("\n\n");

const COURSES: CourseSeed[] = [
  {
    slug: "dasar-meta-ads-pemula",
    title: "Dasar-Dasar Meta Ads untuk Pemula",
    description: "Kenali cara kerja iklan Facebook & Instagram dari nol: struktur akun, istilah penting, hingga menyalakan iklan pertama.",
    level: "Pemula", category: "Fondasi", thumbnailEmoji: "📚", accent: "blue", isFree: true,
    lessons: [
      { section: "Pengenalan", title: "Apa itu Meta Ads & kenapa penting", description: "Gambaran besar ekosistem iklan Meta.", durationMin: 8, isPreview: true,
        content: p("Meta Ads adalah sistem periklanan milik Meta (Facebook, Instagram, Messenger, dan Audience Network). Lebih dari 2 miliar orang aktif setiap hari — pasar yang sangat besar untuk bisnis apa pun.", "Di kelas ini kamu akan belajar cara memanfaatkan platform tersebut secara terstruktur, bukan asal boost post. Tujuannya: iklan yang terukur, hemat biaya, dan menghasilkan penjualan.") },
      { section: "Pengenalan", title: "Struktur akun: Campaign, Ad Set, Ad", description: "3 lapis hierarki yang wajib dipahami.", durationMin: 10,
        content: p("Setiap iklan Meta punya 3 tingkat: Campaign (tujuan), Ad Set (audiens, budget, jadwal, penempatan), dan Ad (materi/kreatif).", "Analogi: Campaign = tujuan perjalanan, Ad Set = kendaraan & rute, Ad = wajah yang dilihat penumpang. Menguasai struktur ini membuat pengelolaan iklan jauh lebih rapi.") },
      { section: "Praktik", title: "Menyalakan iklan pertama di simulator", description: "Langkah demi langkah lewat Ads Manager simulator.", durationMin: 12,
        content: p("Buka menu Kampanye di AdSimulator, pilih tujuan Traffic, tentukan audiens sederhana (lokasi Indonesia, usia 18-45), set budget harian Rp50.000, lalu buat 1 materi iklan.", "Karena ini simulator, kamu bebas bereksperimen tanpa mengeluarkan uang sungguhan. Ulangi sampai paham alurnya.") },
    ],
  },
  {
    slug: "riset-audiens-targeting",
    title: "Riset Audiens & Targeting yang Tepat",
    description: "Temukan siapa pembeli idealmu dan cara menjangkaunya: minat, custom audience, lookalike, dan retargeting.",
    level: "Menengah", category: "Targeting", thumbnailEmoji: "🎯", accent: "violet", isFree: false,
    lessons: [
      { section: "Riset", title: "Menemukan pembeli ideal (buyer persona)", description: "Kerangka menyusun persona yang akurat.", durationMin: 9, isPreview: true,
        content: p("Sebelum menargetkan, kamu harus tahu SIAPA yang ditargetkan. Susun persona: usia, lokasi, pekerjaan, masalah utama, dan alasan membeli.", "Semakin jelas persona, semakin tajam targeting dan semakin murah biaya per hasil.") },
      { section: "Targeting", title: "Minat vs perilaku vs demografi", description: "Kapan memakai tiap jenis targeting.", durationMin: 11,
        content: "Detailed targeting Meta terbagi jadi minat, perilaku, dan demografi. Pelajari cara mengombinasikannya tanpa membuat audiens terlalu sempit." },
      { section: "Targeting", title: "Custom Audience & Lookalike", description: "Audiens berbasis data milikmu.", durationMin: 13,
        content: "Custom Audience dibuat dari pengunjung web, daftar pelanggan, atau interaksi IG/FB. Lookalike memperluas ke orang yang mirip pelanggan terbaikmu." },
      { section: "Targeting", title: "Strategi retargeting yang menguntungkan", description: "Menutup penjualan dari audiens hangat.", durationMin: 10,
        content: "Retargeting menyasar orang yang sudah kenal brand-mu. Biasanya CPA-nya paling murah. Pelajari urutan pesan untuk keranjang ditinggal, view content, dan add to cart." },
    ],
  },
  {
    slug: "copywriting-kreatif-menjual",
    title: "Copywriting & Kreatif Iklan yang Menjual",
    description: "Bikin audiens berhenti scroll: hook 3 detik, struktur teks yang mengonversi, dan format visual pemenang.",
    level: "Menengah", category: "Kreatif", thumbnailEmoji: "✍️", accent: "pink", isFree: false,
    lessons: [
      { section: "Copywriting", title: "Formula hook 3 detik pertama", description: "Rebut perhatian sebelum audiens scroll.", durationMin: 8, isPreview: true,
        content: "3 detik pertama menentukan iklan ditonton atau dilewati. Pelajari 7 pola hook: pertanyaan, masalah, angka, kontroversi, before-after, rahasia, dan urgensi." },
      { section: "Copywriting", title: "Struktur teks: masalah → solusi → CTA", description: "Kerangka teks utama yang mengonversi.", durationMin: 10,
        content: "Sentuh masalah audiens di kalimat pertama, tawarkan solusi (produkmu), tutup dengan satu ajakan jelas. Hindari menumpuk banyak pesan dalam satu iklan." },
      { section: "Kreatif", title: "Format visual: gambar, video, carousel", description: "Memilih format sesuai tujuan.", durationMin: 12,
        content: "Video vertikal 9:16 mendominasi Reels & Stories. Carousel bagus untuk banyak produk/fitur. Pelajari kapan tiap format paling efektif." },
      { section: "Kreatif", title: "UGC & bukti sosial yang autentik", description: "Konten ala pengguna yang dipercaya.", durationMin: 9,
        content: "Testimoni, rating, dan konten ala pengguna (UGC) terasa lebih jujur daripada iklan yang terlalu 'jadi'. Cara memproduksinya dengan budget kecil." },
    ],
  },
  {
    slug: "funnel-scaling-budget",
    title: "Strategi Funnel & Scaling Budget",
    description: "Susun funnel TOFU-MOFU-BOFU, alokasi anggaran, dan cara menaikkan budget tanpa merusak performa.",
    level: "Lanjutan", category: "Strategi", thumbnailEmoji: "🚀", accent: "emerald", isFree: false,
    lessons: [
      { section: "Funnel", title: "Memahami funnel TOFU-MOFU-BOFU", description: "Tiga tahap perjalanan pembeli.", durationMin: 11, isPreview: true,
        content: "Jangan langsung jualan ke audiens dingin. Pahami tahap kenalan (TOFU), pertimbangan (MOFU), dan siap beli (BOFU) — masing-masing butuh pesan berbeda." },
      { section: "Budget", title: "CBO vs ABO: mana yang dipakai", description: "Optimasi anggaran level campaign vs ad set.", durationMin: 10,
        content: "CBO membiarkan Meta membagi budget otomatis; ABO memberimu kontrol manual per ad set. Pelajari kapan tiap pendekatan menang." },
      { section: "Scaling", title: "Menaikkan budget tanpa merusak learning", description: "Aturan scaling bertahap.", durationMin: 12,
        content: "Naikkan budget 20-30% tiap 3-4 hari pada iklan pemenang. Hindari lonjakan drastis yang me-reset learning phase. Kenali horizontal vs vertical scaling." },
    ],
  },
  {
    slug: "optimasi-pixel-analisis",
    title: "Optimasi, Pixel & Analisis Data",
    description: "Pasang Pixel dengan benar, baca metrik yang tepat, dan ambil keputusan berbasis data — bukan tebak-tebakan.",
    level: "Lanjutan", category: "Data", thumbnailEmoji: "📊", accent: "amber", isFree: false,
    lessons: [
      { section: "Tracking", title: "Memasang & menguji Meta Pixel", description: "Fondasi pelacakan konversi.", durationMin: 10, isPreview: true,
        content: "Tanpa Pixel, algoritma buta. Pelajari cara memasang Pixel, mengatur event (ViewContent, AddToCart, Purchase), dan mengujinya." },
      { section: "Analisis", title: "Metrik yang benar-benar penting", description: "Fokus ke angka yang menghasilkan uang.", durationMin: 11,
        content: "Jangan terjebak vanity metric (like). Fokus ke CPA, ROAS, CTR, dan frequency. Pelajari ambang sehat tiap metrik." },
      { section: "Optimasi", title: "Membaca sinyal & kapan mematikan iklan", description: "Keputusan optimasi harian.", durationMin: 9,
        content: "Kenali kapan iklan layak dimatikan, di-scale, atau di-refresh materinya. Hormati learning phase sebelum menilai." },
    ],
  },
  {
    slug: "studi-kasus-omzet-100-juta",
    title: "Studi Kasus: Dari Rp0 ke Omzet 100 Juta",
    description: "Bedah lengkap kampanye nyata sebuah brand lokal: strategi, angka, materi, dan pelajaran yang bisa kamu tiru.",
    level: "Lanjutan", category: "Studi Kasus", thumbnailEmoji: "💰", accent: "indigo", isFree: false,
    lessons: [
      { section: "Studi Kasus", title: "Latar belakang & tujuan bisnis", description: "Kondisi awal brand dan target.", durationMin: 8, isPreview: true,
        content: "Sebuah brand skincare lokal memulai dengan budget Rp3 juta/bulan. Kita bedah kondisi awal, produk, margin, dan target realistisnya." },
      { section: "Studi Kasus", title: "Struktur kampanye & alokasi budget", description: "Blueprint akun yang dipakai.", durationMin: 12,
        content: "Rincian struktur campaign, ad set, dan pembagian budget TOFU/MOFU/BOFU yang menghasilkan ROAS 4-6x secara konsisten." },
      { section: "Studi Kasus", title: "Materi pemenang & iterasinya", description: "Kreatif yang menang dan kenapa.", durationMin: 11,
        content: "Analisis materi yang menang: hook, angle, dan format. Termasuk materi yang gagal dan pelajaran dari kegagalan tersebut." },
      { section: "Studi Kasus", title: "Rekap angka & pelajaran utama", description: "Ringkasan hasil dan langkah lanjutan.", durationMin: 10,
        content: "Rekap total belanja, omzet, ROAS, dan CPA. Ditutup dengan 5 pelajaran utama yang bisa langsung kamu terapkan di bisnismu." },
    ],
  },
];

async function main() {
  console.log("Seeding konten LMS...");

  // Bersihkan konten lama agar idempotent (cascade menghapus lessons)
  await supabase.from("Lesson").delete().neq("id", "");
  await supabase.from("Course").delete().neq("id", "");

  const courseRows: any[] = [];
  const lessonRows: any[] = [];

  COURSES.forEach((c, ci) => {
    const courseId = randomUUID();
    courseRows.push({
      id: courseId, slug: c.slug, title: c.title, description: c.description,
      level: c.level, category: c.category, thumbnailEmoji: c.thumbnailEmoji,
      accent: c.accent, isFree: c.isFree, sortOrder: ci, published: true,
      createdAt: new Date().toISOString(),
    });
    c.lessons.forEach((l, li) => {
      lessonRows.push({
        id: randomUUID(), courseId, section: l.section, title: l.title,
        description: l.description, videoUrl: "", durationMin: l.durationMin,
        content: l.content, isPreview: !!l.isPreview, sortOrder: li,
        createdAt: new Date().toISOString(),
      });
    });
  });

  const { error: ce } = await supabase.from("Course").insert(courseRows);
  if (ce) { console.error("Gagal insert Course:", ce); process.exit(1); }
  const { error: le } = await supabase.from("Lesson").insert(lessonRows);
  if (le) { console.error("Gagal insert Lesson:", le); process.exit(1); }

  console.log(`✅ ${courseRows.length} kelas & ${lessonRows.length} pelajaran dibuat.`);
  console.log(`   Gratis: ${courseRows.filter(c => c.isFree).length}, Premium: ${courseRows.filter(c => !c.isFree).length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
