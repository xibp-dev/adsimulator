"use client";

import { useState, useTransition } from "react";
import { saveSeoSettings } from "./actions";
import { SiteSettings } from "@/lib/siteSettings";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Row, TextareaRow, UploadRow } from "./fields";

export default function SeoForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState(settings.ogImageUrl ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
      <Row label="Title (Judul SEO)" name="title" defaultValue={settings.title}
        hint="Muncul di hasil pencarian Google. Optimal 50–60 karakter." maxLength={70} />
      <TextareaRow label="Description (Deskripsi SEO)" name="description" defaultValue={settings.description}
        hint="Teks di bawah judul di Google. Optimal 120–160 karakter." maxLength={200} />
      <TextareaRow label="Keywords" name="keywords" defaultValue={settings.keywords}
        hint="Kata kunci dipisah koma. Minimal 10, maksimal 25 kata kunci." rows={4} />
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
          {isPending ? "Menyimpan..." : "Simpan SEO"}
        </button>
      </div>
    </form>
  );
}
