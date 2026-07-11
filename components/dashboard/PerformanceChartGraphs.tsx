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

export default function PerformanceChartGraphs({ data }: { data: ChartPoint[] }) {
  return (
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
  );
}
