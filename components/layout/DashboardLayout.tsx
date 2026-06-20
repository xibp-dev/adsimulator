"use client";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { Coffee } from "lucide-react";
import TraktirModal from "../ui/TraktirModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  accountName: string;
  balance: number;
  currency?: string;
  logoUrl?: string;
}

export default function DashboardLayout({ children, userName, accountName, balance, currency, logoUrl }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTraktirOpen, setIsTraktirOpen] = useState(false);
  const [qrisImageUrl, setQrisImageUrl] = useState("");

  useEffect(() => {
    fetch("/api/qris/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.qrisImageUrl) {
          setQrisImageUrl(data.qrisImageUrl);
        }
      })
      .catch(() => {});
  }, []);

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
            <div className="relative h-full">
              <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Simulator disclaimer bar */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-700 text-center">
            Simulator AdSimulator — Bukan iklan asli, tidak ada biaya nyata. Tools edukasi independen, bukan produk resmi Meta.
          </div>
          {children}
        </main>
      </div>

      {/* Floating Sticky Traktir Badge (Middle Right) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsTraktirOpen(true)}
          className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white px-4 py-3 rounded-l-2xl shadow-xl hover:-translate-x-1.5 transition-all duration-200 font-semibold text-xs tracking-wide cursor-pointer"
          style={{ boxShadow: "0 10px 25px -5px rgba(8, 102, 255, 0.4)" }}
        >
          <Coffee className="w-4 h-4 fill-white/10 animate-bounce" />
          <span className="writing-mode-vertical">Traktir Kopi ☕</span>
        </button>
      </div>

      {/* Traktir Modal Component */}
      <TraktirModal
        isOpen={isTraktirOpen}
        onClose={() => setIsTraktirOpen(false)}
        qrisImageUrl={qrisImageUrl}
      />
    </div>
  );
}
