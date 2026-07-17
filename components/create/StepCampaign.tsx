"use client";

import { CampaignFormData } from "./CreateCampaignFlow";
import { OBJECTIVE_INFO, SPECIAL_AD_CATEGORIES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/simulate";
import { AlertTriangle, ExternalLink } from "lucide-react";
import GuidePanel from "./GuidePanel";

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
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan kampanye</h2>
        <span className="text-xs text-gray-400">Level kampanye</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Tujuan: <span className="font-semibold text-[#0866FF]">{objInfo?.label}</span>
      </p>

      <div className="space-y-5">
        {/* Guide Panel – Langkah 2: Pengaturan Kampanye */}
        <GuidePanel
          title="📊 Panduan: Pengaturan Kampanye (Campaign)"
          summary="Level Kampanye adalah lapisan teratas dalam struktur iklan Meta. Di sini kamu mengatur nama, kategori, dan anggaran keseluruhan. Satu kampanye bisa punya banyak Ad Set di dalamnya."
          tips={[
            {
              field: "Nama Kampanye",
              what: "Label identifikasi kampanye kamu di Meta Ads Manager.",
              recommendation: "Gunakan nama yang deskriptif dan mudah dilacak, misalnya: 'Juli2025 - Traffic - Website Produk A'. Hindari nama generik seperti 'Kampanye 1'.",
            },
            {
              field: "Kategori Iklan Khusus",
              what: "Deklarasi wajib jika iklanmu menyentuh topik sensitif: kredit, pekerjaan, perumahan, atau isu sosial/politik. Meta mengharuskan ini untuk kepatuhan regulasi.",
              recommendation: "Jika iklanmu adalah produk/jasa biasa seperti pakaian, makanan, atau software, biarkan kosong. Jangan salah pilih karena bisa membatasi targeting kamu.",
            },
            {
              field: "Optimasi Anggaran Kampanye (CBO)",
              what: "Campaign Budget Optimization. Jika aktif, Meta akan secara otomatis mendistribusikan anggaran ke Ad Set yang paling efisien.",
              recommendation: "Aktifkan CBO jika kamu menjalankan banyak Ad Set sekaligus dan ingin Meta yang memilih mana yang paling hemat biaya. Matikan CBO jika kamu ingin kontrol penuh atas anggaran per Ad Set.",
            },
            {
              field: "Anggaran (Budget)",
              what: "Total uang yang akan kamu habiskan. Bisa per hari (Daily Budget) atau total selama kampanye berjalan (Lifetime Budget).",
              recommendation: "Untuk pemula, mulai dengan Rp 50.000 - Rp 100.000/hari agar data cukup untuk optimasi. Tingkatkan secara bertahap (20-30%/minggu) jika hasilnya bagus.",
            },
          ]}
        />

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
          <div className="space-y-2.5">
            {SPECIAL_AD_CATEGORIES.map((cat) => (
              <div key={cat.value}>
                <label className="flex items-start gap-2.5 text-sm text-[#1c2b33] cursor-pointer">
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

          {/* Warning donasi / social issues */}
          {data.specialAdCategories.includes("SOCIAL_ISSUES") && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs font-bold text-amber-800">Iklan Isu Sosial & Donasi — Wajib Izin Meta</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Kategori ini mencakup <strong>iklan donasi, kampanye sosial, penggalangan dana, dan advokasi</strong>. Meta mewajibkan proses otorisasi sebelum iklan ini bisa tayang.
              </p>
              <div className="space-y-1.5 text-xs text-amber-800">
                <p className="font-semibold">Langkah mendapatkan izin:</p>
                <ol className="list-decimal list-inside space-y-1 text-amber-700 leading-relaxed">
                  <li>Buka <strong>Meta Business Suite</strong> → Pengaturan Bisnis → Pusat Keamanan.</li>
                  <li>Klik <strong>"Mulai Verifikasi"</strong> di bagian Otorisasi Iklan Isu Sosial.</li>
                  <li>Konfirmasi negara/wilayah penargetan iklan Anda.</li>
                  <li>Verifikasi identitas Anda (KTP / paspor) atau organisasi (dokumen resmi).</li>
                  <li>Tunggu persetujuan Meta — biasanya <strong>1–5 hari kerja</strong>.</li>
                  <li>Setelah disetujui, akun iklan Anda akan muncul label <em>"Diotorisasi"</em> dan iklan bisa ditayangkan.</li>
                </ol>
              </div>
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
