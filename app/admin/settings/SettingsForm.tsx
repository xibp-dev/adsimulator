"use client";

import { useState, useTransition } from "react";
import { saveSeoSettings } from "./actions";
import { SiteSettings } from "@/lib/siteSettings";
import { Save, CheckCircle, AlertCircle, Loader2, Upload, Trash2 } from "lucide-react";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(settings.ogImageUrl ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("logoUrl", logoUrl);
    formData.set("faviconUrl", faviconUrl);
    formData.set("ogImageUrl", ogImageUrl);
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
      
      {/* Upload Logo */}
      <UploadRow
        label="Logo Situs"
        name="logoUrl"
        value={logoUrl}
        onChange={setLogoUrl}
        hint="Logo utama yang muncul di sidebar dan topbar. Direkomendasikan gambar landscape atau persegi transparan PNG."
      />

      {/* Upload Favicon */}
      <UploadRow
        label="Favicon Situs"
        name="faviconUrl"
        value={faviconUrl}
        onChange={setFaviconUrl}
        hint="Ikon tab browser (Favicon). Format file ICO atau PNG (32x32px)."
      />

      <Row label="Title (Judul SEO)" name="title" defaultValue={settings.title}
        hint="Muncul di hasil pencarian Google. Optimal 50–60 karakter." maxLength={70} />
      <TextareaRow label="Description (Deskripsi SEO)" name="description" defaultValue={settings.description}
        hint="Teks di bawah judul di Google. Optimal 120–160 karakter." maxLength={200} />
      <TextareaRow label="Keywords" name="keywords" defaultValue={settings.keywords}
        hint="Kata kunci dipisah koma. Minimal 10, maksimal 25 kata kunci." rows={4} />
      {/* Upload OG Image */}
      <UploadRow
        label="OG Image (Gambar SEO)"
        name="ogImageUrl"
        value={ogImageUrl}
        onChange={setOgImageUrl}
        hint="Gambar yang muncul di Google & media sosial saat link dibagikan. Ukuran ideal: 1200×630px."
        accept="image/jpeg,image/png,image/webp"
        previewClass="max-h-20"
      />

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

function UploadRow({
  label, name, value, onChange, hint, accept, previewClass,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; hint?: string; accept?: string; previewClass?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mengunggah file");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors"
        />
        
        <label className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors flex-shrink-0">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0866FF]" />
          ) : (
            <Upload className="w-4 h-4 text-gray-500" />
          )}
          <span>{uploading ? "Mengunggah..." : "Pilih File"}</span>
          <input
            type="file"
            accept={accept ?? "image/*,.ico"}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors flex-shrink-0"
            title="Hapus gambar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}

      {value && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl inline-block">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Preview</p>
          <img src={value} alt="Preview" className={`object-contain rounded border border-gray-200 ${previewClass ?? "max-h-12"}`} />
        </div>
      )}
    </div>
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
