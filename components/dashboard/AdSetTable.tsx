"use client";

import Link from "next/link";
import { Plus, TrendingUp, MoreHorizontal } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusToggle from "@/components/ui/StatusToggle";

interface AdSetRow {
  id: string;
  name: string;
  campaignId: string;
  status: string;
  budgetType: string;
  budgetAmount: number;
  ageMin: number;
  ageMax: number;
  scheduleStart: Date;
  scheduleEnd: Date | null;
  campaign: { id: string; name: string; objective: string };
  _count: { ads: number };
  simMetrics: Array<{ reach: number; impressions: number; results: number; costPerResult: number; amountSpent: number }>;
}

export default function AdSetTable({ adSets }: { adSets: AdSetRow[] }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1c2b33]">Set Iklan</h1>
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
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[200px]">Nama set iklan</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Kampanye</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Pengiriman</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Anggaran</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Hasil</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jangkauan</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jumlah dibelanjakan</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {adSets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <TrendingUp className="w-8 h-8" />
                    <p className="text-[#1c2b33] font-medium">Belum ada set iklan</p>
                    <Link href="/dashboard/create" className="text-sm text-[#0866FF] hover:underline">Buat kampanye</Link>
                  </div>
                </td>
              </tr>
            ) : (
              adSets.map((adSet) => {
                const m = adSet.simMetrics[0];
                return (
                  <tr key={adSet.id} className="border-b border-[#f0f2f5] hover:bg-[#f7f8fa]">
                    <td className="px-2 py-3">
                      <StatusToggle entityId={adSet.id} entityType="adset" isActive={adSet.status === "ACTIVE"} />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-[#1c2b33]">{adSet.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Usia {adSet.ageMin}–{adSet.ageMax} · {adSet._count.ads} iklan</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 max-w-[160px] truncate">{adSet.campaign.name}</td>
                    <td className="px-3 py-3"><StatusBadge status={adSet.status} /></td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-400 block">{adSet.budgetType === "DAILY" ? "Harian" : "Seumur hidup"}</span>
                      {formatCurrency(adSet.budgetAmount)}
                    </td>
                    <td className="px-3 py-3 text-right font-medium">{formatNumber(m?.results ?? 0)}</td>
                    <td className="px-3 py-3 text-right">{formatNumber(m?.reach ?? 0)}</td>
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
