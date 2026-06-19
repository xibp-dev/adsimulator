"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  accountName: string;
  balance: number;
  currency?: string;
}

export default function DashboardLayout({ children, userName, accountName, balance, currency }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5] overflow-hidden">
      <TopBar
        userName={userName}
        accountName={accountName}
        balance={balance}
        currency={currency}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
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
    </div>
  );
}
