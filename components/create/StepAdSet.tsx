"use client";

import { useState, useEffect } from "react";
import { CampaignFormData } from "./CreateCampaignFlow";
import {
  PERFORMANCE_GOALS, CONVERSION_LOCATIONS, MOCK_LOCATIONS, META_DETAILED_TARGETING,
  PLACEMENT_OPTIONS, MOCK_PIXELS, CONVERSION_EVENTS, MOCK_CUSTOM_AUDIENCES, MOCK_LANGUAGES,
  BID_STRATEGIES, OBJECTIVE_ADSET_CONFIG, MOCK_APPS, APP_STORES,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/simulate";
import { X, Search } from "lucide-react";
import GuidePanel from "./GuidePanel";

interface Props {
  data: CampaignFormData;
  onChange: (p: Partial<CampaignFormData>) => void;
  onNext: () => void;
}

function Toggle({ on, onClick, small }: { on: boolean; onClick: () => void; small?: boolean }) {
  const w = small ? "w-9 h-5" : "w-11 h-6";
  const k = small ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center rounded-full flex-shrink-0 transition-colors ${w} ${on ? "bg-[#0866FF]" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow transition-transform ${k}`}
        style={{ transform: on ? (small ? "translateX(18px)" : "translateX(22px)") : "translateX(3px)" }}
      />
    </button>
  );
}

export default function StepAdSet({ data, onChange, onNext }: Props) {
  const [locationSearch, setLocationSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [pixels, setPixels] = useState<string[]>([]);
  const [presets, setPresets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pixels")
      .then((res) => res.json())
      .then((dbPixels) => {
        if (Array.isArray(dbPixels) && dbPixels.length > 0) {
          setPixels(dbPixels.map((p) => `${p.name} (ID: ${p.id})`));
        } else {
          setPixels(MOCK_PIXELS);
        }
      })
      .catch(() => setPixels(MOCK_PIXELS));

    fetch("/api/presets?type=AUDIENCE")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPresets(data);
      })
      .catch((err) => console.error("Error loading presets:", err));
  }, []);

  const cfg = OBJECTIVE_ADSET_CONFIG[data.objective];
  const goals = PERFORMANCE_GOALS[data.objective] ?? [];
  const locations = CONVERSION_LOCATIONS[data.objective] ?? [];
  const bidOptions = BID_STRATEGIES.filter((b) => cfg.bidStrategies.includes(b.value));
  const showPixel =
    cfg.pixelEvent !== "none" && ["WEBSITE", "APP"].includes(data.conversionLocation);
  const pixelRequired = cfg.pixelEvent === "required";

  const filteredLocations = MOCK_LOCATIONS.filter(
    (l) => l.toLowerCase().includes(locationSearch.toLowerCase()) && !data.locations.includes(l)
  );
  const filteredInterests = META_DETAILED_TARGETING.filter(
    (i) =>
      !data.detailedTargeting.includes(i.name) &&
      (i.name.toLowerCase().includes(interestSearch.toLowerCase()) ||
        i.path.toLowerCase().includes(interestSearch.toLowerCase()) ||
        i.type.toLowerCase().includes(interestSearch.toLowerCase()))
  );

  const TYPE_BADGE: Record<string, string> = {
    Minat: "bg-blue-50 text-blue-600",
    Perilaku: "bg-violet-50 text-violet-600",
    Demografi: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan set iklan</h2>
        <span className="text-xs text-gray-400">Level set iklan</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Tentukan siapa yang melihat iklan, di mana, dan berapa anggarannya.</p>

      <div className="space-y-5">
        {/* Guide Panel – Langkah 3: Ad Set */}
        <GuidePanel
          title="🎯 Panduan: Pengaturan Set Iklan (Ad Set)"
          summary="Ad Set adalah lapisan tengah. Di sini kamu menentukan SIAPA yang akan melihat iklanmu (targeting), DI MANA iklan muncul (placement), dan KAPAN/BERAPA BANYAK anggaran yang dipakai. Satu kampanye bisa berisi banyak Ad Set untuk menguji berbagai audiens."
          tips={[
            {
              field: "Nama Set Iklan",
              what: "Label identifikasi ad set ini.",
              recommendation: "Gunakan nama yang mencerminkan audiens atau strategi, misal: 'Lookalike - Pembeli 30 hari' atau 'Interest - Kuliner Bandung 25-35'. Ini memudahkan analisis performa.",
            },
            {
              field: "Lokasi Konversi",
              what: "Di mana kamu ingin orang mengambil tindakan setelah melihat iklan: Website, Aplikasi, WhatsApp, dll.",
              recommendation: "Pilih 'Website' jika punya landing page/toko online. Pilih 'WhatsApp' untuk bisnis yang lebih suka komunikasi personal. Selalu pasangkan dengan pixel untuk tracking yang akurat.",
            },
            {
              field: "Audiens & Targeting",
              what: "Siapa yang akan melihat iklanmu. Termasuk usia, gender, lokasi, minat (interests), dan perilaku (behaviors).",
              recommendation: "Untuk cold audience, gunakan Detailed Targeting dengan minat yang relevan. Ukuran audiens ideal: 500rb - 5 juta orang. Terlalu sempit = iklan mahal, terlalu luas = tidak relevan.",
            },
            {
              field: "Lokasi (Geotargeting)",
              what: "Negara, provinsi, kota, atau radius spesifik tempat iklan ditampilkan.",
              recommendation: "Targetkan kota-kota dengan daya beli tinggi terlebih dahulu (Jakarta, Surabaya, Bandung, Medan). Untuk bisnis lokal, gunakan radius targeting dari alamat toko.",
            },
            {
              field: "Penempatan (Placement)",
              what: "Di mana iklan muncul: Feed Facebook, Instagram Stories, Reels, Audience Network, dll.",
              recommendation: "Gunakan 'Advantage+ Placements' untuk biarkan Meta memilih penempatan terbaik. Jika produkmu sangat visual, pilih manual dan fokus di Instagram Feed + Reels.",
            },
            {
              field: "Pixel Meta",
              what: "Kode tracking yang dipasang di website untuk mengukur tindakan pengunjung (beli, daftar, dll). Wajib untuk objective konversi.",
              recommendation: "Pastikan pixel sudah aktif dan event 'Purchase' atau 'Lead' terverifikasi di Events Manager sebelum menjalankan kampanye konversi.",
            },
            {
              field: "Anggaran & Jadwal",
              what: "Berapa yang dibelanjakan per hari atau total, dan kapan kampanye mulai/berakhir.",
              recommendation: "Jalankan iklan setidaknya 7 hari tanpa perubahan agar Meta punya cukup data untuk belajar (fase learning). Jangan ubah anggaran lebih dari 30% sekaligus.",
            },
          ]}
        />

        {/* Nama set iklan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Nama set iklan</label>
          <input
            type="text"
            value={data.adSetName}
            onChange={(e) => onChange({ adSetName: e.target.value })}
            placeholder="Set Iklan 1"
            className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          />
        </section>

        {/* Aplikasi (khusus Promosi aplikasi) */}
        {cfg.appSelection && (
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Aplikasi</h3>
            <div>
              <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Aplikasi yang dipromosikan</label>
              <select
                value={data.appToPromote}
                onChange={(e) => onChange({ appToPromote: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              >
                <option value="">Pilih aplikasi</option>
                {MOCK_APPS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Toko aplikasi</label>
              <div className="flex gap-2">
                {APP_STORES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ appStore: s.value })}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      data.appStore === s.value
                        ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF] font-medium"
                        : "border-[#dddfe2] text-[#1c2b33] hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Konversi (tidak ada untuk Awareness) */}
        {cfg.showConversion && (
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Konversi</h3>
            <div>
              <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Lokasi konversi</label>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => onChange({ conversionLocation: loc.value })}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      data.conversionLocation === loc.value
                        ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF] font-medium"
                        : "border-[#dddfe2] text-[#1c2b33] hover:bg-gray-50"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {showPixel && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">
                    Set data (Pixel) {pixelRequired && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={data.datasetPixel}
                    onChange={(e) => onChange({ datasetPixel: e.target.value })}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF] ${
                      pixelRequired && !data.datasetPixel ? "border-red-300" : "border-[#dddfe2]"
                    }`}
                  >
                    <option value="">Pilih set data</option>
                    {pixels.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">
                    Peristiwa konversi {pixelRequired && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={data.conversionEvent}
                    onChange={(e) => onChange({ conversionEvent: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                  >
                    {CONVERSION_EVENTS.map((ev) => <option key={ev.value} value={ev.value}>{ev.label}</option>)}
                  </select>
                </div>
              </div>
            )}

            {pixelRequired && (
              <p className="text-xs text-gray-400">
                Tujuan ini memerlukan set data (Pixel) dan peristiwa konversi untuk lokasi situs web/aplikasi.
              </p>
            )}

            {/* Katalog (khusus Penjualan) */}
            {cfg.catalog && (
              <div className="flex items-start justify-between gap-4 pt-2 border-t border-[#f0f2f5]">
                <div>
                  <p className="text-sm font-medium text-[#1c2b33]">Gunakan katalog produk</p>
                  <p className="text-xs text-gray-500 mt-0.5">Tampilkan produk dari katalog Anda secara dinamis (iklan belanja Advantage+).</p>
                </div>
                <Toggle small on={data.catalogOn} onClick={() => onChange({ catalogOn: !data.catalogOn })} />
              </div>
            )}
          </section>
        )}

        {/* Materi iklan dinamis */}
        {cfg.dynamicCreative && (
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1c2b33]">Materi iklan dinamis</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Berikan beberapa gambar, video, dan teks; Meta otomatis membuat kombinasi terbaik untuk tiap orang.
                </p>
              </div>
              <Toggle small on={data.dynamicCreativeOn} onClick={() => onChange({ dynamicCreativeOn: !data.dynamicCreativeOn })} />
            </div>
          </section>
        )}

        {/* Anggaran & jadwal */}
        {!data.cboEnabled && (
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Anggaran &amp; jadwal</h3>
            <div className="flex gap-2">
              <select
                value={data.adSetBudgetType}
                onChange={(e) => onChange({ adSetBudgetType: e.target.value as "DAILY" | "LIFETIME" })}
                className="px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] bg-white"
              >
                <option value="DAILY">Anggaran harian</option>
                <option value="LIFETIME">Anggaran seumur hidup</option>
              </select>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                <input
                  type="number"
                  value={data.adSetBudgetAmount}
                  onChange={(e) => onChange({ adSetBudgetAmount: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 -mt-2">
              {formatCurrency(data.adSetBudgetAmount)} per {data.adSetBudgetType === "DAILY" ? "hari" : "seumur hidup"}
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Tanggal mulai</label>
                <input
                  type="date"
                  value={data.scheduleStart}
                  onChange={(e) => onChange({ scheduleStart: e.target.value })}
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Tanggal selesai (opsional)</label>
                <input
                  type="date"
                  value={data.scheduleEnd}
                  onChange={(e) => onChange({ scheduleEnd: e.target.value })}
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
            </div>
          </section>
        )}

        {/* Pemirsa */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Pemirsa</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Pemirsa Advantage+</span>
              <Toggle small on={data.advantageAudienceOn} onClick={() => onChange({ advantageAudienceOn: !data.advantageAudienceOn })} />
            </div>
          </div>

          {presets.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Gunakan Preset Target
              </label>
              <select
                onChange={(e) => {
                  const presetId = e.target.value;
                  if (!presetId) return;
                  const selected = presets.find((p) => p.id === presetId);
                  if (selected) {
                    try {
                      const audienceData = JSON.parse(selected.data);
                      onChange({
                        locations: audienceData.locations || ["Indonesia"],
                        ageMin: audienceData.ageMin || 18,
                        ageMax: audienceData.ageMax || 65,
                        genders: audienceData.genders || [],
                        detailedTargeting: audienceData.detailedTargeting || [],
                        advantageAudienceOn: false,
                      });
                      alert(`Preset "${selected.name}" berhasil diterapkan!`);
                    } catch (error) {
                      console.error("Failed to apply preset:", error);
                    }
                  }
                }}
                className="w-full px-2.5 py-1.5 border border-[#dddfe2] rounded bg-white text-xs focus:outline-none"
              >
                <option value="">-- Pilih Preset Audiens --</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pemirsa khusus</label>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_CUSTOM_AUDIENCES.map((aud) => {
                const sel = data.customAudiences.includes(aud);
                return (
                  <button
                    key={aud}
                    onClick={() => onChange({
                      customAudiences: sel
                        ? data.customAudiences.filter((a) => a !== aud)
                        : [...data.customAudiences, aud],
                    })}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      sel ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]" : "border-[#dddfe2] text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {aud}
                  </button>
                );
              })}
            </div>
          </div>

          {!data.advantageAudienceOn && (
            <>
              {/* Lokasi */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Lokasi</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Cari negara, kota..."
                    className="w-full pl-9 pr-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {data.locations.map((loc) => (
                    <span key={loc} className="flex items-center gap-1 bg-[#e7f0ff] text-[#0866FF] text-xs px-2 py-1 rounded-full">
                      {loc}
                      <button onClick={() => onChange({ locations: data.locations.filter((l) => l !== loc) })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {locationSearch && (
                  <div className="border border-[#dddfe2] rounded-lg max-h-32 overflow-y-auto">
                    {filteredLocations.slice(0, 8).map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { onChange({ locations: [...data.locations, loc] }); setLocationSearch(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-[#1c2b33]"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Usia */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Usia</label>
                <div className="flex items-center gap-2">
                  <select
                    value={data.ageMin}
                    onChange={(e) => onChange({ ageMin: Number(e.target.value) })}
                    className="px-2 py-1.5 border border-[#dddfe2] rounded text-sm bg-white focus:outline-none"
                  >
                    {Array.from({ length: 52 }, (_, i) => i + 13).map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <span className="text-sm text-gray-400">—</span>
                  <select
                    value={data.ageMax}
                    onChange={(e) => onChange({ ageMax: Number(e.target.value) })}
                    className="px-2 py-1.5 border border-[#dddfe2] rounded text-sm bg-white focus:outline-none"
                  >
                    {Array.from({ length: 53 }, (_, i) => i + 13).map((a) => <option key={a} value={a}>{a === 65 ? "65+" : a}</option>)}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Jenis kelamin</label>
                <div className="flex gap-2">
                  {[{ value: "", label: "Semua" }, { value: "MALE", label: "Pria" }, { value: "FEMALE", label: "Wanita" }].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => onChange({ genders: g.value ? [g.value] : [] })}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        (g.value === "" && data.genders.length === 0) || data.genders.includes(g.value)
                          ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF] font-medium"
                          : "border-[#dddfe2] text-[#1c2b33] hover:bg-gray-50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Penargetan terperinci */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Penargetan terperinci</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={interestSearch}
                    onChange={(e) => setInterestSearch(e.target.value)}
                    placeholder="Cari minat, perilaku..."
                    className="w-full pl-9 pr-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {data.detailedTargeting.map((i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#e7f0ff] text-[#0866FF] text-xs px-2 py-1 rounded-full">
                      {i}
                      <button onClick={() => onChange({ detailedTargeting: data.detailedTargeting.filter((t) => t !== i) })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {interestSearch && (
                  <div className="border border-[#dddfe2] rounded-lg max-h-64 overflow-y-auto divide-y divide-[#f0f2f5]">
                    {filteredInterests.length === 0 && (
                      <p className="px-3 py-3 text-xs text-gray-400">Tidak ada hasil untuk &ldquo;{interestSearch}&rdquo;.</p>
                    )}
                    {filteredInterests.slice(0, 12).map((interest) => (
                      <button
                        key={interest.name}
                        onClick={() => { onChange({ detailedTargeting: [...data.detailedTargeting, interest.name] }); setInterestSearch(""); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between gap-2"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm text-[#1c2b33] font-medium truncate">{interest.name}</span>
                          <span className="block text-[11px] text-gray-400 truncate">{interest.path}</span>
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_BADGE[interest.type]}`}>
                          {interest.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {!interestSearch && (
                  <p className="text-[11px] text-gray-400">
                    Ketik untuk mencari di antara {META_DETAILED_TARGETING.length} opsi Minat, Perilaku &amp; Demografi.
                  </p>
                )}
              </div>

              {/* Bahasa */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bahasa</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOCK_LANGUAGES.map((lang) => {
                    const sel = data.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => onChange({
                          languages: sel ? data.languages.filter((l) => l !== lang) : [...data.languages, lang],
                        })}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                          sel ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]" : "border-[#dddfe2] text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Penempatan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-3">
          <h3 className="font-semibold text-sm text-[#1c2b33]">Penempatan</h3>
          <div className="flex gap-3">
            <button
              onClick={() => onChange({ advantagePlacementsOn: true })}
              className={`flex-1 p-3 rounded-lg border text-left transition-colors ${
                data.advantagePlacementsOn ? "border-[#0866FF] bg-[#e7f0ff]" : "border-[#dddfe2] hover:bg-gray-50"
              }`}
            >
              <p className={`text-sm font-semibold ${data.advantagePlacementsOn ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>
                Penempatan Advantage+
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Meta menampilkan iklan otomatis di tempat berperforma terbaik.</p>
            </button>
            <button
              onClick={() => onChange({ advantagePlacementsOn: false })}
              className={`flex-1 p-3 rounded-lg border text-left transition-colors ${
                !data.advantagePlacementsOn ? "border-[#0866FF] bg-[#e7f0ff]" : "border-[#dddfe2] hover:bg-gray-50"
              }`}
            >
              <p className={`text-sm font-semibold ${!data.advantagePlacementsOn ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>
                Penempatan manual
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Pilih sendiri di mana iklan Anda muncul.</p>
            </button>
          </div>

          {!data.advantagePlacementsOn && (
            <div className="space-y-2 pt-2">
              {PLACEMENT_OPTIONS.map((p) => (
                <label key={p.id} className="flex items-center gap-2.5 text-sm text-[#1c2b33] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.manualPlacements.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange({ manualPlacements: [...data.manualPlacements, p.id] });
                      } else {
                        onChange({ manualPlacements: data.manualPlacements.filter((pl) => pl !== p.id) });
                      }
                    }}
                    className="rounded accent-[#0866FF]"
                  />
                  <span>{p.label}</span>
                  <span className="text-xs text-gray-400">{p.platform}</span>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Pengoptimalan & pengiriman */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
          <h3 className="font-semibold text-sm text-[#1c2b33]">Pengoptimalan &amp; pengiriman</h3>
          <div>
            <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Tujuan performa</label>
            <select
              value={data.performanceGoal}
              onChange={(e) => onChange({ performanceGoal: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] bg-white"
            >
              {goals.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>

          {/* Batas frekuensi (khas Awareness) */}
          {cfg.frequencyControl && (
            <div>
              <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Batas frekuensi</label>
              <div className="flex items-center gap-2 text-sm text-[#1c2b33]">
                <input
                  type="number"
                  min={1}
                  value={data.freqCapImpressions}
                  onChange={(e) => onChange({ freqCapImpressions: Number(e.target.value) })}
                  className="w-16 px-2 py-1.5 border border-[#dddfe2] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
                <span>tayangan setiap</span>
                <input
                  type="number"
                  min={1}
                  value={data.freqCapDays}
                  onChange={(e) => onChange({ freqCapDays: Number(e.target.value) })}
                  className="w-16 px-2 py-1.5 border border-[#dddfe2] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
                <span>hari</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Kontrol frekuensi hanya tersedia untuk tujuan Awareness.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">Strategi penawaran</label>
            <select
              value={data.bidStrategy}
              onChange={(e) => onChange({ bidStrategy: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] bg-white"
            >
              {bidOptions.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {bidOptions.find((b) => b.value === data.bidStrategy)?.desc}
            </p>
          </div>

          {data.bidStrategy !== "LOWEST_COST" ? (
            <div>
              <label className="block text-sm font-medium text-[#1c2b33] mb-1.5">
                {data.bidStrategy === "MIN_ROAS" ? "Nilai ROAS minimum" : "Jumlah kontrol biaya"}
              </label>
              <div className="relative">
                {data.bidStrategy !== "MIN_ROAS" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                )}
                <input
                  type="number"
                  value={data.costPerResultGoal || ""}
                  onChange={(e) => onChange({ costPerResultGoal: Number(e.target.value), costControlEnabled: true })}
                  placeholder={data.bidStrategy === "MIN_ROAS" ? "mis. 2.0" : "Target jumlah"}
                  className={`w-full ${data.bidStrategy === "MIN_ROAS" ? "px-3" : "pl-10 pr-3"} py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]`}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1c2b33] cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.costControlEnabled}
                  onChange={(e) => onChange({ costControlEnabled: e.target.checked })}
                  className="rounded accent-[#0866FF]"
                />
                {cfg.costGoalLabel}
              </label>
              {data.costControlEnabled && (
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={data.costPerResultGoal || ""}
                    onChange={(e) => onChange({ costPerResultGoal: Number(e.target.value) })}
                    placeholder="Target jumlah"
                    className="w-full pl-10 pr-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          className="bg-[#0866FF] hover:bg-[#0757d4] text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          Berikutnya: Iklan
        </button>
      </div>
    </div>
  );
}
