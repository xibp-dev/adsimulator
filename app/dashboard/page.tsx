import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const firstName = session.user.name?.split(" ")[0] ?? "User";

  const labs = [
    {
      id: "metalab",
      name: "MetaLab",
      tagline: "Facebook & Instagram Ads Simulator",
      description:
        "Simulasikan ekosistem iklan Meta secara lengkap: Business Portfolio, Fanspage, Pixel, hingga Ads Manager dengan kampanye nyata.",
      href: "/dashboard/hub",
      available: true,
      topGradient: "from-[#0866FF] via-[#1877F2] to-[#0a52cc]",
      accentColor: "#0866FF",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      features: ["Campaign Manager", "Ads Manager", "Pixel & Analytics", "Business Portfolio"],
      badge: "Tersedia",
      badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    {
      id: "tiktoklab",
      name: "TikTokLab",
      tagline: "TikTok Ads Simulator",
      description:
        "Pelajari ekosistem TikTok for Business: TikTok Ads Manager, Spark Ads, dan strategi kampanye video untuk Gen-Z audience.",
      href: "#",
      available: false,
      topGradient: "from-gray-300 via-gray-200 to-gray-300",
      accentColor: "#fe2c55",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.76a4.85 4.85 0 01-1.02-.07z" />
        </svg>
      ),
      features: ["TikTok Ads Manager", "Spark Ads", "Video Campaign", "Creator Marketplace"],
      badge: "Coming Soon",
      badgeClass: "bg-gray-100 text-gray-400 border border-gray-200",
    },
    {
      id: "googlelab",
      name: "GoogleLab",
      tagline: "Google Ads Simulator",
      description:
        "Kuasai Google Ads dari Search, Display, YouTube Ads hingga Smart Campaign dengan sistem bidding dan Quality Score yang realistis.",
      href: "#",
      available: false,
      topGradient: "from-gray-300 via-gray-200 to-gray-300",
      accentColor: "#4285F4",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
      features: ["Search Ads", "Display Network", "YouTube Ads", "Smart Campaign"],
      badge: "Coming Soon",
      badgeClass: "bg-gray-100 text-gray-400 border border-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top header bar */}
      <div className="border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0866FF] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">AdSimulator</span>
          <span className="text-gray-300 text-sm">·</span>
          <span className="text-gray-400 text-xs">Platform Simulator Iklan Digital</span>
        </div>
        <span className="text-xs text-gray-400">
          Halo, <span className="font-semibold text-gray-600">{firstName}</span>
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Pilih platform yang ingin kamu pelajari
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            Belajar iklan digital dengan pengalaman nyata. Tidak ada budget asli yang terpakai.
          </p>
        </div>

        {/* Lab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {labs.map((lab) => (
            <div
              key={lab.id}
              className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 ${
                lab.available
                  ? "bg-white border-gray-200 hover:border-[#0866FF]/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0866FF]/8 cursor-pointer"
                  : "bg-gray-50 border-gray-100 opacity-60"
              }`}
            >
              {/* Top color stripe */}
              <div className={`h-1 w-full bg-gradient-to-r ${lab.topGradient}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: `${lab.accentColor}12`, color: lab.accentColor }}
                  >
                    {lab.icon}
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${lab.badgeClass}`}>
                    {lab.badge}
                  </span>
                </div>

                {/* Name + Tagline */}
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">{lab.name}</h2>
                <p className="text-xs font-medium mb-3" style={{ color: lab.accentColor }}>
                  {lab.tagline}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{lab.description}</p>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {lab.features.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {lab.available ? (
                  <Link
                    href={lab.href}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 group/btn hover:opacity-90"
                    style={{ background: lab.accentColor }}
                  >
                    <Zap className="w-4 h-4" />
                    Masuk ke {lab.name}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                    <Lock className="w-4 h-4" />
                    Segera Hadir
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-400 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            1 Platform Aktif
          </div>
          <span className="hidden sm:block">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            2 Platform Coming Soon
          </div>
          <span className="hidden sm:block">·</span>
          <span>Mode Edukasi & Simulasi — Tidak ada budget nyata</span>
        </div>
      </div>
    </div>
  );
}
