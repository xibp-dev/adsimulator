"use client";

import { useState, useEffect } from "react";
import { CampaignFormData } from "./CreateCampaignFlow";
import { MOCK_PAGES, MOCK_INSTAGRAM, CTA_OPTIONS, MOCK_INSTANT_FORMS } from "@/lib/mockData";
import { CTA } from "@/types";
import { ImagePlus, Loader2 } from "lucide-react";

interface Props {
  data: CampaignFormData;
  onChange: (p: Partial<CampaignFormData>) => void;
  onPublish: () => void;
  publishing: boolean;
}

// Tentukan tipe tujuan iklan berdasarkan tujuan kampanye + lokasi konversi
function getDestinationType(objective: string, conversionLocation: string): string {
  if (objective === "APP_PROMOTION") return "APP";
  if (objective === "LEADS" && conversionLocation === "MESSENGER") return "INSTANT_FORM";
  switch (conversionLocation) {
    case "APP": return "APP";
    case "WHATSAPP": return "WHATSAPP";
    case "CALLS": return "CALLS";
    case "MESSENGER": return "MESSENGER";
    default: return "WEBSITE";
  }
}

export default function StepAd({ data, onChange, onPublish, publishing }: Props) {
  const destType = getDestinationType(data.objective, data.conversionLocation);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((dbPages) => {
        if (Array.isArray(dbPages) && dbPages.length > 0) {
          setPages(dbPages.map((p) => p.name));
        } else {
          setPages(MOCK_PAGES);
        }
      })
      .catch(() => setPages(MOCK_PAGES));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan iklan</h2>
        <span className="text-xs text-gray-400">Level iklan</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Buat tampilan iklan yang dilihat audiens Anda.</p>

      <div className="space-y-5">
        {/* Nama iklan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Nama iklan</label>
          <input
            type="text"
            value={data.adName}
            onChange={(e) => onChange({ adName: e.target.value })}
            placeholder="Iklan 1"
            className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          />
        </section>

        {/* Identitas */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-3">
          <h3 className="font-semibold text-sm text-[#1c2b33]">Identitas</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Halaman Facebook</label>
            <select
              value={data.identityPage}
              onChange={(e) => onChange({ identityPage: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            >
              <option value="">Pilih Halaman</option>
              {pages.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Akun Instagram</label>
            <select
              value={data.identityInstagram}
              onChange={(e) => onChange({ identityInstagram: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            >
              <option value="">Pilih akun Instagram</option>
              {MOCK_INSTAGRAM.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </section>

        {/* Penyiapan iklan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <h3 className="font-semibold text-sm text-[#1c2b33] mb-3">Penyiapan iklan</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "CREATE", label: "Buat iklan", desc: "Unggah media dan tulis teks baru" },
              { value: "EXISTING_POST", label: "Gunakan postingan yang ada", desc: "Promosikan postingan Halaman Anda" },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => onChange({ adSetupMode: m.value as "CREATE" | "EXISTING_POST" })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  data.adSetupMode === m.value ? "border-[#0866FF] bg-[#e7f0ff]" : "border-[#dddfe2] hover:bg-gray-50"
                }`}
              >
                <p className={`text-sm font-semibold ${data.adSetupMode === m.value ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Format */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <h3 className="font-semibold text-sm text-[#1c2b33] mb-3">Format</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "SINGLE_IMAGE_VIDEO", label: "Gambar atau video tunggal" },
              { value: "CAROUSEL", label: "Carousel" },
              { value: "COLLECTION", label: "Koleksi" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => onChange({ format: f.value as "SINGLE_IMAGE_VIDEO" | "CAROUSEL" | "COLLECTION" })}
                className={`p-3 rounded-lg border text-sm font-medium text-center transition-colors ${
                  data.format === f.value ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]" : "border-[#dddfe2] text-[#1c2b33] hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Materi iklan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <h3 className="font-semibold text-sm text-[#1c2b33] mb-3">Materi iklan</h3>
          <div className="border-2 border-dashed border-[#dddfe2] rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1c2b33]">Tambahkan media</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, MP4 · Simulator (tanpa unggahan asli)</p>
          </div>
        </section>

        {/* Teks iklan */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
          <h3 className="font-semibold text-sm text-[#1c2b33]">Teks iklan</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Teks utama</label>
            <textarea
              value={data.primaryText}
              onChange={(e) => onChange({ primaryText: e.target.value })}
              placeholder="Beri tahu orang tentang iklan Anda..."
              rows={3}
              className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Judul</label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="Tulis judul Anda di sini"
              className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi</label>
            <input
              type="text"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Deskripsi opsional"
              className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            />
          </div>
        </section>

        {/* Tujuan — adaptif sesuai tujuan kampanye & lokasi konversi */}
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
          <h3 className="font-semibold text-sm text-[#1c2b33]">Tujuan</h3>

          {destType === "WEBSITE" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">URL situs web</label>
              <input
                type="url"
                value={data.destinationUrl}
                onChange={(e) => onChange({ destinationUrl: e.target.value })}
                placeholder="https://situsanda.com"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              />
            </div>
          )}

          {destType === "INSTANT_FORM" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Formulir instan</label>
              <div className="flex gap-2">
                <select
                  value={data.instantForm}
                  onChange={(e) => onChange({ instantForm: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                >
                  <option value="">Pilih formulir</option>
                  {MOCK_INSTANT_FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <button className="px-3 py-2 text-sm font-medium text-[#0866FF] border border-[#0866FF] rounded-lg hover:bg-[#e7f0ff]">
                  + Buat formulir
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Prospek mengisi formulir tanpa meninggalkan Facebook/Instagram.</p>
            </div>
          )}

          {destType === "APP" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tautan dalam aplikasi (deep link)</label>
              <input
                type="text"
                value={data.appDeepLink}
                onChange={(e) => onChange({ appDeepLink: e.target.value })}
                placeholder="myapp://produk/123 (opsional)"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Pengguna diarahkan ke {data.appToPromote || "aplikasi Anda"} di toko aplikasi.</p>
            </div>
          )}

          {destType === "WHATSAPP" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={data.contactNumber}
                  onChange={(e) => onChange({ contactNumber: e.target.value })}
                  placeholder="+62 812 3456 7890"
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Pesan pembuka</label>
                <input
                  type="text"
                  value={data.messengerGreeting}
                  onChange={(e) => onChange({ messengerGreeting: e.target.value })}
                  className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                />
              </div>
            </>
          )}

          {destType === "CALLS" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nomor telepon</label>
              <input
                type="tel"
                value={data.contactNumber}
                onChange={(e) => onChange({ contactNumber: e.target.value })}
                placeholder="+62 21 1234 5678"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              />
              <p className="text-xs text-gray-400 mt-1">Orang menelepon bisnis Anda langsung dari iklan.</p>
            </div>
          )}

          {destType === "MESSENGER" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Pesan pembuka Messenger</label>
              <textarea
                value={data.messengerGreeting}
                onChange={(e) => onChange({ messengerGreeting: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] resize-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tombol ajakan bertindak</label>
            <select
              value={data.cta}
              onChange={(e) => onChange({ cta: e.target.value as CTA })}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            >
              {CTA_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </section>

        {/* Pelacakan — hanya untuk tujuan Website/App */}
        {(destType === "WEBSITE" || destType === "APP") && (
        <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
          <h3 className="font-semibold text-sm text-[#1c2b33] mb-1">Pelacakan</h3>
          <p className="text-xs text-gray-500 mb-3">Parameter URL untuk melacak sumber trafik (opsional).</p>
          <input
            type="text"
            value={data.trackingUrlParams}
            onChange={(e) => onChange({ trackingUrlParams: e.target.value })}
            placeholder="utm_source=facebook&utm_medium=cpc"
            className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
          />
        </section>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onPublish}
          disabled={publishing}
          className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          {publishing && <Loader2 className="w-4 h-4 animate-spin" />}
          {publishing ? "Memublikasikan..." : "Publikasikan"}
        </button>
      </div>
    </div>
  );
}
