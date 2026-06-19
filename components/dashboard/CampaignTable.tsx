"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Copy, Edit2, Trash2, Download, Columns,
  ChevronDown, MoreHorizontal, TrendingUp
} from "lucide-react";
import { CampaignObjective, CampaignStatus } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import { OBJECTIVE_INFO } from "@/lib/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusToggle from "@/components/ui/StatusToggle";

interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budgetType: string;
  budgetAmount: number;
  cboEnabled: boolean;
  createdAt: Date;
  _count: { adSets: number };
  simMetrics: Array<{
    reach: number;
    impressions: number;
    results: number;
    costPerResult: number;
    amountSpent: number;
    ctr: number;
    cpm: number;
    date: Date;
  }>;
}

interface Props {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets" | "ads">("campaigns");

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === campaigns.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(campaigns.map((c) => c.id)));
    }
  };

  // Aggregate metrics (latest day)
  const getLatestMetrics = (campaign: Campaign) => {
    const latest = campaign.simMetrics[0];
    return latest ?? { reach: 0, impressions: 0, results: 0, costPerResult: 0, amountSpent: 0, ctr: 0 };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1c2b33]">Kelola Iklan</h1>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#dddfe2] mb-4">
        {(["campaigns", "adsets", "ads"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#0866FF] text-[#0866FF]"
                : "border-transparent text-gray-600 hover:text-[#1c2b33]"
            }`}
          >
            {tab === "adsets" ? "Set Iklan" : tab === "ads" ? "Iklan" : "Kampanye"}
            {tab === "campaigns" && (
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {campaigns.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          disabled={selected.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-[#1c2b33]"
        >
          <Copy className="w-3.5 h-3.5" /> Duplikat
        </button>
        <button
          disabled={selected.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-[#1c2b33]"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          disabled={selected.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-red-500"
        >
          <Trash2 className="w-3.5 h-3.5" /> Hapus
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">
            <Columns className="w-3.5 h-3.5" /> Kolom: Performa
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">
            <Download className="w-3.5 h-3.5" /> Ekspor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dddfe2] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#dddfe2] bg-gray-50">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === campaigns.length && campaigns.length > 0}
                  onChange={toggleAll}
                  className="rounded border-[#dddfe2] accent-[#0866FF]"
                />
              </th>
              <th className="w-10 px-2 py-3 text-left text-xs font-semibold text-gray-500">Aktif/Nonaktif</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[200px]">Nama kampanye</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Pengiriman</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Anggaran</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Hasil</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jangkauan</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Tayangan</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Biaya per hasil</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jumlah dibelanjakan</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <TrendingUp className="w-10 h-10" />
                    <p className="font-medium text-[#1c2b33]">Belum ada kampanye</p>
                    <p className="text-sm">Buat kampanye pertama Anda untuk memulai</p>
                    <Link
                      href="/dashboard/create"
                      className="mt-2 flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" /> Buat kampanye
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const metrics = getLatestMetrics(campaign);
                const objInfo = OBJECTIVE_INFO[campaign.objective as CampaignObjective];
                return (
                  <tr
                    key={campaign.id}
                    className={`border-b border-[#f0f2f5] hover:bg-[#f7f8fa] transition-colors ${
                      selected.has(campaign.id) ? "bg-[#e7f0ff]" : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(campaign.id)}
                        onChange={() => toggleSelect(campaign.id)}
                        className="rounded border-[#dddfe2] accent-[#0866FF]"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <StatusToggle
                        entityId={campaign.id}
                        entityType="campaign"
                        isActive={campaign.status === "ACTIVE"}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:underline">
                        <p className="font-medium text-[#1c2b33] leading-tight">{campaign.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{objInfo?.label} · {campaign._count.adSets} set iklan</p>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-3 py-3 text-[#1c2b33]">
                      <span className="text-xs text-gray-400 block">{campaign.budgetType === "DAILY" ? "Harian" : "Seumur hidup"}</span>
                      {formatCurrency(campaign.budgetAmount)}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-[#1c2b33]">
                      {formatNumber(metrics.results)}
                    </td>
                    <td className="px-3 py-3 text-right text-[#1c2b33]">
                      {formatNumber(metrics.reach)}
                    </td>
                    <td className="px-3 py-3 text-right text-[#1c2b33]">
                      {formatNumber(metrics.impressions)}
                    </td>
                    <td className="px-3 py-3 text-right text-[#1c2b33]">
                      {metrics.costPerResult > 0 ? formatCurrency(metrics.costPerResult) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-[#1c2b33]">
                      {formatCurrency(metrics.amountSpent)}
                    </td>
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

          {/* Totals row */}
          {campaigns.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50 border-t border-[#dddfe2]">
                <td colSpan={5} className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                  Total ({campaigns.length} kampanye)
                </td>
                <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">
                  {formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.results ?? 0), 0))}
                </td>
                <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">
                  {formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.reach ?? 0), 0))}
                </td>
                <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">
                  {formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.impressions ?? 0), 0))}
                </td>
                <td className="px-3 py-2.5 text-right text-sm text-gray-500">—</td>
                <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">
                  {formatCurrency(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.amountSpent ?? 0), 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
