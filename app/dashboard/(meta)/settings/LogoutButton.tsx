"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
    >
      <LogOut className="w-4 h-4" /> Keluar dari Akun
    </button>
  );
}
