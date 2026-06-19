"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/simulate";

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
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <h2 className="font-semibold text-sm text-[#1c2b33] mb-4">Jangkauan &amp; Tayangan (7 hari terakhir)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(v) => formatNumber(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="reach" stroke="#0866FF" strokeWidth={2} dot={false} name="Jangkauan" />
                <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Tayangan" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <h2 className="font-semibold text-sm text-[#1c2b33] mb-4">Hasil &amp; Jumlah Dibelanjakan (7 hari terakhir)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => formatNumber(v)} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v, name) => name === "Jumlah Dibelanjakan" ? formatCurrency(Number(v)) : formatNumber(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="results" stroke="#f97316" strokeWidth={2} dot={false} name="Hasil" />
                <Line yAxisId="right" type="monotone" dataKey="amountSpent" stroke="#ef4444" strokeWidth={2} dot={false} name="Jumlah Dibelanjakan" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#dddfe2] p-12 text-center text-gray-400">
          <p className="font-medium text-[#1c2b33]">Belum ada data performa</p>
          <p className="text-sm mt-1">Buat dan publikasikan kampanye untuk melihat metrik.</p>
        </div>
      )}
    </div>
  );
}
