"use client";

import { useState, useTransition } from "react";
import { setSurveyEnabled } from "./actions";
import { ClipboardCheck, Loader2, CheckCircle } from "lucide-react";

export default function SurveyToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSaved(false);
    startTransition(async () => {
      const res = await setSurveyEnabled(next);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setEnabled(!next); // revert on fail
      }
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ClipboardCheck className="w-5 h-5 text-[#0866FF]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#1c2b33]">Survei Pengguna Baru</p>
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
          {saved && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> Tersimpan</span>}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {enabled
            ? "Popup survei profil akan muncul untuk pengguna yang masuk ke dashboard dan belum pernah mengisinya."
            : "Survei dinonaktifkan — popup tidak akan muncul untuk pengguna."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        disabled={isPending}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 ${enabled ? "bg-[#0866FF]" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
