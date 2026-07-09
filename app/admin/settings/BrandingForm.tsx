"use client";

import { useState, useTransition } from "react";
import { saveSeoSettings } from "./actions";
import { SiteSettings } from "@/lib/siteSettings";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Row, UploadRow } from "./fields";

export default function BrandingForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("logoUrl", logoUrl);
    formData.set("faviconUrl", faviconUrl);
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
      <UploadRow
        label="Logo Situs"
        name="logoUrl"
        value={logoUrl}
        onChange={setLogoUrl}
        hint="Logo utama yang muncul di sidebar dan topbar. Direkomendasikan gambar landscape atau persegi transparan PNG."
      />
      <UploadRow
        label="Favicon Situs"
        name="faviconUrl"
        value={faviconUrl}
        onChange={setFaviconUrl}
        hint="Ikon tab browser (Favicon). Format file ICO atau PNG (32x32px)."
      />
      <Row label="Google Tag Manager ID" name="gtmContainerId" defaultValue={settings.gtmContainerId ?? ""}
        hint="Container ID GTM, format GTM-XXXXXXX. Kosongkan untuk menonaktifkan. Dapatkan dari tagmanager.google.com." />

      <div className="flex items-center justify-between pt-2">
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" /> Branding & integrasi tersimpan
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
          {isPending ? "Menyimpan..." : "Simpan Branding"}
        </button>
      </div>
    </form>
  );
}
