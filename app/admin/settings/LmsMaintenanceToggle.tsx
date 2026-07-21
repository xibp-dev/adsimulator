"use client";

import { useState, useTransition } from "react";
import { setLmsMaintenance } from "./actions";
import { Wrench, Loader2, CheckCircle } from "lucide-react";

export default function LmsMaintenanceToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSaved(false);
    startTransition(async () => {
      const res = await setLmsMaintenance(next);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setEnabled(!next);
      }
    });
  }

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${enabled ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-white"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${enabled ? "bg-amber-100" : "bg-gray-100"}`}>
        <Wrench className={`w-5 h-5 ${enabled ? "text-amber-600" : "text-gray-500"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#1c2b33]">Mode Pemeliharaan Premium</p>
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
          {saved && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> Tersimpan</span>}
          {enabled && !isPending && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-700">AKTIF</span>}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {enabled
            ? "Halaman Kelas, Webinar, dan Sertifikasi menampilkan halaman pemeliharaan untuk semua pengguna (termasuk yang sudah langganan)."
            : "Fitur premium (Kelas, Webinar, Sertifikasi) berjalan normal dan dapat diakses pengguna."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        disabled={isPending}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 ${enabled ? "bg-amber-500" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
