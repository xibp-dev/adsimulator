"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Layers, Search, Bell, ChevronDown, User, LogOut, Settings, Menu
} from "lucide-react";
import { formatCurrency } from "@/lib/simulate";

interface TopBarProps {
  userName: string;
  accountName: string;
  balance: number;
  currency?: string;
  onToggleSidebar?: () => void;
}

export default function TopBar({ userName, accountName, balance, currency = "IDR", onToggleSidebar }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-[#dddfe2] flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Sidebar toggle + Logo */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 min-w-fit">
        <div className="w-8 h-8 bg-[#0866FF] rounded-lg flex items-center justify-center">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-bold text-[#1c2b33] hidden sm:block">AdSimulator</span>
      </div>

      {/* Account info */}
      <div className="hidden md:flex items-center gap-1 ml-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-[#dddfe2] text-sm">
        <span className="text-[#1c2b33] font-medium truncate max-w-[160px]">{accountName}</span>
        <span className="text-gray-400 mx-1">·</span>
        <span className="text-[#0866FF] font-semibold whitespace-nowrap">{formatCurrency(balance, currency)}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs mx-2 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kampanye..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-[#dddfe2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-gray-100 text-sm"
          >
            <div className="w-7 h-7 bg-[#0866FF] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-[#1c2b33] font-medium max-w-[100px] truncate">{userName}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#dddfe2] rounded-xl shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-[#dddfe2]">
                <p className="text-sm font-medium text-[#1c2b33]">{userName}</p>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#1c2b33] hover:bg-gray-50"
              >
                <User className="w-4 h-4 text-gray-500" />
                Profil
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#1c2b33] hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Pengaturan
              </Link>
              <div className="border-t border-[#dddfe2] mt-1 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
