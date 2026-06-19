import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Briefcase, 
  Flag, 
  Cpu, 
  CreditCard, 
  Megaphone,
  ArrowRight,
  BookOpen,
  LayoutGrid
} from "lucide-react";

export default async function DashboardHubPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Fetch current stats/state for the user to display progress — paralel, bukan berurutan
  const [
    { data: adAccount },
    { count: portfoliosCount },
    { count: pagesCount },
    { count: pixelsCount },
  ] = await Promise.all([
    supabase.from("AdAccount").select("*, campaigns:Campaign(count)").eq("userId", session.user.id).single(),
    supabase.from("BusinessPortfolio").select("*", { count: "exact", head: true }).eq("userId", session.user.id),
    supabase.from("Fanspage").select("*", { count: "exact", head: true }).eq("userId", session.user.id),
    supabase.from("Pixel").select("*", { count: "exact", head: true }).eq("userId", session.user.id),
  ]);

  // Parse campaigns count safely
  const campaignsCount = adAccount?.campaigns && Array.isArray(adAccount.campaigns) && adAccount.campaigns.length > 0 
    ? adAccount.campaigns[0].count 
    : 0;

  const cards = [
    {
      title: "1. Pengaturan Bisnis",
      description: "Buat dan atur wadah utama bisnis Anda (Meta Business Suite / Business Manager) untuk mengelompokkan aset secara terorganisir.",
      href: "/dashboard/business-settings",
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      statusText: (portfoliosCount ?? 0) > 0 ? `${portfoliosCount} Portofolio Dibuat` : "Belum Setup",
      completed: (portfoliosCount ?? 0) > 0,
    },
    {
      title: "2. Halaman Fanspage",
      description: "Buat Halaman Facebook sebagai identitas resmi bisnis Anda. Iklan di Meta wajib dijalankan atas nama sebuah Fanspage.",
      href: "/dashboard/pages",
      icon: Flag,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      statusText: (pagesCount ?? 0) > 0 ? `${pagesCount} Fanspage Dibuat` : "Belum Setup",
      completed: (pagesCount ?? 0) > 0,
    },
    {
      title: "3. Sumberdaya & Pixel",
      description: "Setup Meta Pixel tracker untuk merekam aksi pengunjung website Anda dan mengoptimalkan kampanye konversi.",
      href: "/dashboard/pixels",
      icon: Cpu,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      statusText: (pixelsCount ?? 0) > 0 ? `${pixelsCount} Pixel Dibuat` : "Belum Setup",
      completed: (pixelsCount ?? 0) > 0,
    },
    {
      title: "4. Setup Pembayaran & Top Up",
      description: "Simulasikan setup metode pembayaran dan top up saldo iklan virtual Anda agar campaign iklan bisa aktif dijalankan.",
      href: "/dashboard/billing",
      icon: CreditCard,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      statusText: adAccount ? `Saldo: Rp ${(adAccount.balance).toLocaleString("id-ID")}` : "Belum Setup",
      completed: (adAccount?.balance ?? 0) > 0,
    },
    {
      title: "5. Dashboard Iklan (Ads Manager)",
      description: "Simulator pembuatan campaign, ad set, dan materi iklan. Rancang targeting audiens dan lihat proyeksi performanya.",
      href: "/dashboard/ads-manager",
      icon: Megaphone,
      color: "bg-[#e7f0ff] text-[#0866FF] border-[#dddfe2]",
      statusText: adAccount ? `${campaignsCount} Iklan Dibuat` : "0 Iklan",
      completed: campaignsCount > 0,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
                <LayoutGrid className="w-3.5 h-3.5" />
                Portal Lab
              </Link>
              <span className="text-gray-300 text-xs">/</span>
              <span className="text-xs text-[#0866FF] font-semibold">AdSimulator</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1c2b33]">
              AdSimulator — Simulator Facebook & Instagram Ads
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl">
              Ikuti 4 langkah persiapan berikut sebelum menjalankan iklan pertama kamu di <strong className="font-bold text-gray-800">Ads Manager</strong>. Setiap langkah mensimulasikan setup bisnis Meta yang sesungguhnya.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-[#0866FF] px-3 py-1.5 rounded-lg text-xs font-semibold self-start md:self-center border border-blue-100">
            <BookOpen className="w-4 h-4" />
            Mode Edukasi & Simulasi
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group bg-white border border-[#dddfe2] hover:border-gray-400 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg border ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    card.completed 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-gray-50 text-gray-500 border border-gray-100"
                  }`}>
                    {card.statusText}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-[#1c2b33] group-hover:text-[#0866FF] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[#0866FF] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>Setup Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Guide/Info Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#1c2b33] mb-3 flex items-center gap-2">
          💡 Mengapa Harus Melalui Langkah Ini?
        </h3>
        <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside">
          <li><strong>Meta Business Suite / Portfolio</strong> diperlukan untuk memanajemen hak akses tim dan aset di dalam satu atap perusahaan.</li>
          <li><strong>Fanspage</strong> diperlukan sebagai entitas pengirim iklan. Anda tidak bisa beriklan menggunakan akun personal Facebook biasa.</li>
          <li><strong>Pixel & Event Dataset</strong> melacak aktivitas website (leads, purchase, add to cart) agar algoritma Meta bisa menargetkan audiens secara efisien.</li>
          <li><strong>Top Up Saldo</strong> menyimulasikan sistem pembayaran prabayar (prepaid) atau pascabayar (postpaid) sebelum iklan dideploy.</li>
        </ul>
      </div>
    </div>
  );
}
