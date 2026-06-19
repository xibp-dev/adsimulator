"use client";

import { useState, useRef, useTransition } from "react";
import { changePassword } from "./actions";
import { KeyRound, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SecurityForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changePassword(formData);
      if (result.success) {
        setStatus("success");
        formRef.current?.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Gagal mengubah kata sandi");
      }
    });
  }

  const input =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Kata sandi saat ini</label>
        <input type="password" name="current" placeholder="••••••••" className={input} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Kata sandi baru</label>
        <input type="password" name="next" placeholder="Minimal 6 karakter" className={input} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Ulangi kata sandi baru</label>
        <input type="password" name="confirm" placeholder="••••••••" className={input} />
      </div>

      <div className="flex items-center justify-between pt-1">
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" /> Kata sandi berhasil diubah
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
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          {isPending ? "Menyimpan..." : "Ubah Kata Sandi"}
        </button>
      </div>
    </form>
  );
}
