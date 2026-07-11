"use client";

import dynamic from "next/dynamic";
import { formatCurrency, formatNumber } from "@/lib/simulate";

// Lazy: recharts (~100 KB) baru dimuat setelah kartu KPI tampil
const PerformanceChartGraphs = dynamic(() => import("./PerformanceChartGraphs"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl border border-[#dddfe2] p-12 text-center text-sm text-gray-400">
      Memuat grafik…
    </div>
  ),
});

interface ChartPoint {
  date: string;
  reach: number;
  impressions: number;
  results: number;
  amountSpent: number;
}

interface Props {
  data: ChartPoint[];
  totals: { reach: number; impressions: number; results: number; amountSpent: number };
  balance: number;
  currency: string;
}

export default function PerformanceChart({ data, totals, balance, currency }: Props) {
  const kpiCards = [
    { label: "Saldo Simulasi", value: formatCurrency(balance, currency), color: "text-[#0866FF]" },
    { label: "Total Jangkauan", value: formatNumber(totals.reach), color: "text-green-600" },
    { label: "Total Tayangan", value: formatNumber(totals.impressions), color: "text-purple-600" },
    { label: "Total Hasil", value: formatNumber(totals.results), color: "text-orange-600" },
    { label: "Jumlah Dibelanjakan (sim)", value: formatCurrency(totals.amountSpent, currency), color: "text-red-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-[#1c2b33]">Ringkasan akun</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-[#dddfe2] p-4">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {data.length > 0 ? (
        <PerformanceChartGraphs data={data} />
      ) : (
        <div className="bg-white rounded-xl border border-[#dddfe2] p-12 text-center text-gray-400">
          <p className="font-medium text-[#1c2b33]">Belum ada data performa</p>
          <p className="text-sm mt-1">Buat dan publikasikan kampanye untuk melihat metrik.</p>
        </div>
      )}
    </div>
  );
}
