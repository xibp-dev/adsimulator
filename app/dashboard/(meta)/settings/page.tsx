import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SecurityForm from "./SecurityForm";
import LogoutButton from "./LogoutButton";
import { KeyRound, UserCircle, ArrowRight, ShieldAlert } from "lucide-react";

export const metadata = { title: "Pengaturan Akun" };

export default async function UserSettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Pengaturan Akun</h1>
        <p className="text-sm text-gray-400 mt-0.5">Keamanan dan preferensi akun kamu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change password */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
            <div className="p-1.5 rounded-lg bg-[#e7f0ff]">
              <KeyRound className="w-4 h-4 text-[#0866FF]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c2b33]">Ubah Kata Sandi</h3>
              <p className="text-xs text-gray-400">Gunakan kata sandi yang kuat dan unik.</p>
            </div>
          </div>
          <div className="p-6">
            <SecurityForm />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Link to profile */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#0866FF]/40 hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1c2b33]">Profil Saya</p>
              <p className="text-xs text-gray-400">Edit nama & email</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0866FF] group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Session / danger */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-bold text-[#1c2b33]">Sesi</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Keluar dari akun di perangkat ini. Kamu perlu masuk lagi untuk mengakses dashboard.
            </p>
            <LogoutButton />
          </div>

          {/* Info simulasi */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-amber-800">Mode simulasi</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Akun ini untuk edukasi. Tidak terhubung ke Meta asli dan tidak ada biaya nyata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
