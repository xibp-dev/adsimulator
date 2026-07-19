"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2, DollarSign, Wallet } from "lucide-react";

interface WithdrawModalProps {
  availableBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WithdrawModal({ availableBalance, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNo, setAccountNo] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10000) {
      setError("Minimal penarikan adalah Rp 10.000");
      return;
    }
    if (numAmount > availableBalance) {
      setError("Saldo tersedia tidak mencukupi");
      return;
    }
    if (!bankName.trim() || !accountName.trim() || !accountNo.trim()) {
      setError("Semua kolom rekening wajib diisi");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/affiliate/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount, bankName, accountName, accountNo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengajukan penarikan");
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1c2b33]">WD Diajukan! 🚀</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Pengajuan pencairan dana sebesar <strong>Rp {Number(amount).toLocaleString("id-ID")}</strong> berhasil dibuat. Mohon tunggu proses transfer oleh admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 px-6 py-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-indigo-500/20">
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Tarik Komisi Afiliasi</span>
          </div>
          <h2 className="text-lg font-black">Pengajuan Pencairan</h2>
          <p className="text-xs text-slate-400 mt-1">Saldo tersedia: <span className="text-emerald-400 font-bold">Rp {availableBalance.toLocaleString("id-ID")}</span></p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Jumlah */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Penarikan (Rp)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
              <input
                type="number"
                required
                min="10000"
                max={availableBalance}
                placeholder="100000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full text-sm font-bold border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 transition-all"
              />
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-400">Min. penarikan Rp 10.000</span>
              <button
                type="button"
                onClick={() => setAmount(String(availableBalance))}
                className="text-[#0866FF] font-bold hover:underline"
              >
                Tarik Semua
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Rekening Tujuan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Bank / E-Wallet</label>
            <input
              type="text"
              required
              placeholder="mis. BCA, Mandiri, Gopey, Dana"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No. Rekening / No. HP</label>
              <input
                type="text"
                required
                placeholder="1234567890"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 font-mono transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Pemilik Rekening</label>
              <input
                type="text"
                required
                placeholder="mis. Arya Saputra"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 transition-all"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all shadow-lg shadow-[#0866FF]/20 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mengajukan...</>
            ) : (
              <><DollarSign className="w-4 h-4" /> Ajukan Penarikan Dana</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
