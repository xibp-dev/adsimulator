"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Pendaftaran berhasil! Silakan masuk.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
    } else {
      const meRes = await fetch("/api/auth/session");
      const session = await meRes.json();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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

        <h1 className="text-xl font-semibold text-[#1c2b33] mb-1 text-center">Masuk ke Akun Anda</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Ads Manager Simulator</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
            />
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-700">
              {successMsg}
            </div>
          )}

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
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#0866FF] hover:underline font-medium">
            Daftar di sini
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-[#dddfe2]">
          <p className="text-xs text-gray-400 text-center mb-2">Akun demo:</p>
          <div className="text-xs text-gray-500 space-y-1 text-center">
            <p>Admin: <span className="font-mono">meremember6@gmail.com</span> / <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
