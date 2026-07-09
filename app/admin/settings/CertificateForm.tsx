"use client";

import { useState, useTransition } from "react";
import { saveCertificateSettings } from "./actions";
import { SiteSettings } from "@/lib/siteSettings";
import { Save, CheckCircle, AlertCircle, Loader2, Upload, Trash2, Layers } from "lucide-react";

export default function CertificateForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [institution, setInstitution] = useState(settings.certInstitution || "AdSimulator Academy");
  const [signatory, setSignatory] = useState(settings.certSignatory || "AdSimulator Academy");
  const [signatoryTitle, setSignatoryTitle] = useState(settings.certSignatoryTitle || "Penyelenggara");
  const [logoUrl, setLogoUrl] = useState(settings.certLogoUrl || "");
  const [accent, setAccent] = useState(settings.certAccent || "#0866FF");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErrorMsg("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah");
      setLogoUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah logo");
    } finally {
      setUploading(false);
    }
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("certInstitution", institution);
    fd.set("certSignatory", signatory);
    fd.set("certSignatoryTitle", signatoryTitle);
    fd.set("certLogoUrl", logoUrl);
    fd.set("certAccent", accent);
    startTransition(async () => {
      const result = await saveCertificateSettings(fd);
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
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kolom input */}
      <div className="space-y-4">
        <Field label="Nama Lembaga / Penerbit" hint="Muncul di header sertifikat (jika logo kosong).">
          <input value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputCls} placeholder="AdSimulator Academy" />
        </Field>
        <Field label="Nama Penandatangan" hint="Muncul di atas garis tanda tangan.">
          <input value={signatory} onChange={(e) => setSignatory(e.target.value)} className={inputCls} placeholder="AdSimulator Academy" />
        </Field>
        <Field label="Jabatan Penandatangan" hint="Contoh: Direktur, Instruktur, Penyelenggara.">
          <input value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} className={inputCls} placeholder="Penyelenggara" />
        </Field>

        <Field label="Warna Aksen" hint="Warna garis, judul kelas, dan header sertifikat.">
          <div className="flex items-center gap-3">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
            <input value={accent} onChange={(e) => setAccent(e.target.value)} className={inputCls} placeholder="#0866FF" />
          </div>
        </Field>

        <Field label="Logo Lembaga (opsional)" hint="Jika diisi, menggantikan ikon + nama lembaga di header. PNG transparan disarankan.">
          <div className="flex items-center gap-3">
            <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className={`${inputCls} flex-1`} />
            <label className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 flex-shrink-0">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[#0866FF]" /> : <Upload className="w-4 h-4 text-gray-500" />}
              <span>{uploading ? "Mengunggah..." : "Pilih"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
            {logoUrl && (
              <button type="button" onClick={() => setLogoUrl("")} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        </Field>

        <div className="flex items-center justify-between pt-2">
          {status === "success" && <div className="flex items-center gap-2 text-sm text-emerald-600"><CheckCircle className="w-4 h-4" /> Tersimpan</div>}
          {status === "error" && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" /> {errorMsg}</div>}
          {status === "idle" && <span />}
          <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Menyimpan..." : "Simpan Desain"}
          </button>
        </div>
      </div>

      {/* Pratinjau langsung — selaras gaya brand sertifikat asli */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Pratinjau</p>
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${accent}, #15233f)` }} />
          {/* Header brand */}
          <div className="relative px-5 py-5 text-center overflow-hidden" style={{ background: `linear-gradient(120deg, #0f1729 0%, #15233f 55%, ${accent} 140%)` }}>
            <div className="absolute -top-8 -right-4 w-24 h-24 rounded-full" style={{ backgroundColor: accent, opacity: 0.3, filter: "blur(28px)" }} />
            <div className="relative flex items-center justify-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="h-7 object-contain" />
              ) : (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent }}>
                  <Layers className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white font-bold text-sm">{institution || "Nama Lembaga"}</span>
            </div>
          </div>
          {/* Body */}
          <div className="px-5 py-6 text-center">
            <p className="text-sm font-extrabold tracking-[0.12em] text-[#1c2b33]">SERTIFIKAT KELULUSAN</p>
            <div className="flex items-center justify-center gap-2 my-2" aria-hidden="true">
              <span className="block h-0.5 w-10 rounded-full" style={{ background: `linear-gradient(to left, ${accent}, transparent)` }} />
              <span className="block w-1.5 h-1.5 rotate-45 rounded-[2px]" style={{ backgroundColor: accent }} />
              <span className="block h-0.5 w-10 rounded-full" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
            </div>
            <p className="text-[10px] text-gray-400">Diberikan kepada</p>
            <p className="text-xl font-extrabold text-[#1c2b33]">Budi Santoso</p>
            <div className="mx-auto mt-1 h-1 w-16 rounded-full" style={{ backgroundColor: accent }} />
            <p className="text-[10px] text-gray-500 mt-2">lulus ujian sertifikasi kelas</p>
            <p className="text-[13px] font-bold" style={{ color: accent }}>Dasar-Dasar Meta Ads</p>
            <div className="mt-4 grid grid-cols-3 items-end gap-2">
              <div className="text-center">
                <div className="mx-auto mb-1 h-px w-16 bg-gray-200" />
                <p className="text-[8px] uppercase tracking-wider text-gray-400">Tanggal</p>
              </div>
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${accent}, ${accent}44, ${accent})` }}>
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                    <Layers className="w-4 h-4" style={{ color: accent }} />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-1 h-px w-16 bg-gray-200" />
                <p className="text-[9px] font-semibold text-[#1c2b33] truncate">{signatory || "Penandatangan"}</p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400">{signatoryTitle || "Jabatan"}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Sertifikat asli lebih detail: watermark brand, daftar kompetensi dari materi kelas, medali nilai berpita, nomor sertifikat &amp; predikat otomatis.</p>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}
