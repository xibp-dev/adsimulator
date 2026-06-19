import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/simulate";
import ProfileForm from "./ProfileForm";
import { ShieldCheck, Wallet, Calendar, Clock, UserCog, ArrowRight } from "lucide-react";

export const metadata = { title: "Profil Saya" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [{ data: user }, { data: adAccount }] = await Promise.all([
    supabase.from("User").select("*").eq("id", session.user.id).single(),
    supabase.from("AdAccount").select("*").eq("userId", session.user.id).single(),
  ]);

  const name = user?.name ?? session.user.name ?? "Pengguna";
  const email = user?.email ?? session.user.email ?? "";
  const isAdmin = user?.role === "ADMIN";

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  const accountRows = [
    { icon: Wallet, label: "Saldo iklan", value: formatCurrency(adAccount?.balance ?? 0, adAccount?.currency ?? "IDR") },
    { icon: Calendar, label: "Bergabung sejak", value: fmtDate(user?.createdAt) },
    { icon: Clock, label: "Login terakhir", value: fmtDate(user?.lastLoginAt) },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Profil Saya</h1>
        <p className="text-sm text-gray-400 mt-0.5">Kelola informasi akun dan identitas kamu.</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0866FF] to-[#5b9bff] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#1c2b33] truncate">{name}</h2>
            <p className="text-sm text-gray-400 truncate">{email}</p>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${
              isAdmin ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
            }`}>
              <ShieldCheck className="w-3 h-3" /> {isAdmin ? "Administrator" : "Pengguna"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-base font-bold text-[#1c2b33]">Informasi Pribadi</h3>
            <p className="text-xs text-gray-400">Perbarui nama dan email akunmu.</p>
          </div>
          <div className="p-6">
            <ProfileForm name={name} email={email} />
          </div>
        </div>

        {/* Account info + link to settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-sm font-bold text-[#1c2b33]">Info Akun</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {accountRows.map((r) => (
                <div key={r.label} className="flex items-center gap-3 px-5 py-3.5">
                  <r.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{r.label}</p>
                    <p className="text-sm font-semibold text-[#1c2b33] truncate">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#0866FF]/40 hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCog className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1c2b33]">Keamanan & Pengaturan</p>
              <p className="text-xs text-gray-400">Ganti kata sandi & preferensi</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0866FF] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
