"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Loader2, Crown, ShieldCheck, Hourglass, CheckCircle2, AlertCircle, Copy, Check, Info, MessageCircle,
} from "lucide-react";
import { ADMIN_WHATSAPP, waLink } from "@/lib/constants";

interface PlanLite {
  slug: string;
  name: string;
  price: number;
  perLabel: string;
  period: string;
  durationDays: number;
  features: string[];
}
interface ExistingSub {
  id: string;
  status: string;
  qrisString: string;
  planName: string;
}

function rp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function CheckoutClient({
  plan,
  existing,
  qrisImageUrl,
}: {
  plan: PlanLite;
  existing: ExistingSub | null;
  qrisImageUrl: string;
}) {
  const [sub, setSub] = useState<ExistingSub | null>(existing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal membuat tagihan");
      } else {
        setSub({ id: data.id, status: data.status, qrisString: data.qrisString, planName: data.planName });
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function copyQr() {
    if (!sub?.qrisString) return;
    navigator.clipboard.writeText(sub.qrisString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard/langganan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Paket
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Ringkasan paket */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Paket dipilih</p>
                <p className="text-sm font-bold text-[#1c2b33] leading-tight">{plan.name}</p>
              </div>
            </div>
            <div className="flex items-end gap-1 py-3 border-y border-gray-50 my-3">
              <span className="text-3xl font-extrabold text-[#1c2b33]">{rp(plan.price)}</span>
              <span className="text-sm text-gray-400 mb-1">{plan.perLabel}</span>
            </div>
            <ul className="space-y-2 mt-3">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Pembayaran diverifikasi manual oleh admin. Akses kelas aktif otomatis setelah pembayaran dikonfirmasi.</span>
          </div>
        </div>

        {/* Pembayaran */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#0866FF] via-blue-400 to-emerald-400" />
            <div className="p-6">
              {!sub ? (
                <>
                  <h2 className="text-base font-bold text-[#1c2b33] mb-1">Konfirmasi & Bayar via QRIS</h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Klik tombol di bawah untuk membuat tagihan {rp(plan.price)}. Kamu akan mendapat kode QRIS untuk dibayar.
                  </p>
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                  )}
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat tagihan...</> : <>Lanjut ke Pembayaran</>}
                  </button>
                </>
              ) : sub.status === "PENDING" ? (
                <>
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Hourglass className="w-4 h-4" />
                    <span className="text-sm font-bold">Menunggu Pembayaran & Konfirmasi</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-5">Scan QRIS berikut sejumlah <b>{rp(plan.price)}</b>, lalu tunggu admin mengonfirmasi.</p>

                  <div className="flex flex-col items-center gap-3">
                    {sub.qrisString ? (
                      <>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <QRCodeSVG value={sub.qrisString} size={210} level="M" />
                        </div>
                        <button onClick={copyQr} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                          {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-500">Disalin!</span></> : <><Copy className="w-3.5 h-3.5" /> Salin kode QRIS</>}
                        </button>
                      </>
                    ) : qrisImageUrl ? (
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <img src={qrisImageUrl} alt="QRIS" className="max-w-[220px] h-auto mx-auto" />
                        <p className="text-xs text-gray-400 mt-2">Masukkan nominal {rp(plan.price)} saat membayar.</p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 w-full">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>QRIS belum dikonfigurasi admin. Hubungi admin untuk instruksi pembayaran. Pengajuanmu sudah tercatat dan menunggu konfirmasi.</span>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-400 text-center">Scan dengan GoPay · OVO · DANA · ShopeePay · m-Banking</p>
                  </div>

                  <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-gray-600 space-y-1.5">
                    <p className="font-semibold text-gray-700">Setelah membayar:</p>
                    <p>1. Admin memverifikasi pembayaran kamu.</p>
                    <p>2. Status langganan berubah menjadi <b>Aktif</b>.</p>
                    <p>3. Semua kelas premium langsung terbuka.</p>
                  </div>

                  {/* Hubungi admin bila aktivasi tidak otomatis */}
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      <b>Sudah bayar tapi belum aktif?</b> Aktivasi diverifikasi manual oleh admin. Kalau belum otomatis aktif, konfirmasikan pembayaranmu langsung ke admin via WhatsApp (sertakan bukti transfer).
                    </p>
                    <a
                      href={waLink(`Halo Admin AdSimulator, saya sudah membayar langganan *${plan.name}* (${rp(plan.price)}) via QRIS. Mohon dibantu aktivasi akun saya. Terima kasih.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Hubungi Admin via WhatsApp
                    </a>
                    <p className="text-[11px] text-emerald-600 text-center mt-2">+{ADMIN_WHATSAPP}</p>
                  </div>

                  <Link href="/dashboard/langganan" className="mt-4 block w-full text-center bg-gray-900 hover:bg-black text-white text-sm font-bold py-3 rounded-xl transition-colors">
                    Selesai — Cek Status Langganan
                  </Link>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#1c2b33]">Status: {sub.status}</p>
                  <Link href="/dashboard/langganan" className="text-xs text-[#0866FF] hover:underline mt-2 inline-block">Lihat detail langganan</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
