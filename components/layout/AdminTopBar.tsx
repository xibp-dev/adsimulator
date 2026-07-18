"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, ChevronDown, LogOut, User, Search, Menu } from "lucide-react";

export default function AdminTopBar({ userName, onToggleSidebar }: { userName: string; onToggleSidebar?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 md:px-6 lg:px-8 gap-4 sticky top-0 z-30">
      {/* Mobile sidebar toggle button */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pengguna, kampanye..."
          className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none flex-1"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#0866FF] to-[#5b9bff] rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-[#1c2b33] leading-tight">{userName}</p>
              <p className="text-[11px] text-gray-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-semibold text-[#1c2b33] truncate">{userName}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1c2b33] hover:bg-gray-50 transition-colors mt-1">
                  <User className="w-4 h-4 text-gray-400" /> Profil
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
