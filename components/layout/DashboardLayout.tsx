"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Megaphone, GraduationCap, Briefcase } from "lucide-react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import TraktirModal from "../ui/TraktirModal";
import DraggableTraktir from "../ui/DraggableTraktir";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  accountName: string;
  balance: number;
  currency?: string;
  logoUrl?: string;
  qrisImageUrl?: string;
  traktirEnabled?: boolean;
}

export default function DashboardLayout({ children, userName, accountName, balance, currency, logoUrl, qrisImageUrl = "", traktirEnabled = false }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTraktirOpen, setIsTraktirOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/hub", label: "Beranda", icon: LayoutGrid },
    { href: "/dashboard/ads-manager", label: "Kampanye", icon: Megaphone },
    { href: "/dashboard/kelas", label: "Belajar", icon: GraduationCap },
    { href: "/dashboard/business-settings", label: "Bisnis", icon: Briefcase },
  ];

  const isTabActive = (href: string) => {
    if (href === "/dashboard/hub") {
      return pathname === "/dashboard/hub" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5] overflow-hidden relative">
      <TopBar
        userName={userName}
        accountName={accountName}
        balance={balance}
        currency={currency}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        logoUrl={logoUrl}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-full">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative h-full w-fit">
              <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {/* Simulator disclaimer bar */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-700 text-center">
            Simulator AdSimulator — Bukan iklan asli, tidak ada biaya nyata. Tools edukasi independen, bukan produk resmi Meta.
          </div>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Meta Ads App Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[#dddfe2] bg-white h-16 flex items-center justify-around px-2 pb-safe z-30 shadow-md">
        {navItems.map((item) => {
          const active = isTabActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors"
            >
              <Icon className={cn("w-5 h-5 mb-0.5 transition-transform", active ? "text-[#0866FF] scale-110" : "text-gray-500")} />
              <span className={cn("text-[9px] font-bold tracking-wide", active ? "text-[#0866FF]" : "text-gray-500")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Floating Traktir Badge + Modal — hanya bila fitur diaktifkan admin */}
      {traktirEnabled && (
        <>
          <DraggableTraktir onClick={() => setIsTraktirOpen(true)} />
          <TraktirModal
            isOpen={isTraktirOpen}
            onClose={() => setIsTraktirOpen(false)}
            qrisImageUrl={qrisImageUrl}
          />
        </>
      )}
    </div>
  );
}
