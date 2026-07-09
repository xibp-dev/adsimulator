"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, Settings, ChevronLeft, Database, Sliders, Sparkles, Crown, GraduationCap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Manajemen Pengguna", icon: Users },
  { href: "/admin/kelas", label: "Kelola Kelas", icon: GraduationCap },
  { href: "/admin/sertifikasi", label: "Sertifikasi & Ujian", icon: Award },
  { href: "/admin/subscriptions", label: "Langganan LMS", icon: Crown },
  { href: "/admin/monitoring", label: "Monitor Konten", icon: BarChart3 },
  { href: "/admin/presets", label: "Preset Target & Aset", icon: Database },
  { href: "/admin/controls", label: "Kontrol Simulasi", icon: Sliders },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full bg-[#0f1729] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-9 object-contain rounded-lg" />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-[#0866FF] to-[#5b9bff] rounded-xl flex items-center justify-center shadow-lg shadow-[#0866FF]/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-white tracking-tight">AdSimulator</p>
            <p className="text-[11px] text-white/40 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Menu Utama</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#0866FF] text-white shadow-lg shadow-[#0866FF]/25"
                  : "text-white/55 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-white/45 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Ads Manager
        </Link>
      </div>
    </aside>
  );
}
