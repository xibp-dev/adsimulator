"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Gagal menyimpan");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Nama lengkap</label>
        <input
          type="text"
          name="name"
          defaultValue={name}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={email}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1.5">Email dipakai untuk masuk ke akun.</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" /> Profil tersimpan
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
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-xs text-gray-400">
          Catatan: nama di pojok kanan atas baru ikut berubah setelah kamu masuk ulang.
        </p>
      )}
    </form>
  );
}
