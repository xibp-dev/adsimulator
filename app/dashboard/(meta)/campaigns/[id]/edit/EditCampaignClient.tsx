"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { SPECIAL_AD_CATEGORIES, OBJECTIVE_INFO } from "@/lib/mockData";
import { formatCurrency } from "@/lib/simulate";

interface Campaign {
  id: string;
  name: string;
  objective: string;
  budgetType: string;
  budgetAmount: number;
  specialAdCategories: string[] | null;
  cboEnabled: boolean;
  abTestEnabled: boolean;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-colors ${
        on ? "bg-[#0866FF]" : "bg-gray-300"
      }`}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? "translateX(22px)" : "translateX(3px)" }}
      />
    </button>
  );
}

export default function EditCampaignClient({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [name, setName] = useState(campaign.name);
  const [budgetType, setBudgetType] = useState<"DAILY" | "LIFETIME">(
    (campaign.budgetType as "DAILY" | "LIFETIME") || "DAILY"
  );
  const [budgetAmount, setBudgetAmount] = useState(campaign.budgetAmount);
  const [specialAdCategories, setSpecialAdCategories] = useState<string[]>(
    campaign.specialAdCategories ?? []
  );
  const [abTestEnabled, setAbTestEnabled] = useState(campaign.abTestEnabled);
  const [cboEnabled, setCboEnabled] = useState(campaign.cboEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const objInfo = (OBJECTIVE_INFO as Record<string, { label: string; description: string; icon: string }>)[campaign.objective];

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, budgetType, budgetAmount }),
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
            <h1 className="text-sm font-bold text-[#1c2b33]">Edit Kampanye</h1>
            <p className="text-xs text-gray-400">{campaign.name}</p>
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
          <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan kampanye</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tujuan:{" "}
            <span className="font-semibold text-[#0866FF]">
              {objInfo?.label ?? campaign.objective}
            </span>{" "}
            <span className="text-gray-400">(tidak dapat diubah)</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Nama kampanye */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
              Nama kampanye
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kampanye"
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            />
          </section>

          {/* Kategori iklan khusus */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <label className="block text-sm font-semibold text-[#1c2b33] mb-1">
              Kategori iklan khusus
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Deklarasikan jika iklan Anda terkait kredit, pekerjaan, perumahan, atau isu sosial,
              pemilu, dan politik.
            </p>
            <div className="space-y-2.5">
              {SPECIAL_AD_CATEGORIES.map((cat) => (
                <div key={cat.value}>
                  <label className="flex items-start gap-2.5 text-sm text-[#1c2b33] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialAdCategories.includes(cat.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSpecialAdCategories((prev) => [...prev, cat.value]);
                        } else {
                          setSpecialAdCategories((prev) => prev.filter((c) => c !== cat.value));
                        }
                      }}
                      className="rounded border-gray-300 accent-[#0866FF] mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <span className="font-medium">{cat.label}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {specialAdCategories.includes("SOCIAL_ISSUES") && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-amber-800">
                    Iklan Isu Sosial &amp; Donasi — Wajib Izin Meta
                  </p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Kategori ini mencakup{" "}
                  <strong>
                    iklan donasi, kampanye sosial, penggalangan dana, dan advokasi
                  </strong>
                  . Meta mewajibkan proses otorisasi sebelum iklan ini bisa tayang.
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                  <p className="text-[11px] text-amber-600 font-medium">
                    Panduan lengkap: facebook.com/business/help/214754519275355
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Pengujian A/B */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1c2b33]">Pengujian A/B</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bandingkan beberapa versi iklan untuk melihat mana yang berperforma terbaik.
                </p>
              </div>
              <Toggle on={abTestEnabled} onClick={() => setAbTestEnabled((v) => !v)} />
            </div>
          </section>

          {/* Anggaran kampanye Advantage */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1c2b33]">Anggaran kampanye Advantage</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Meta mendistribusikan anggaran Anda ke seluruh set iklan untuk mendapatkan lebih
                  banyak hasil.
                </p>
              </div>
              <Toggle on={cboEnabled} onClick={() => setCboEnabled((v) => !v)} />
            </div>

            {cboEnabled && (
              <div className="mt-4 pt-4 border-t border-[#dddfe2]">
                <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
                  Anggaran kampanye
                </label>
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
                <p className="text-xs text-gray-400 mt-1">
                  {formatCurrency(budgetAmount)} per{" "}
                  {budgetType === "DAILY" ? "hari" : "seumur hidup"}
                </p>
              </div>
            )}
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
