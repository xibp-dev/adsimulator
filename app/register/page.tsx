"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && typeof data.error === 'object') {
          // Flatten validation errors
          const errorMsg = Object.values(data.error).flat().join(", ");
          setError(errorMsg || "Pendaftaran gagal");
        } else {
          setError(data.error || "Pendaftaran gagal");
        }
        setLoading(false);
      } else {
        // Redirect to login after successful registration
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada jaringan.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center px-4">
      {/* Disclaimer banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 text-center max-w-md">
        Simulator — bukan iklan asli, tidak ada biaya nyata. AdSimulator adalah tools edukasi independen.
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#dddfe2] w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-[#0866FF] rounded-lg flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1c2b33]">AdSimulator</span>
        </div>

        <h1 className="text-xl font-semibold text-[#1c2b33] mb-1 text-center">Buat Akun Baru</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Daftar untuk mengakses Simulator</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1c2b33] mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              required
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c2b33] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c2b33] mb-1">Kata sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0866FF] hover:bg-[#0757d4] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar Akun"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#0866FF] hover:underline font-medium">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
