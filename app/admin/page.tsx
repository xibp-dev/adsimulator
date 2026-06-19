import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import Link from "next/link";
import {
  Users, Megaphone, LayoutGrid, ImagePlay,
  ArrowRight, ArrowUpRight, CheckCircle, XCircle, Settings, BarChart3
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  const adminName = session?.user.name?.split(" ")[0] ?? "Admin";

  const [
    totalUsersRes, activeUsersRes, totalCampaignsRes, totalAdSetsRes, totalAdsRes
  ] = await Promise.all([
    supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "USER"),
    supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "USER").eq("status", "ACTIVE"),
    supabase.from("Campaign").select("*", { count: "exact", head: true }),
    supabase.from("AdSet").select("*", { count: "exact", head: true }),
    supabase.from("Ad").select("*", { count: "exact", head: true }),
  ]);

  const totalUsers = totalUsersRes.count ?? 0;
  const activeUsers = activeUsersRes.count ?? 0;
  const totalCampaigns = totalCampaignsRes.count ?? 0;
  const totalAdSets = totalAdSetsRes.count ?? 0;
  const totalAds = totalAdsRes.count ?? 0;
  const suspendedUsers = totalUsers - activeUsers;
  const activeRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const { data: recentUsersRaw } = await supabase
    .from("User")
    .select(`id, name, email, status, createdAt, adAccount:AdAccount(balance, currency, campaigns:Campaign(count))`)
    .eq("role", "USER")
    .order("createdAt", { ascending: false })
    .limit(6);

  const recentUsers = (recentUsersRaw ?? []).map((user: any) => {
    const acc = Array.isArray(user.adAccount) ? user.adAccount[0] : user.adAccount;
    const campaigns = acc?.campaigns
      ? (Array.isArray(acc.campaigns) ? (acc.campaigns[0]?.count ?? 0) : (acc.campaigns.count ?? 0))
      : 0;
    return { ...user, balance: acc?.balance ?? 0, campaigns };
  });

  const stats = [
    {
      label: "Total Pengguna", value: totalUsers, icon: Users,
      ring: "from-blue-500 to-blue-400", light: "bg-blue-50 text-blue-600",
      trend: `${activeRate}% aktif`, trendUp: true,
    },
    {
      label: "Total Kampanye", value: totalCampaigns, icon: Megaphone,
      ring: "from-violet-500 to-violet-400", light: "bg-violet-50 text-violet-600",
      trend: "Semua akun", trendUp: true,
    },
    {
      label: "Total Set Iklan", value: totalAdSets, icon: LayoutGrid,
      ring: "from-orange-500 to-orange-400", light: "bg-orange-50 text-orange-600",
      trend: "Ad Sets", trendUp: true,
    },
    {
      label: "Total Iklan", value: totalAds, icon: ImagePlay,
      ring: "from-pink-500 to-pink-400", light: "bg-pink-50 text-pink-600",
      trend: "Materi iklan", trendUp: true,
    },
  ];

  // Bar viz untuk komposisi konten
  const maxContent = Math.max(totalCampaigns, totalAdSets, totalAds, 1);
  const contentBars = [
    { label: "Kampanye", value: totalCampaigns, color: "bg-violet-500" },
    { label: "Set Iklan", value: totalAdSets, color: "bg-orange-500" },
    { label: "Iklan", value: totalAds, color: "bg-pink-500" },
  ];

  const quickActions = [
    { label: "Kelola Pengguna", desc: "Tambah, edit, tangguhkan akun", href: "/admin/users", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Monitor Konten", desc: "Pantau semua iklan", href: "/admin/monitoring", icon: BarChart3, color: "bg-violet-50 text-violet-600" },
    { label: "Pengaturan SEO", desc: "Title, deskripsi, keywords", href: "/admin/settings", icon: Settings, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1729] via-[#15233f] to-[#0866FF] p-7 lg:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0866FF] opacity-20 blur-[100px] rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500 opacity-10 blur-[100px] rounded-full" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur text-white/80 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform Aktif
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Selamat datang, {adminName} 👋
            </h1>
            <p className="text-white/50 text-sm mt-1.5 max-w-md">
              Berikut ringkasan aktivitas platform AdSimulator. Pantau pengguna dan konten dari satu tempat.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 border border-white/10">
              <p className="text-2xl font-bold text-white leading-none">{totalUsers}</p>
              <p className="text-[11px] text-white/50 mt-1">Pengguna</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 border border-white/10">
              <p className="text-2xl font-bold text-white leading-none">{totalCampaigns}</p>
              <p className="text-[11px] text-white/50 mt-1">Kampanye</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${s.light}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> {s.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#1c2b33] leading-none tracking-tight">{s.value}</p>
            <p className="text-sm text-gray-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div>
              <h2 className="text-base font-bold text-[#1c2b33]">Pengguna Terbaru</h2>
              <p className="text-xs text-gray-400 mt-0.5">{totalUsers} total · {activeUsers} aktif · {suspendedUsers} ditangguhkan</p>
            </div>
            <Link href="/admin/users" className="flex items-center gap-1 text-sm text-[#0866FF] hover:gap-2 transition-all font-semibold">
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-12">Belum ada pengguna terdaftar.</p>
            )}
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/70 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0866FF] to-[#5b9bff] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1c2b33] truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="text-center px-3 hidden sm:block">
                  <p className="text-sm font-bold text-[#1c2b33]">{user.campaigns}</p>
                  <p className="text-[10px] text-gray-400">kampanye</p>
                </div>
                <div className="text-right px-3 hidden md:block">
                  <p className="text-xs font-semibold text-gray-600">Rp {user.balance.toLocaleString("id-ID")}</p>
                  <p className="text-[10px] text-gray-400">saldo</p>
                </div>
                {user.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0">
                    <CheckCircle className="w-3 h-3" /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full flex-shrink-0">
                    <XCircle className="w-3 h-3" /> Suspend
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Content composition */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1c2b33] mb-1">Komposisi Konten</h2>
            <p className="text-xs text-gray-400 mb-5">Total konten di seluruh platform</p>
            <div className="space-y-4">
              {contentBars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">{bar.label}</span>
                    <span className="text-xs font-bold text-[#1c2b33]">{bar.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${bar.color} transition-all duration-500`}
                      style={{ width: `${Math.max((bar.value / maxContent) * 100, bar.value > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-base font-bold text-[#1c2b33]">Aksi Cepat</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {quickActions.map((a) => (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/70 group transition-colors"
                >
                  <div className={`p-2 rounded-xl ${a.color}`}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c2b33]">{a.label}</p>
                    <p className="text-xs text-gray-400">{a.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0866FF] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
