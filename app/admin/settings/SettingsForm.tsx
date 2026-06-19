"use client";

import { useState, useTransition } from "react";
import { saveSeoSettings } from "./actions";
import { SiteSettings } from "@/lib/siteSettings";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveSeoSettings(formData);
      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Gagal menyimpan");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Row label="URL Situs" name="siteUrl" defaultValue={settings.siteUrl}
        hint="Domain aktif tanpa trailing slash. Contoh: https://adsimulator.web.id" />
      <Row label="Nama Situs" name="siteName" defaultValue={settings.siteName}
        hint="Nama pendek yang muncul di tab browser dan template judul." />
      <Row label="Title (Judul SEO)" name="title" defaultValue={settings.title}
        hint="Muncul di hasil pencarian Google. Optimal 50–60 karakter." maxLength={70} />
      <TextareaRow label="Description (Deskripsi SEO)" name="description" defaultValue={settings.description}
        hint="Teks di bawah judul di Google. Optimal 120–160 karakter." maxLength={200} />
      <TextareaRow label="Keywords" name="keywords" defaultValue={settings.keywords}
        hint="Kata kunci dipisah koma. Minimal 10, maksimal 25 kata kunci." rows={4} />
      <Row label="URL OG Image" name="ogImageUrl" defaultValue={settings.ogImageUrl}
        hint="Path gambar preview saat link dibagikan (1200×630px). Simpan di /public/" />

      <div className="flex items-center justify-between pt-2">
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" /> Pengaturan SEO berhasil disimpan
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}
        {status === "idle" && <span />}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm shadow-[#0866FF]/20 transition-colors"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}

function Row({
  label, name, defaultValue, hint, maxLength,
}: {
  label: string; name: string; defaultValue: string; hint?: string; maxLength?: number;
}) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-[#1c2b33]">{label}</label>
        {maxLength && (
          <span className={`text-xs ${val.length > maxLength ? "text-red-500" : "text-gray-400"}`}>
            {val.length}/{maxLength}
          </span>
        )}
      </div>
      <input
        type="text"
        name={name}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors"
      />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function TextareaRow({
  label, name, defaultValue, hint, maxLength, rows = 3,
}: {
  label: string; name: string; defaultValue: string; hint?: string; maxLength?: number; rows?: number;
}) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-[#1c2b33]">{label}</label>
        {maxLength && (
          <span className={`text-xs ${val.length > maxLength ? "text-red-500" : "text-gray-400"}`}>
            {val.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        name={name}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={rows}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors resize-none"
      />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}
