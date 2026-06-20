"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/simulate";

interface AdSet {
  id: string;
  name: string;
  budgetType: string;
  budgetAmount: number;
  scheduleStart: string | null;
  scheduleEnd: string | null;
}

export default function EditAdSetClient({ adSet }: { adSet: AdSet }) {
  const router = useRouter();

  const toDateInput = (iso: string | null) => {
    if (!iso) return "";
    try {
      return new Date(iso).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const [name, setName] = useState(adSet.name);
  const [budgetType, setBudgetType] = useState<"DAILY" | "LIFETIME">(
    (adSet.budgetType as "DAILY" | "LIFETIME") || "DAILY"
  );
  const [budgetAmount, setBudgetAmount] = useState(adSet.budgetAmount);
  const [scheduleStart, setScheduleStart] = useState(toDateInput(adSet.scheduleStart));
  const [scheduleEnd, setScheduleEnd] = useState(toDateInput(adSet.scheduleEnd));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/adsets/${adSet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          budgetType,
          budgetAmount,
          scheduleStart: scheduleStart || undefined,
          scheduleEnd: scheduleEnd || null,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan perubahan");
      router.push("/dashboard/ads-manager");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#dddfe2] px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1c2b33] px-2 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-sm font-bold text-[#1c2b33]">Edit Set Iklan</h1>
            <p className="text-xs text-gray-400">{adSet.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="px-3 py-1.5 text-sm font-semibold text-[#1c2b33] hover:bg-gray-100 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan set iklan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ubah nama, anggaran, dan jadwal set iklan Anda.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Nama set iklan */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
              Nama set iklan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Set Iklan 1"
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            />
          </section>

          {/* Anggaran & Jadwal */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Anggaran &amp; jadwal</h3>
            <div className="flex gap-2">
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value as "DAILY" | "LIFETIME")}
                className="px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] bg-white"
              >
                <option value="DAILY">Anggaran harian</option>
                <option value="LIFETIME">Anggaran seumur hidup</option>
              </select>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 -mt-2">
              {formatCurrency(budgetAmount)} per{" "}
              {budgetType === "DAILY" ? "hari" : "seumur hidup"}
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Tanggal mulai</label>
                <input
                  type="date"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  Tanggal selesai (opsional)
                </label>
                <input
                  type="date"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom save button */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="px-5 py-2.5 text-sm font-semibold text-[#1c2b33] bg-white border border-[#dddfe2] hover:bg-gray-50 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
