"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, AlertCircle, Loader2, ArrowRight, Search, Award, CheckCircle2, Calendar, FileText, User, Video
} from "lucide-react";

interface CertResult {
  valid: boolean;
  recipient: string;
  type: string;
  title: string;
  speaker: string;
  score: number;
  certNumber: string;
  dateIssued: string;
}

export default function PublicVerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<CertResult | null>(null);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const input = certNumber.trim();
    if (!input) {
      setError("Masukkan nomor sertifikat terlebih dahulu.");
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/verify-certificate?certNumber=${encodeURIComponent(input)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error ?? "Sertifikat tidak ditemukan.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1729] text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-[#0866FF]/10 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[65%] aspect-square rounded-full bg-emerald-500/5 filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/80">Kembali ke Beranda</span>
          </Link>
          
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Verifikasi Sertifikat Resmi
            </h1>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              Periksa keaslian sertifikat kelulusan kelas dan webinar AdSimulator Academy.
            </p>
          </div>
        </div>

        {/* Search Panel */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          <form onSubmit={handleVerify} className="space-y-3">
            <label htmlFor="certNumber" className="block text-xs font-bold text-white/60 uppercase tracking-widest">
              Nomor Sertifikat / Lisensi
            </label>
            <div className="relative">
              <input
                id="certNumber"
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="mis. CERT-WEB-XXXX-XXXX-XXXX"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#0866FF] focus:bg-white/10 transition-all font-mono uppercase font-bold"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-3 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-[#0866FF]/20"
            >
              {searching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Verifikasi Sekarang
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs text-red-400">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-red-500" />
              <div className="space-y-0.5">
                <p className="font-bold">Verifikasi Gagal</p>
                <p className="text-white/70 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Success Validation Result */}
          {result && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="h-px bg-white/10" />

              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">Verifikasi Berhasil</h4>
                  <p className="text-[11px] text-white/60">Sertifikat ini valid dan terdaftar secara resmi.</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-white/40 block">Nama Penerima</span>
                    <span className="font-bold text-sm text-white flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#0866FF]" /> {result.recipient}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-white/40 block">Tipe Sertifikat</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> {result.type}
                    </span>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-white/40 block">Topik / Judul Kelulusan</span>
                    <span className="font-extrabold text-white text-sm flex items-start gap-1">
                      <Video className="w-4 h-4 text-[#0866FF] mt-0.5 flex-shrink-0" /> {result.title}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 block">Penyelenggara / Pemateri</span>
                    <span className="font-medium text-white/90">{result.speaker}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 block">Tanggal Terbit</span>
                    <span className="font-medium text-white/90 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {result.dateIssued}
                    </span>
                  </div>

                  <div className="col-span-2 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between mt-1">
                    <span className="text-[10px] text-white/40 font-mono tracking-wider">{result.certNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                      Skor Ujian: {result.score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-white/30 tracking-wider">
          &copy; {new Date().getFullYear()} AdSimulator Academy. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
