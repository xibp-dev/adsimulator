import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Metadata } from "next";
import {
  Layers,
  MonitorPlay,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  BookOpen,
  Target,
  ChevronDown,
} from "lucide-react";

// ─── Metadata SEO ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "AdSimulator — Simulator Meta Ads & Facebook Ads Gratis untuk Belajar Digital Marketing",
  description:
    "Belajar Facebook Ads, Instagram Ads, dan Meta Ads Manager secara gratis tanpa biaya nyata. AdSimulator adalah platform edukasi digital marketing terbaik di Indonesia. Latihan buat kampanye iklan, atur targeting, dan analisis metrik seperti profesional.",
  keywords: [
    "simulator meta ads",
    "belajar facebook ads gratis",
    "simulator iklan facebook",
    "latihan meta ads manager",
    "belajar iklan instagram",
    "tools edukasi digital marketing",
    "praktek iklan facebook",
    "simulasi kampanye iklan",
    "cara buat iklan facebook",
    "belajar meta ads pemula",
    "meta ads manager simulator",
    "simulasi iklan digital",
    "latihan iklan tanpa modal",
    "kursus iklan facebook gratis",
  ],
  alternates: {
    canonical: "https://adsimulator.web.id",
  },
  openGraph: {
    title: "AdSimulator — Simulator Meta Ads Gratis",
    description:
      "Latihan buat iklan Facebook & Instagram tanpa biaya nyata. Platform edukasi digital marketing #1 Indonesia.",
    url: "https://adsimulator.web.id",
    siteName: "AdSimulator",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdSimulator — Simulator Meta Ads Gratis",
    description:
      "Latihan buat iklan Facebook & Instagram tanpa biaya nyata. Platform edukasi digital marketing #1 Indonesia.",
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "AdSimulator",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      description:
        "Platform simulator Meta Ads Manager untuk belajar Facebook Ads dan Instagram Ads secara gratis. Cocok untuk pemula, digital marketer, dan trainer.",
      url: "https://adsimulator.web.id",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "120",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa itu AdSimulator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdSimulator adalah platform edukasi digital marketing yang memungkinkan kamu berlatih membuat kampanye iklan di Meta Ads Manager (Facebook & Instagram Ads) secara gratis, tanpa mengeluarkan biaya nyata.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah AdSimulator gratis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya, AdSimulator sepenuhnya gratis untuk digunakan. Kamu bisa mendaftar dan langsung mulai berlatih membuat iklan tanpa perlu kartu kredit atau biaya apapun.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah iklan yang dibuat di AdSimulator benar-benar tayang?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak. AdSimulator adalah simulator edukasi — iklan yang kamu buat tidak akan benar-benar tayang dan tidak ada biaya nyata yang dikeluarkan. Semua metrik (reach, impressions, CTR) disimulasikan oleh sistem untuk tujuan pembelajaran.",
          },
        },
        {
          "@type": "Question",
          name: "Siapa yang cocok menggunakan AdSimulator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdSimulator cocok untuk pemula yang baru belajar iklan digital, pebisnis UMKM yang ingin memahami cara kerja Meta Ads, mahasiswa digital marketing, trainer/instruktur yang mengajarkan Facebook Ads, dan siapa saja yang ingin meningkatkan skill digital marketing.",
          },
        },
        {
          "@type": "Question",
          name: "Fitur apa saja yang tersedia di AdSimulator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdSimulator menyediakan: pembuatan Campaign dengan 6 objective (Awareness, Traffic, Engagement, Leads, App Promotion, Sales), pengaturan Ad Set dengan targeting audience, placements, dan budget, pembuatan Ad dengan preview real-time seperti Facebook Feed dan Instagram Feed, serta simulasi metrik performa seperti reach, impressions, CPR, CTR, dan CPM.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah AdSimulator terhubung dengan akun Meta/Facebook saya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak. AdSimulator berdiri sendiri dan tidak terhubung dengan akun Meta, Facebook, atau Instagram manapun. Semua data tersimpan di sistem internal AdSimulator untuk keperluan edukasi.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      name: "AdSimulator",
      url: "https://adsimulator.web.id",
      description: "Platform simulator Meta Ads untuk edukasi digital marketing di Indonesia.",
    },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: MonitorPlay,
    title: "Simulator Realistis",
    desc: "Tampilan & alur persis seperti Meta Ads Manager asli — Campaign, Ad Set, hingga Ad level.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Targeting Lengkap",
    desc: "Latihan atur audience berdasarkan lokasi, usia, gender, minat, dan Advantage+ Audience.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Metrik Simulasi",
    desc: "Lihat hasil reach, impressions, CTR, CPM, dan Cost per Result yang disimulasikan secara realistis.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Edukasi Terstruktur",
    desc: "Rancang campaign dengan 6 objective seperti Awareness, Traffic, Leads, hingga Sales.",
    color: "from-orange-500 to-orange-600",
  },
];

const steps = [
  {
    num: "01",
    title: "Daftar Gratis",
    desc: "Buat akun dalam hitungan detik — tidak perlu kartu kredit.",
  },
  {
    num: "02",
    title: "Buat Kampanye",
    desc: "Pilih objective, atur ad set, dan desain iklan dengan preview real-time.",
  },
  {
    num: "03",
    title: "Analisis Hasil",
    desc: "Pantau metrik simulasi dan pelajari cara mengoptimasi kampanye iklan.",
  },
];

const faqs = [
  {
    q: "Apa itu AdSimulator?",
    a: "AdSimulator adalah platform edukasi digital marketing yang memungkinkan kamu berlatih membuat kampanye iklan di Meta Ads Manager (Facebook & Instagram Ads) secara gratis, tanpa mengeluarkan biaya nyata.",
  },
  {
    q: "Apakah AdSimulator gratis?",
    a: "Ya, sepenuhnya gratis. Daftar dan langsung mulai berlatih membuat iklan tanpa perlu kartu kredit atau biaya apapun.",
  },
  {
    q: "Apakah iklan yang dibuat benar-benar tayang?",
    a: "Tidak. AdSimulator adalah simulator edukasi — iklan tidak tayang dan tidak ada biaya nyata. Semua metrik disimulasikan oleh sistem untuk tujuan pembelajaran.",
  },
  {
    q: "Siapa yang cocok menggunakan AdSimulator?",
    a: "Pemula yang baru belajar iklan digital, pebisnis UMKM, mahasiswa digital marketing, trainer/instruktur Facebook Ads, dan siapa saja yang ingin meningkatkan skill digital marketing.",
  },
  {
    q: "Apakah terhubung dengan akun Meta/Facebook saya?",
    a: "Tidak. AdSimulator berdiri sendiri dan tidak terhubung dengan akun Meta, Facebook, atau Instagram manapun.",
  },
  {
    q: "Fitur apa saja yang tersedia?",
    a: "Pembuatan Campaign (6 objective), pengaturan Ad Set dengan targeting & placements, pembuatan Ad dengan preview real-time, serta simulasi metrik performa lengkap.",
  },
];

const stats = [
  { value: "6", label: "Objective Kampanye" },
  { value: "100%", label: "Gratis Selamanya" },
  { value: "3", label: "Level Struktur Iklan" },
  { value: "0", label: "Biaya Nyata" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const session = await auth();
  if (session) {
    if (session.user.role === "ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white text-[#1c2b33] font-sans">
        {/* ── Navbar ── */}
        <header className="sticky top-0 z-50 border-b border-[#dddfe2] bg-white/90 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0866FF] rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#1c2b33]">AdSimulator</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
              <a href="#fitur" className="hover:text-[#0866FF] transition-colors">Fitur</a>
              <a href="#cara-kerja" className="hover:text-[#0866FF] transition-colors">Cara Kerja</a>
              <a href="#faq" className="hover:text-[#0866FF] transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-[#0866FF] transition-colors font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm bg-[#0866FF] hover:bg-[#0757d4] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Daftar Gratis
              </Link>
            </div>
          </nav>
        </header>

        {/* ── Disclaimer Banner ── */}
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
          🔔 Simulator edukasi — bukan iklan asli, tidak ada biaya nyata. AdSimulator adalah tools edukasi independen, bukan produk resmi Meta.
        </div>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f9f4] pt-20 pb-24 px-6">
          {/* Background blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-100 rounded-full opacity-40 blur-3xl translate-y-1/2 pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0866FF] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3 h-3" />
              Platform Edukasi Digital Marketing #1 Indonesia
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1c2b33] leading-tight mb-6">
              Belajar{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0866FF] to-[#0ea5e9]">
                Meta Ads
              </span>{" "}
              Tanpa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Biaya Nyata
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Simulator Meta Ads Manager gratis untuk berlatih membuat kampanye iklan Facebook &
              Instagram. Kuasai digital marketing tanpa risiko budget.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 border border-[#dddfe2] hover:border-[#0866FF] text-gray-700 hover:text-[#0866FF] font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:bg-blue-50"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="mt-10 flex items-center justify-center gap-1 text-sm text-gray-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 font-medium text-gray-700">Dipercaya ratusan digital marketer</span>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="bg-[#0866FF] py-12 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-extrabold mb-1">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="fitur" className="py-24 px-6 bg-white scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c2b33] mb-4">
                Semua yang Kamu Butuhkan untuk Belajar Meta Ads
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Fitur lengkap yang meniru Meta Ads Manager asli — dari campaign hingga analitik performa.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group bg-white border border-[#dddfe2] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-[#1c2b33] mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="cara-kerja" className="py-24 px-6 bg-[#f8f9fc] scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c2b33] mb-4">
                Cara Menggunakan AdSimulator
              </h2>
              <p className="text-gray-600 text-lg">
                Mulai berlatih dalam 3 langkah mudah — tidak butuh pengalaman sebelumnya.
              </p>
            </div>
            <div className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-[#0866FF] via-purple-400 to-emerald-500 opacity-30" />
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, idx) => (
                  <div key={step.num} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0866FF] to-[#0ea5e9] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-200 mb-5">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-lg text-[#1c2b33] mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-12">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
              >
                Coba Sekarang — Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Who Is It For ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c2b33] mb-4">
                Cocok untuk Siapa?
              </h2>
              <p className="text-gray-600 text-lg">
                AdSimulator dirancang untuk siapapun yang ingin menguasai iklan digital.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: "🎓", title: "Pemula Digital Marketing", desc: "Baru mulai belajar iklan online? Mulai dari sini tanpa takut salah." },
                { icon: "🏪", title: "Pebisnis UMKM", desc: "Pahami cara kerja Meta Ads sebelum benar-benar pasang iklan berbayar." },
                { icon: "📚", title: "Mahasiswa & Pelajar", desc: "Latihan praktek untuk tugas kuliah atau persiapan karir digital marketing." },
                { icon: "🎤", title: "Trainer & Instruktur", desc: "Gunakan AdSimulator sebagai media ajar di kelas digital marketing." },
                { icon: "💼", title: "Marketing Executive", desc: "Tes strategi campaign baru tanpa risiko membakar budget klien." },
                { icon: "🚀", title: "Freelancer & Agency", desc: "Tingkatkan skill tim dan demonstrasikan kemampuan kepada klien." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 rounded-xl border border-[#dddfe2] hover:border-[#0866FF] hover:bg-blue-50/30 transition-all group"
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#1c2b33] mb-1 group-hover:text-[#0866FF] transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 px-6 bg-[#f8f9fc] scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c2b33] mb-4">
                Pertanyaan yang Sering Ditanyakan
              </h2>
              <p className="text-gray-600 text-lg">Semua yang perlu kamu tahu tentang AdSimulator.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-[#dddfe2] rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#1c2b33] hover:text-[#0866FF] transition-colors list-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-[#dddfe2] pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 px-6 bg-gradient-to-br from-[#0866FF] to-[#0353cc] text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Mulai Belajar Meta Ads Sekarang
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
              Daftar gratis dan langsung praktik membuat kampanye iklan pertamamu — tanpa risiko, tanpa biaya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-white hover:bg-blue-50 text-[#0866FF] font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 border border-white/40 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:bg-white/10"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              {["✓ Gratis selamanya", "✓ Tidak perlu kartu kredit", "✓ Tidak terhubung Meta", "✓ Data aman"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#1c2b33] text-gray-400 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0866FF] rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">AdSimulator</span>
              <span>— Simulator edukasi, bukan produk resmi Meta.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
              <Link href="/register" className="hover:text-white transition-colors">Daftar</Link>
              <span>
                &copy; {new Date().getFullYear()}{" "}
                <a
                  href="https://mbp.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Muhamad Bilal Pangestu
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
