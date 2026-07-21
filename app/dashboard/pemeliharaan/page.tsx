import Link from "next/link";
import { Wrench, ArrowLeft, Clock, Bell } from "lucide-react";

export const metadata = {
  title: "Sedang Pemeliharaan",
  description: "Fitur Premium sedang dalam pemeliharaan. Silakan cek kembali dalam beberapa saat.",
};

export default function PemeliharaanPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/40">

      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 text-center">

        {/* Animated icon */}
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-400/40 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-white" style={{ animation: "wiggle 2s ease-in-out infinite" }} />
            {/* pulse ring */}
            <div className="absolute inset-0 rounded-3xl bg-amber-400/30 animate-ping" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sedang Pemeliharaan
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Fitur <span className="font-semibold text-amber-600">Kelas, Webinar & Sertifikasi</span> sedang dalam
            pemeliharaan untuk pengalaman belajar yang lebih baik.
          </p>
          <p className="text-sm text-slate-400">
            Silakan cek kembali dalam beberapa saat. Kami mohon maaf atas ketidaknyamanannya.
          </p>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <p className="text-sm font-semibold text-slate-700 text-left">Status: Sedang dalam pemeliharaan</p>
          </div>
          <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700">Estimasi selesai</p>
              <p className="text-xs text-slate-400 mt-0.5">Tim kami sedang bekerja secepatnya. Durasi pemeliharaan biasanya singkat.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-[#0866FF]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700">Simulator iklan tetap berjalan</p>
              <p className="text-xs text-slate-400 mt-0.5">Fitur simulator, kampanye, dan ads manager bisa kamu gunakan seperti biasa.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0866FF] px-5 py-2.5 rounded-xl border border-gray-200 hover:border-[#0866FF]/30 bg-white hover:bg-[#f5f8ff] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <Link
            href="/dashboard/ads-manager"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#0866FF] hover:bg-[#0757d4] px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#0866FF]/20"
          >
            Buka Simulator Iklan
          </Link>
        </div>
      </div>

      {/* Wiggle keyframes injected via style tag */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
      `}</style>
    </div>
  );
}
