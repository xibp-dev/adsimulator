"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Layers,
  Coffee,
  Heart,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
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

export default function TraktirPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [qrisResult, setQrisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrisImageUrl, setQrisImageUrl] = useState("");
  const [siteSettingsLoaded, setSiteSettingsLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/qris/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.traktirEnabled === false) {
          setBlocked(true);
          router.replace("/");
          return;
        }
        if (data.qrisImageUrl) setQrisImageUrl(data.qrisImageUrl);
        setSiteSettingsLoaded(true);
      })
      .catch(() => setSiteSettingsLoaded(true));
  }, [router]);

  if (blocked) return null;

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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-white to-[#f0f4ff] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-[#dddfe2] bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0866FF] rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1c2b33] text-sm">AdSimulator</span>
          </div>
          <Link
            href="/login"
            className="text-sm text-[#0866FF] font-semibold hover:underline"
          >
            Masuk
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg shadow-emerald-200 mb-5">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1c2b33] mb-3">
              Traktir Pengembang ☕
            </h1>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
              AdSimulator sepenuhnya gratis. Kalau tools ini membantumu, traktir kopi untuk
              pengembang agar tetap semangat! 🙏
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-[#dddfe2] shadow-xl shadow-gray-100/80 overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-[#0866FF]" />

            <div className="p-8">
              {/* Developer info */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0866FF] to-[#0ea5e9] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  MB
                </div>
                <div>
                  <p className="font-bold text-[#1c2b33]">Muhamad Bilal Pangestu</p>
                  <a
                    href="https://mbp.web.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0866FF] hover:underline"
                  >
                    mbp.web.id →
                  </a>
                </div>
                <div className="ml-auto flex items-center gap-1 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span className="text-xs font-semibold">Terima kasih!</span>
                </div>
              </div>

              {/* Amount section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1c2b33] mb-3">
                  Pilih atau masukkan nominal traktiran:
                </label>

                {/* Preset buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {PRESETS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handlePreset(p.value)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
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
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount === "" ? "" : amount.toLocaleString("id-ID")}
                    onChange={handleInput}
                    placeholder="Nominal bebas..."
                    className="w-full pl-10 pr-4 py-3 border border-[#dddfe2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>
                {numericAmount > 0 && (
                  <p className="text-xs text-gray-400 mt-1.5 text-right">
                    = {formatRupiah(numericAmount)}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!numericAmount || numericAmount < 1000 || loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100 hover:shadow-emerald-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat QRIS...
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4" />
                    {numericAmount >= 1000
                      ? `Traktir ${formatRupiah(numericAmount)}`
                      : "Generate QRIS"}
                  </>
                )}
              </button>

              {/* QR Result */}
              {qrisResult ? (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-700">
                          QRIS siap di-scan!
                        </span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copied ? (
                          <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-500">Disalin!</span></>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" />Salin kode</>
                        )}
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center py-8 gap-4">
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
                        <QRCodeSVG
                          value={qrisResult}
                          size={220}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-[#1c2b33]">
                          {formatRupiah(numericAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Scan dengan GoPay · OVO · DANA · ShopeePay · m-Banking
                        </p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="px-6 pb-5">
                      <div className="bg-white/70 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
                        <p className="font-semibold text-gray-600 mb-2">Cara scan:</p>
                        <p>1. Buka aplikasi dompet digital kamu</p>
                        <p>2. Pilih "Bayar" / "Scan QR"</p>
                        <p>3. Arahkan kamera ke QR di atas</p>
                        <p>4. Nominal otomatis terisi — konfirmasi pembayaran ✓</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : qrisImageUrl ? (
                <div className="mt-6 border border-gray-200 bg-gray-50/50 rounded-2xl overflow-hidden p-6 text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Atau Scan QRIS Manual:</p>
                  <div className="bg-white p-4 rounded-2xl inline-block shadow-sm border border-gray-100 mb-3 mx-auto">
                    <img src={qrisImageUrl} alt="QRIS Pengembang" className="max-w-[240px] h-auto object-contain mx-auto" />
                  </div>
                  <p className="text-xs text-gray-400">Scan QR di atas dengan dompet digital Anda dan masukkan nominal donasi bebas.</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
            <p>Terima kasih telah mendukung pengembangan AdSimulator! 🙏</p>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://mbp.web.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0866FF] transition-colors underline"
              >
                Muhamad Bilal Pangestu
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
