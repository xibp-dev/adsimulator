"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Coffee,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
} from "lucide-react";

const PRESETS = [
  { label: "Rp 5.000", value: 5000 },
  { label: "Rp 10.000", value: 10000 },
  { label: "Rp 20.000", value: 20000 },
  { label: "Rp 50.000", value: 50000 },
];

function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

interface TraktirModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrisImageUrl: string;
}

export default function TraktirModal({ isOpen, onClose, qrisImageUrl }: TraktirModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [qrisResult, setQrisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const numericAmount = typeof amount === "number" ? amount : 0;

  function handlePreset(val: number) {
    setAmount(val);
    setQrisResult("");
    setError("");
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw ? parseInt(raw, 10) : "");
    setQrisResult("");
    setError("");
  }

  async function handleGenerate() {
    if (!numericAmount || numericAmount < 1000) {
      setError("Nominal minimal Rp 1.000");
      return;
    }
    setError("");
    setLoading(true);
    setQrisResult("");
    try {
      const res = await fetch("/api/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal membuat QRIS");
      } else {
        setQrisResult(data.qris);
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!qrisResult) return;
    navigator.clipboard.writeText(qrisResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl border border-[#dddfe2] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-[#0866FF]" />

        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg shadow-emerald-100 mb-3">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1c2b33]">
              Traktir Pengembang ☕
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              AdSimulator sepenuhnya gratis. Traktir kopi untuk pengembang agar tetap semangat melakukan pemeliharaan & update! 🙏
            </p>
          </div>

          {/* Developer info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0866FF] to-[#0ea5e9] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
              MB
            </div>
            <div>
              <p className="text-sm font-bold text-[#1c2b33]">Muhamad Bilal Pangestu</p>
              <a
                href="https://mbp.web.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#0866FF] hover:underline"
              >
                mbp.web.id →
              </a>
            </div>
            <div className="ml-auto flex items-center gap-1 text-rose-500">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span className="text-[10px] font-semibold">Terima kasih!</span>
            </div>
          </div>

          {/* Amount section */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#1c2b33] mb-2">
              Pilih atau masukkan nominal traktiran:
            </label>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    numericAmount === p.value
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100"
                      : "border-[#dddfe2] text-gray-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount === "" ? "" : amount.toLocaleString("id-ID")}
                onChange={handleInput}
                placeholder="Nominal bebas..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#dddfe2] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
            </div>
            {numericAmount > 0 && (
              <p className="text-[10px] text-gray-400 mt-1 text-right font-medium">
                = {formatRupiah(numericAmount)}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 mb-4">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!numericAmount || numericAmount < 1000 || loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100 hover:shadow-emerald-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Membuat QRIS...
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5" />
                {numericAmount >= 1000
                  ? `Traktir ${formatRupiah(numericAmount)}`
                  : "Generate QRIS"}
              </>
            )}
          </button>

          {/* QR Result */}
          {qrisResult ? (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-emerald-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-700">
                      QRIS siap di-scan!
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">Disalin!</span></>
                    ) : (
                      <><Copy className="w-3 h-3" />Salin kode</>
                    )}
                  </button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center py-5 gap-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                    <QRCodeSVG
                      value={qrisResult}
                      size={180}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-bold text-[#1c2b33]">
                      {formatRupiah(numericAmount)}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      GoPay · OVO · DANA · ShopeePay · m-Banking
                    </p>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-4 pb-4">
                  <div className="bg-white/70 rounded-lg p-3 text-[10px] text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-600">Cara scan:</p>
                    <p>1. Buka aplikasi dompet digital, pilih scan QR</p>
                    <p>2. Scan QR atau salin kode QRIS di atas</p>
                    <p>3. Nominal otomatis terisi — bayar ✓</p>
                  </div>
                </div>
              </div>
            </div>
          ) : qrisImageUrl ? (
            <div className="mt-4 border border-gray-200 bg-gray-50/50 rounded-2xl overflow-hidden p-4 text-center">
              <p className="text-xs font-semibold text-gray-700 mb-2.5">Atau Scan QRIS Manual:</p>
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-gray-100 mb-2 mx-auto">
                <img src={qrisImageUrl} alt="QRIS Pengembang" className="max-w-[180px] h-auto object-contain mx-auto" />
              </div>
              <p className="text-[10px] text-gray-400">Scan QR di atas dengan dompet digital Anda dan masukkan nominal donasi bebas.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
