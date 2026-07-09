import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PLANS, getActiveSubscription, formatRupiah, type SubscriptionRow } from "@/lib/subscription";
import { ADMIN_WHATSAPP, waLink } from "@/lib/constants";
import {
  LayoutGrid, Crown, Check, Sparkles, Clock, CheckCircle2, XCircle, Hourglass, Gift, MessageCircle,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; cls: string; icon: any }> = {
  PENDING: { label: "Menunggu konfirmasi", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Hourglass },
  ACTIVE: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  EXPIRED: { label: "Kedaluwarsa", cls: "bg-gray-50 text-gray-500 border-gray-200", icon: Clock },
  REJECTED: { label: "Ditolak", cls: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
};

function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
}

export default async function LanggananPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [{ data: subsRaw }, activeSub] = await Promise.all([
    supabase.from("Subscription").select("*").eq("userId", session.user.id).order("createdAt", { ascending: false }),
    getActiveSubscription(session.user.id),
  ]);
  const subs = (subsRaw || []) as SubscriptionRow[];
  const hasActive = !!activeSub;
  const pending = subs.find((s) => s.status === "PENDING");

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/hub" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
            <LayoutGrid className="w-3.5 h-3.5" /> AdSimulator
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-[#0866FF] font-semibold">Langganan</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" /> Langganan Kelas Premium
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Buka semua kelas Meta Ads. <b className="text-emerald-600">Simulator iklan tetap gratis</b> — kamu hanya membayar untuk akses materi belajar (LMS).
        </p>
      </div>

      {/* Status aktif */}
      {hasActive && activeSub && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">{activeSub.planName} — Aktif</p>
            <p className="text-xs text-emerald-600">Berlaku sampai {fmtDate(activeSub.expiresAt)}. Semua kelas premium terbuka.</p>
          </div>
          <Link href="/dashboard/kelas" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
            Ke Kelas
          </Link>
        </div>
      )}

      {/* Pending */}
      {pending && !hasActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <Hourglass className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">Pembayaran sedang diverifikasi</p>
            <p className="text-xs text-amber-600">
              Pengajuan {pending.planName} ({formatRupiah(pending.amount)}) menunggu konfirmasi admin. Kamu akan otomatis mendapat akses setelah disetujui.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={waLink(`Halo Admin AdSimulator, saya sudah membayar langganan *${pending.planName}* (${formatRupiah(pending.amount)}). Mohon dibantu aktivasi akun saya. Terima kasih.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              title={`WhatsApp admin +${ADMIN_WHATSAPP}`}
            >
              <MessageCircle className="w-3.5 h-3.5" /> Hubungi Admin
            </a>
            <Link href={`/dashboard/langganan/checkout?plan=${pending.planSlug}`} className="text-xs font-bold text-amber-700 hover:underline whitespace-nowrap">
              Lihat QRIS →
            </Link>
          </div>
        </div>
      )}

      {/* Paket */}
      {!hasActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`relative bg-white rounded-2xl border shadow-sm p-6 flex flex-col ${plan.highlight ? "border-[#0866FF] ring-2 ring-[#0866FF]/15" : "border-gray-100"}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0866FF] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Sparkles className="w-3 h-3" /> {plan.badge}
                </span>
              )}
              <h3 className="text-base font-bold text-[#1c2b33]">{plan.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{plan.tagline}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-extrabold text-[#1c2b33]">{formatRupiah(plan.price)}</span>
                <span className="text-sm text-gray-400 mb-1">{plan.perLabel}</span>
              </div>
              {plan.period === "YEARLY" && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ≈ {formatRupiah(Math.round(plan.price / 12))}/bulan — hemat 32%
                </p>
              )}
              <ul className="mt-5 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/dashboard/langganan/checkout?plan=${plan.slug}`}
                className={`mt-6 w-full text-center text-sm font-bold py-3 rounded-xl transition-colors ${
                  plan.highlight ? "bg-[#0866FF] hover:bg-[#0757d4] text-white" : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                Pilih Paket Ini
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Info gratis */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <Gift className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#1c2b33]">Simulator iklan 100% gratis</p>
          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
            Semua fitur Ads Manager (buat kampanye, ad set, iklan, lihat metrik) dan halaman Panduan tetap bisa dipakai tanpa berlangganan.
            Langganan hanya membuka <b>Kelas Premium</b> (video & materi belajar terstruktur).
          </p>
        </div>
      </div>

      {/* Riwayat */}
      {subs.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[#1c2b33] mb-3">Riwayat Langganan</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">Paket</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">Nominal</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Diajukan</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Berlaku s/d</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => {
                  const b = STATUS_BADGE[s.status] ?? STATUS_BADGE.PENDING;
                  const Icon = b.icon;
                  return (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 text-[#1c2b33] font-medium">{s.planName}</td>
                      <td className="px-5 py-3 text-gray-600">{formatRupiah(s.amount)}</td>
                      <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{fmtDate(s.createdAt)}</td>
                      <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{fmtDate(s.expiresAt)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${b.cls}`}>
                          <Icon className="w-3 h-3" /> {b.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
