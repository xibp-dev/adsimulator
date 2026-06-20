"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, BookOpen, Lightbulb, ShieldCheck, CheckCircle2, XCircle,
  LayoutGrid, ArrowRight, Calculator as CalcIcon, Heart, AlertTriangle,
} from "lucide-react";

type TermCategory = "Biaya" | "Performa" | "Audiens" | "Teknis";

interface Term {
  abbr: string;
  full: string;
  category: TermCategory;
  desc: string;
  formula?: string;
  tip?: string;
}

const TERMS: Term[] = [
  {
    abbr: "CPC", full: "Cost Per Click (Biaya per Klik)", category: "Biaya",
    desc: "Rata-rata biaya yang kamu bayar setiap kali seseorang mengeklik iklanmu.",
    formula: "CPC = Total belanja ÷ Jumlah klik",
    tip: "Makin rendah makin efisien. CPC tinggi bisa berarti audiens kurang tepat atau materi kurang menarik.",
  },
  {
    abbr: "CPM", full: "Cost Per Mille (Biaya per 1.000 Tayangan)", category: "Biaya",
    desc: "Biaya untuk menampilkan iklan sebanyak 1.000 kali (impresi), bukan per klik.",
    formula: "CPM = (Total belanja ÷ Impresi) × 1.000",
    tip: "Dipakai untuk tujuan brand awareness. CPM naik kalau persaingan di audiens itu ketat.",
  },
  {
    abbr: "CPA", full: "Cost Per Action / Acquisition (Biaya per Aksi)", category: "Biaya",
    desc: "Biaya rata-rata untuk satu aksi bernilai: pembelian, pendaftaran, atau lead.",
    formula: "CPA = Total belanja ÷ Jumlah konversi",
    tip: "Metrik paling penting untuk iklan penjualan. Bandingkan dengan margin keuntunganmu.",
  },
  {
    abbr: "CPR", full: "Cost Per Result (Biaya per Hasil)", category: "Biaya",
    desc: "Biaya per satu 'hasil' sesuai tujuan kampanye (klik, pesan, prospek, pembelian, dll).",
    formula: "CPR = Total belanja ÷ Jumlah hasil",
    tip: "Istilah umum di Meta — 'hasil' berubah mengikuti tujuan yang kamu pilih.",
  },
  {
    abbr: "CPL", full: "Cost Per Lead (Biaya per Prospek)", category: "Biaya",
    desc: "Biaya untuk mendapatkan satu prospek (orang yang mengisi formulir/data kontak).",
    formula: "CPL = Total belanja ÷ Jumlah prospek",
    tip: "Khas untuk tujuan Prospek (Leads). Pastikan kualitas lead, bukan cuma murah.",
  },
  {
    abbr: "CTR", full: "Click-Through Rate (Rasio Klik-Tayang)", category: "Performa",
    desc: "Persentase orang yang mengeklik setelah melihat iklanmu.",
    formula: "CTR = (Klik ÷ Impresi) × 100%",
    tip: "CTR tinggi = materi & audiens relevan. CTR rendah (<1%) sinyal materi perlu diperbaiki.",
  },
  {
    abbr: "CVR", full: "Conversion Rate (Rasio Konversi)", category: "Performa",
    desc: "Persentase pengeklik yang akhirnya melakukan aksi (beli/daftar).",
    formula: "CVR = (Konversi ÷ Klik) × 100%",
    tip: "Kalau CTR tinggi tapi CVR rendah, masalahnya di landing page atau penawaran.",
  },
  {
    abbr: "ROAS", full: "Return On Ad Spend (Laba atas Belanja Iklan)", category: "Performa",
    desc: "Berapa rupiah pendapatan yang dihasilkan dari setiap rupiah belanja iklan.",
    formula: "ROAS = Nilai konversi ÷ Total belanja",
    tip: "ROAS 3x artinya Rp1 jadi Rp3. Target ROAS sehat tergantung margin produkmu.",
  },
  {
    abbr: "Reach", full: "Jangkauan", category: "Performa",
    desc: "Jumlah orang unik yang melihat iklanmu minimal satu kali.",
    tip: "Beda dengan impresi — 1 orang bisa lihat 5x, jangkauan tetap dihitung 1.",
  },
  {
    abbr: "Impresi", full: "Impressions (Tayangan)", category: "Performa",
    desc: "Total berapa kali iklan ditampilkan, termasuk ke orang yang sama berulang.",
    formula: "Impresi = Jangkauan × Frekuensi",
  },
  {
    abbr: "Frekuensi", full: "Frequency", category: "Performa",
    desc: "Rata-rata berapa kali satu orang melihat iklanmu.",
    formula: "Frekuensi = Impresi ÷ Jangkauan",
    tip: "Frekuensi terlalu tinggi (>3-4) bikin audiens bosan (ad fatigue) dan biaya naik.",
  },
  {
    abbr: "Engagement", full: "Interaksi", category: "Performa",
    desc: "Jumlah suka, komentar, bagikan, simpan, dan klik pada iklanmu.",
    tip: "Penting untuk tujuan Interaksi, tapi belum tentu menghasilkan penjualan.",
  },
  {
    abbr: "Pixel", full: "Meta Pixel", category: "Teknis",
    desc: "Kode pelacak di website yang merekam aksi pengunjung (lihat produk, add to cart, beli).",
    tip: "Wajib dipasang sebelum iklan konversi agar algoritma Meta bisa belajar mengoptimalkan.",
  },
  {
    abbr: "Konversi", full: "Conversion", category: "Teknis",
    desc: "Aksi bernilai yang kamu inginkan dari audiens: pembelian, lead, registrasi, dll.",
    tip: "Definisikan event konversi yang jelas — itu yang dikejar algoritma Meta.",
  },
  {
    abbr: "LPV", full: "Landing Page View (Tayangan Halaman Tujuan)", category: "Performa",
    desc: "Jumlah orang yang benar-benar membuka & memuat halaman tujuan setelah klik.",
    tip: "LPV jauh lebih kecil dari klik = halaman lambat atau orang batal masuk.",
  },
  {
    abbr: "Anggaran", full: "Budget (Harian / Seumur Hidup)", category: "Teknis",
    desc: "Batas belanja iklan. Harian = per hari; seumur hidup = total selama kampanye.",
    tip: "Mulai kecil untuk menguji, baru naikkan (scale) pada iklan yang terbukti menang.",
  },
  {
    abbr: "Bid", full: "Tawaran (Bid Strategy)", category: "Teknis",
    desc: "Strategi seberapa agresif Meta 'menawar' di lelang iklan untukmu.",
    tip: "Biaya terendah (otomatis) cocok untuk pemula. Batas biaya/ROAS untuk yang sudah paham.",
  },
  {
    abbr: "CBO", full: "Campaign Budget Optimization (Advantage Campaign Budget)", category: "Teknis",
    desc: "Anggaran diatur di level kampanye; Meta otomatis membagi ke set iklan terbaik.",
    tip: "Praktis, tapi kamu kehilangan kontrol manual per set iklan.",
  },
  {
    abbr: "Lookalike", full: "Pemirsa Serupa", category: "Audiens",
    desc: "Audiens baru yang karakternya mirip dengan pelanggan/pengunjung terbaikmu.",
    tip: "Sumber audiens berkualitas (mis. pembeli) menghasilkan lookalike yang lebih bagus.",
  },
  {
    abbr: "Custom Audience", full: "Pemirsa Khusus", category: "Audiens",
    desc: "Audiens dari data milikmu: pengunjung web, daftar pelanggan, penonton video, interaksi IG/FB.",
    tip: "Dasar untuk retargeting — orang yang sudah kenal brand-mu lebih murah dikonversi.",
  },
  {
    abbr: "Retargeting", full: "Penargetan Ulang (Remarketing)", category: "Audiens",
    desc: "Menampilkan iklan ke orang yang sudah pernah berinteraksi tapi belum membeli.",
    tip: "Biasanya CPA paling murah karena audiens sudah hangat.",
  },
  {
    abbr: "Funnel", full: "Corong Pemasaran (TOFU / MOFU / BOFU)", category: "Audiens",
    desc: "Tahapan calon pembeli: Atas (kenalan) → Tengah (pertimbangan) → Bawah (siap beli).",
    tip: "Pesan & tujuan iklan harus beda di tiap tahap — jangan langsung 'beli sekarang' ke audiens dingin.",
  },
  {
    abbr: "Penempatan", full: "Placement", category: "Teknis",
    desc: "Lokasi iklan tampil: Feed, Stories, Reels, Marketplace, Audience Network, dll.",
    tip: "Penempatan otomatis (Advantage+) biasanya paling efisien untuk memulai.",
  },
  {
    abbr: "A/B Test", full: "Uji A/B (Split Test)", category: "Teknis",
    desc: "Membandingkan 2 versi (materi/audiens/penempatan) untuk tahu mana yang menang.",
    tip: "Uji satu variabel dalam satu waktu agar hasilnya valid.",
  },
];

const CATEGORY_BADGE: Record<TermCategory, string> = {
  Biaya: "bg-amber-50 text-amber-600",
  Performa: "bg-blue-50 text-blue-600",
  Audiens: "bg-violet-50 text-violet-600",
  Teknis: "bg-emerald-50 text-emerald-600",
};

const BEST_PRACTICES = [
  { title: "Tentukan tujuan dulu", desc: "Pilih objective sesuai funnel: Awareness untuk dikenal, Traffic/Engagement untuk pertimbangan, Sales/Leads untuk konversi. Tujuan menentukan cara Meta mengoptimalkan." },
  { title: "Kenali audiensmu", desc: "Riset usia, lokasi, minat, dan perilaku target. Jangan terlalu sempit (mahal) atau terlalu luas (boros). Mulai dari pelanggan ideal." },
  { title: "Pasang Pixel sebelum mulai", desc: "Tanpa Pixel, algoritma buta — tidak bisa belajar siapa yang konversi. Pasang & uji Pixel sebelum menjalankan iklan konversi." },
  { title: "Buat materi yang kuat", desc: "3 detik pertama menentukan. Visual jelas & relevan, teks utama singkat menyentuh masalah audiens, dan satu CTA tegas (mis. 'Belanja Sekarang')." },
  { title: "Mulai kecil, uji, lalu skala", desc: "Jalankan anggaran kecil dengan beberapa variasi (A/B test). Matikan yang boros, naikkan anggaran iklan yang menang secara bertahap (20-30% per langkah)." },
  { title: "Hormati learning phase", desc: "Di awal Meta sedang belajar. Jangan sering mengedit iklan aktif — tunggu ±50 konversi/3-7 hari sebelum menilai dan optimasi." },
  { title: "Pantau metrik yang tepat", desc: "Lihat CPA/CPR/ROAS untuk penjualan — bukan sekadar like (vanity metric). Sesuaikan metrik dengan tujuan kampanye." },
  { title: "Optimasi rutin", desc: "Cek performa berkala. Perhatikan frekuensi (ganti materi bila >3), refresh creative agar tidak ad fatigue, dan alokasikan ulang anggaran." },
];

const RULES_DO = [
  "Buat klaim yang jujur & bisa dibuktikan.",
  "Gunakan gambar/video berkualitas dan relevan dengan produk.",
  "Pastikan halaman tujuan sesuai isi iklan dan bisa dibuka dengan baik.",
  "Patuhi kategori iklan khusus (Kredit, Pekerjaan, Perumahan, Isu sosial/politik) yang membatasi penargetan.",
  "Cantumkan identitas bisnis yang jelas dan dapat dipercaya.",
];

const RULES_DONT = [
  "Konten dilarang: senjata, obat terlarang, tembakau/vape, produk dewasa, judi tanpa izin.",
  "Klaim kesehatan/keuangan berlebihan atau hasil 'before-after' yang menyesatkan.",
  "Menyebut atribut pribadi ('Kamu yang gemuk…', 'sebagai penderita diabetes…') — dilarang Meta.",
  "Diskriminasi usia/gender/ras, khususnya di kategori iklan khusus.",
  "Clickbait, sensasional, berita palsu, atau menjanjikan hal mustahil.",
  "Memakai merek/logo Meta atau berpura-pura jadi produk resmi Meta.",
  "Teks berlebihan menutupi gambar, atau landing page penuh popup/menjebak.",
];

type Tab = "istilah" | "cara" | "aturan" | "studi";

export default function PanduanPage() {
  const [tab, setTab] = useState<Tab>("istilah");
  const [q, setQ] = useState("");

  // Kalkulator studi kasus — prefilled dengan angka contoh yang rapi
  const [calc, setCalc] = useState({
    spend: 1_000_000,
    impressions: 100_000,
    clicks: 2_000,
    leads: 200,
    purchases: 40,
    aov: 150_000,
  });

  const div = (a: number, b: number) => (b > 0 ? a / b : 0);
  const rp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const ctr = div(calc.clicks, calc.impressions) * 100;
  const cpm = div(calc.spend, calc.impressions) * 1000;
  const cpc = div(calc.spend, calc.clicks);
  const cvrLead = div(calc.leads, calc.clicks) * 100;
  const cpl = div(calc.spend, calc.leads);
  const cvrBuy = div(calc.purchases, calc.clicks) * 100;
  const cpa = div(calc.spend, calc.purchases);
  const revenue = calc.purchases * calc.aov;
  const roas = div(revenue, calc.spend);

  const calcFields: { key: keyof typeof calc; label: string; money?: boolean }[] = [
    { key: "spend", label: "Belanja Iklan", money: true },
    { key: "impressions", label: "Impresi (Tayangan)" },
    { key: "clicks", label: "Klik" },
    { key: "leads", label: "Prospek (Lead)" },
    { key: "purchases", label: "Pembelian" },
    { key: "aov", label: "Nilai per Pembelian", money: true },
  ];

  const calcResults = [
    { abbr: "CTR", value: pct(ctr), formula: `${calc.clicks.toLocaleString("id-ID")} klik ÷ ${calc.impressions.toLocaleString("id-ID")} impresi × 100%`, color: "text-blue-600" },
    { abbr: "CPM", value: rp(cpm), formula: `${rp(calc.spend)} ÷ ${calc.impressions.toLocaleString("id-ID")} × 1.000`, color: "text-amber-600" },
    { abbr: "CPC", value: rp(cpc), formula: `${rp(calc.spend)} ÷ ${calc.clicks.toLocaleString("id-ID")} klik`, color: "text-amber-600" },
    { abbr: "CVR (Lead)", value: pct(cvrLead), formula: `${calc.leads.toLocaleString("id-ID")} lead ÷ ${calc.clicks.toLocaleString("id-ID")} klik × 100%`, color: "text-blue-600" },
    { abbr: "CPL", value: rp(cpl), formula: `${rp(calc.spend)} ÷ ${calc.leads.toLocaleString("id-ID")} lead`, color: "text-amber-600" },
    { abbr: "CVR (Beli)", value: pct(cvrBuy), formula: `${calc.purchases.toLocaleString("id-ID")} beli ÷ ${calc.clicks.toLocaleString("id-ID")} klik × 100%`, color: "text-blue-600" },
    { abbr: "CPA", value: rp(cpa), formula: `${rp(calc.spend)} ÷ ${calc.purchases.toLocaleString("id-ID")} pembelian`, color: "text-amber-600" },
    { abbr: "Pendapatan", value: rp(revenue), formula: `${calc.purchases.toLocaleString("id-ID")} × ${rp(calc.aov)}`, color: "text-emerald-600" },
    { abbr: "ROAS", value: `${roas.toFixed(2)}x`, formula: `${rp(revenue)} ÷ ${rp(calc.spend)}`, color: "text-emerald-600" },
  ];

  const filtered = TERMS.filter(
    (t) =>
      t.abbr.toLowerCase().includes(q.toLowerCase()) ||
      t.full.toLowerCase().includes(q.toLowerCase()) ||
      t.desc.toLowerCase().includes(q.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "istilah", label: "Istilah & Metrik", icon: BookOpen },
    { id: "studi", label: "Studi Kasus & Hitung", icon: CalcIcon },
    { id: "cara", label: "Cara Beriklan yang Benar", icon: Lightbulb },
    { id: "aturan", label: "Aturan & Kebijakan Meta", icon: ShieldCheck },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/hub" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
            <LayoutGrid className="w-3.5 h-3.5" /> AdSimulator
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-[#0866FF] font-semibold">Panduan</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Panduan Beriklan</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Pahami istilah, metrik, dan aturan Meta Ads — penjelasan singkat untuk pemula.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                active ? "bg-white text-[#0866FF] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB: Istilah */}
      {tab === "istilah" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari istilah… (mis. CPC, ROAS, pixel)"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((t) => (
              <div key={t.abbr} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-base font-bold text-[#1c2b33]">{t.abbr}</span>
                    <p className="text-xs text-gray-400">{t.full}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_BADGE[t.category]}`}>
                    {t.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{t.desc}</p>
                {t.formula && (
                  <div className="mt-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    <code className="text-xs text-[#0866FF] font-mono">{t.formula}</code>
                  </div>
                )}
                {t.tip && (
                  <p className="text-xs text-amber-600 mt-2.5 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{t.tip}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">Tidak ada istilah yang cocok dengan &ldquo;{q}&rdquo;.</p>
          )}
        </div>
      )}

      {/* TAB: Studi Kasus */}
      {tab === "studi" && (
        <div className="space-y-5">
          {/* Skenario */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1c2b33] mb-1">Studi Kasus: Toko Skincare Online</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Budi menjalankan iklan dengan belanja <b>Rp 1.000.000</b>. Iklannya tampil <b>100.000 kali</b> (impresi),
              diklik <b>2.000 orang</b>, menghasilkan <b>200 prospek</b>, dan <b>40 pembelian</b> dengan rata-rata
              belanja <b>Rp 150.000</b> per transaksi. Mari hitung performanya.
            </p>
          </div>

          {/* Funnel visual */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#1c2b33] mb-4">Alur Funnel (dari tayang sampai beli)</h3>
            <div className="space-y-2.5">
              {[
                { stage: "Impresi", count: "100.000", w: "100%", color: "bg-blue-500", note: "Iklan tampil 100.000 kali" },
                { stage: "Klik", count: "2.000", w: "70%", color: "bg-indigo-500", note: "CTR = 2.000 ÷ 100.000 × 100% = 2%" },
                { stage: "Prospek (Lead)", count: "200", w: "45%", color: "bg-violet-500", note: "CVR Lead = 200 ÷ 2.000 × 100% = 10%" },
                { stage: "Pembelian", count: "40", w: "25%", color: "bg-emerald-500", note: "CVR Beli = 40 ÷ 2.000 × 100% = 2%" },
              ].map((f) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <div className="w-32 flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-[#1c2b33]">{f.count}</p>
                    <p className="text-[11px] text-gray-400">{f.stage}</p>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg h-9 relative overflow-hidden">
                    <div className={`h-9 ${f.color} rounded-lg flex items-center`} style={{ width: f.w }} />
                    <span className="absolute inset-0 flex items-center px-3 text-[11px] text-gray-600">{f.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perhitungan langkah demi langkah */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#1c2b33] mb-4">Perhitungan Langkah demi Langkah</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { m: "CTR", calc: "2.000 ÷ 100.000 × 100%", res: "2%", note: "2% pelihat mengeklik — sehat (>1%)." },
                { m: "CPC", calc: "Rp 1.000.000 ÷ 2.000 klik", res: "Rp 500", note: "Biaya tiap klik." },
                { m: "CPM", calc: "Rp 1.000.000 ÷ 100.000 × 1.000", res: "Rp 10.000", note: "Biaya per 1.000 tayangan." },
                { m: "CPL", calc: "Rp 1.000.000 ÷ 200 lead", res: "Rp 5.000", note: "Biaya tiap prospek masuk." },
                { m: "CPA", calc: "Rp 1.000.000 ÷ 40 beli", res: "Rp 25.000", note: "Biaya tiap pembelian." },
                { m: "Pendapatan", calc: "40 × Rp 150.000", res: "Rp 6.000.000", note: "Total omzet dari iklan." },
                { m: "ROAS", calc: "Rp 6.000.000 ÷ Rp 1.000.000", res: "6x", note: "Rp 1 belanja → Rp 6 omzet. Bagus!" },
              ].map((r) => (
                <div key={r.m} className="border border-gray-100 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#1c2b33]">{r.m}</span>
                    <span className="text-sm font-bold text-[#0866FF]">{r.res}</span>
                  </div>
                  <code className="text-[11px] text-gray-500 font-mono block">{r.calc}</code>
                  <p className="text-[11px] text-gray-400 mt-1">{r.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kalkulator interaktif */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
              <div className="p-1.5 rounded-lg bg-[#e7f0ff]">
                <CalcIcon className="w-4 h-4 text-[#0866FF]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1c2b33]">Kalkulator Sendiri</h3>
                <p className="text-xs text-gray-400">Ubah angka di bawah — semua metrik dihitung otomatis.</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-3">
                {calcFields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                    <div className="relative">
                      {f.money && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>}
                      <input
                        type="number"
                        min={0}
                        value={calc[f.key]}
                        onChange={(e) => setCalc({ ...calc, [f.key]: Math.max(0, Number(e.target.value) || 0) })}
                        className={`w-full ${f.money ? "pl-9" : "pl-3"} pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hasil */}
              <div className="grid grid-cols-2 gap-3 content-start">
                {calcResults.map((r) => (
                  <div key={r.abbr} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    <p className="text-[11px] font-semibold text-gray-400">{r.abbr}</p>
                    <p className={`text-lg font-bold ${r.color} leading-tight`}>{r.value}</p>
                    <code className="text-[10px] text-gray-400 font-mono block mt-1 leading-tight">{r.formula}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-gradient-to-br from-[#e7f0ff] to-blue-50 border border-[#0866FF]/15 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  💡 <b>Cara baca:</b> kalau <b>ROAS &gt; 1x</b> iklan untung (omzet &gt; belanja). Untuk tahu untung bersih,
                  bandingkan <b>CPA</b> dengan margin keuntungan per produk — kalau CPA lebih kecil dari margin, kamu profit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Cara beriklan */}
      {tab === "cara" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BEST_PRACTICES.map((p, i) => (
            <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#0866FF] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1c2b33] mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
          <div className="md:col-span-2 bg-gradient-to-br from-[#e7f0ff] to-blue-50 border border-[#0866FF]/15 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1c2b33]">Siap praktik?</p>
              <p className="text-xs text-gray-500 mt-0.5">Terapkan langsung dengan membuat kampanye di Ads Manager.</p>
            </div>
            <Link href="/dashboard/ads-manager" className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors">
              Buka Ads Manager <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB: Aturan */}
      {tab === "aturan" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Do */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-emerald-50/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-700">Yang Boleh & Dianjurkan</h3>
              </div>
              <ul className="p-5 space-y-3">
                {RULES_DO.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Don't */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-red-50/50">
                <XCircle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-red-600">Yang Dilarang (Sering Bikin Ditolak)</h3>
              </div>
              <ul className="p-5 space-y-3">
                {RULES_DONT.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Iklan Donasi */}
          <div className="bg-white rounded-2xl border border-[#dddfe2] shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-rose-50/60">
              <Heart className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-rose-700">Iklan Donasi & Penggalangan Dana — Butuh Izin Khusus</h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Iklan donasi, kampanye sosial, penggalangan dana, dan advokasi di Meta masuk ke kategori <strong>Isu Sosial, Pemilu, atau Politik</strong>. Kategori ini <strong>tidak bisa langsung ditayangkan</strong> — akun iklan Anda harus diotorisasi terlebih dahulu oleh Meta.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-amber-800">Tanpa otorisasi, iklan donasi Anda akan otomatis ditolak Meta.</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Ini berlaku meskipun tujuan Anda murni sosial/kemanusiaan. Proses verifikasi membuktikan identitas pengiklan agar audiens tahu siapa yang menjalankan kampanye tersebut.
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-[#1c2b33] mb-3">Langkah Mendapatkan Otorisasi Iklan Donasi:</p>
                <ol className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Buka Meta Business Suite → Pengaturan Bisnis",
                      desc: "Masuk ke business.facebook.com. Di menu kiri, klik Pengaturan Bisnis → Pusat Keamanan.",
                    },
                    {
                      step: "2",
                      title: "Mulai proses Otorisasi Iklan Isu Sosial",
                      desc: "Klik tombol \"Mulai Verifikasi\" di bagian \"Otorisasi untuk Iklan tentang Isu Sosial, Pemilu, atau Politik\".",
                    },
                    {
                      step: "3",
                      title: "Konfirmasi negara & tujuan kampanye",
                      desc: "Pilih negara/wilayah yang akan menjadi target iklan. Untuk Indonesia, pilih Indonesia.",
                    },
                    {
                      step: "4",
                      title: "Verifikasi identitas",
                      desc: "Upload KTP/paspor untuk verifikasi personal, atau dokumen resmi organisasi (akta notaris, SK Kemenkumham) jika atas nama lembaga/yayasan.",
                    },
                    {
                      step: "5",
                      title: "Konfirmasi alamat via surat fisik (jika diminta)",
                      desc: "Meta terkadang mengirim kode verifikasi melalui surat ke alamat terdaftar. Masukkan kode tersebut dalam 30 hari.",
                    },
                    {
                      step: "6",
                      title: "Tunggu persetujuan Meta (1–5 hari kerja)",
                      desc: "Setelah disetujui, akun iklan Anda akan berlabel \"Diotorisasi\". Pilih kategori Isu Sosial saat membuat kampanye, lalu iklan siap ditayangkan.",
                    },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1c2b33]">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-blue-800">Tips tambahan untuk iklan donasi yang efektif:</p>
                <ul className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Gunakan <strong>tujuan Traffic</strong> (arahkan ke halaman donasi) atau <strong>Leads</strong> (kumpulkan data donatur potensial).</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Gunakan platform donasi terpercaya (Kitabisa, Zakat.or.id) sebagai landing page — lebih dipercaya audiens.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Sertakan <strong>nama organisasi yang jelas</strong> di iklan — Meta mewajibkan label "Dibayar oleh [nama org]" pada iklan kategori ini.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Hindari gambar yang terlalu dramatis/manipulatif — bisa kena tolak karena melanggar kebijakan konten emosional berlebihan.</span></li>
                  <li className="flex items-start gap-2"><XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" /><span><strong>Dilarang:</strong> Iklan donasi yang menjanjikan hadiah/reward sebagai imbalan donasi.</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">Catatan</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Iklan yang melanggar akan ditolak saat ditinjau (status &ldquo;Dalam tinjauan&rdquo; → &ldquo;Ditolak&rdquo;). Pelanggaran berulang bisa membatasi akun iklan.
              Ini ringkasan poin terpenting — kebijakan resmi Meta lebih lengkap dan dapat berubah sewaktu-waktu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
