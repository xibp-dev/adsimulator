"use client";

import Link from "next/link";
import { Plus, TrendingUp, MoreHorizontal } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusToggle from "@/components/ui/StatusToggle";

interface AdRow {
  id: string;
  name: string;
  status: string;
  format: string;
  headline: string;
  primaryText: string;
  adSet: { id: string; name: string; campaign: { name: string } };
  simMetrics: Array<{ reach: number; impressions: number; results: number; ctr: number; amountSpent: number }>;
}

const FORMAT_LABELS: Record<string, string> = {
  SINGLE_IMAGE_VIDEO: "Gambar/video tunggal",
  CAROUSEL: "Carousel",
  COLLECTION: "Koleksi",
};

export default function AdTable({ ads }: { ads: AdRow[] }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1c2b33]">Iklan</h1>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Buat
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#dddfe2] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#dddfe2] bg-gray-50">
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[200px]">Nama iklan</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Set iklan</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Pengiriman</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Format</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Hasil</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jangkauan</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">CTR</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jumlah dibelanjakan</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <TrendingUp className="w-8 h-8" />
                    <p className="text-[#1c2b33] font-medium">Belum ada iklan</p>
                    <Link href="/dashboard/create" className="text-sm text-[#0866FF] hover:underline">Buat kampanye</Link>
                  </div>
                </td>
              </tr>
            ) : (
              ads.map((ad) => {
                const m = ad.simMetrics[0];
                return (
                  <tr key={ad.id} className="border-b border-[#f0f2f5] hover:bg-[#f7f8fa]">
                    <td className="px-2 py-3">
                      <StatusToggle entityId={ad.id} entityType="ad" isActive={ad.status === "ACTIVE"} />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-[#1c2b33]">{ad.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate">{ad.headline || ad.primaryText || "—"}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 max-w-[160px] truncate">{ad.adSet.name}</td>
                    <td className="px-3 py-3"><StatusBadge status={ad.status} /></td>
                    <td className="px-3 py-3 text-sm text-gray-500">{FORMAT_LABELS[ad.format] ?? ad.format}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatNumber(m?.results ?? 0)}</td>
                    <td className="px-3 py-3 text-right">{formatNumber(m?.reach ?? 0)}</td>
                    <td className="px-3 py-3 text-right">{m?.ctr ? `${m.ctr.toFixed(2)}%` : "—"}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatCurrency(m?.amountSpent ?? 0)}</td>
                    <td className="px-3 py-3">
                      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
