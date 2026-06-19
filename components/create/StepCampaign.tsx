"use client";

import { CampaignFormData } from "./CreateCampaignFlow";
import { OBJECTIVE_INFO, SPECIAL_AD_CATEGORIES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/simulate";

interface Props {
  data: CampaignFormData;
  onChange: (p: Partial<CampaignFormData>) => void;
  onNext: () => void;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
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

export default function StepCampaign({ data, onChange, onNext }: Props) {
  const objInfo = OBJECTIVE_INFO[data.objective];

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan kampanye</h2>
        <span className="text-xs text-gray-400">Level kampanye</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Tujuan: <span className="font-semibold text-[#0866FF]">{objInfo?.label}</span>
      </p>

      <div className="space-y-5">
        {/* Nama kampanye */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Nama kampanye</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={`Kampanye ${objInfo?.label}`}
            className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          />
        </section>

        {/* Kategori iklan khusus */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <label className="block text-sm font-semibold text-[#1c2b33] mb-1">Kategori iklan khusus</label>
          <p className="text-xs text-gray-500 mb-3">
            Deklarasikan jika iklan Anda terkait kredit, pekerjaan, perumahan, atau isu sosial, pemilu, dan politik.
          </p>
          <div className="space-y-2">
            {SPECIAL_AD_CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2.5 text-sm text-[#1c2b33] cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.specialAdCategories.includes(cat.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ specialAdCategories: [...data.specialAdCategories, cat.value] });
                    } else {
                      onChange({ specialAdCategories: data.specialAdCategories.filter((c) => c !== cat.value) });
                    }
                  }}
                  className="rounded border-gray-300 accent-[#0866FF]"
                />
                {cat.label}
              </label>
            ))}
          </div>
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
            <Toggle on={data.abTestEnabled} onClick={() => onChange({ abTestEnabled: !data.abTestEnabled })} />
          </div>
        </section>

        {/* Anggaran kampanye Advantage */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1c2b33]">Anggaran kampanye Advantage</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Meta mendistribusikan anggaran Anda ke seluruh set iklan untuk mendapatkan lebih banyak hasil.
              </p>
            </div>
            <Toggle on={data.cboEnabled} onClick={() => onChange({ cboEnabled: !data.cboEnabled })} />
          </div>

          {data.cboEnabled && (
            <div className="mt-4 pt-4 border-t border-[#dddfe2]">
              <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Anggaran kampanye</label>
              <div className="flex gap-2">
                <select
                  value={data.budgetType}
                  onChange={(e) => onChange({ budgetType: e.target.value as "DAILY" | "LIFETIME" })}
                  className="px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] bg-white"
                >
                  <option value="DAILY">Anggaran harian</option>
                  <option value="LIFETIME">Anggaran seumur hidup</option>
                </select>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={data.budgetAmount}
                    onChange={(e) => onChange({ budgetAmount: Number(e.target.value) })}
                    className="w-full pl-10 pr-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formatCurrency(data.budgetAmount)} per {data.budgetType === "DAILY" ? "hari" : "seumur hidup"}
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!data.name.trim()}
          className="bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          Berikutnya: Set Iklan
        </button>
      </div>
    </div>
  );
}
