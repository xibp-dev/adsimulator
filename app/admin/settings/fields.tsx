"use client";

import { useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";

export const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors";

export function Row({
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
      <input type="text" name={name} value={val} onChange={(e) => setVal(e.target.value)} className={inputCls} />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export function TextareaRow({
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
      <textarea name={name} value={val} onChange={(e) => setVal(e.target.value)} rows={rows} className={`${inputCls} resize-none`} />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export function UploadRow({
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah file");
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
          className={`flex-1 ${inputCls}`}
        />
        <label className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors flex-shrink-0">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[#0866FF]" /> : <Upload className="w-4 h-4 text-gray-500" />}
          <span>{uploading ? "Mengunggah..." : "Pilih File"}</span>
          <input type="file" accept={accept ?? "image/*,.ico"} className="hidden" onChange={handleFileChange} disabled={uploading} />
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
