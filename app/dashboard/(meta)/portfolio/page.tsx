"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Mail, 
  CheckCircle2, 
  HelpCircle,
  Plus,
  Loader2,
  Building,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Portfolio {
  id: string;
  name: string;
  businessEmail: string;
  createdAt: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPortfolios = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, businessEmail: email }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          const errors = Object.values(data.error).flat().join(", ");
          setErrorMsg(errors);
        } else {
          setErrorMsg(data.error || "Gagal membuat portofolio");
        }
      } else {
        setSuccessMsg(`Portofolio "${data.name}" berhasil dibuat!`);
        setName("");
        setEmail("");
        fetchPortfolios();
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#dddfe2]">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Langkah 1 dari 4</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Simulasi Setup Portofolio Bisnis (Business Suite)
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Educational Guide */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1c2b33] flex items-center gap-2 text-sm border-b border-gray-100 pb-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Apa itu Portofolio Bisnis Meta?
            </h3>
            
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p>
                Di dunia nyata Meta Ads, <strong className="font-bold text-gray-800">Portofolio Bisnis (sebelumnya Meta Business Manager / Suite)</strong> adalah wadah pusat organisasi untuk mengelola seluruh aset digital Anda.
              </p>
              <p>
                Alih-alih menggunakan akun pribadi, portofolio bisnis menyatukan:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Halaman Fanspage</li>
                <li>Akun Iklan (Ad Accounts)</li>
                <li>Meta Pixel & Dataset</li>
                <li>Akses Karyawan / Agensi</li>
              </ul>
              <p className="bg-blue-50 text-blue-700 p-2.5 rounded-lg border border-blue-100 font-medium">
                💡 <strong className="font-bold text-blue-900">Tips:</strong> Selalu buat Portofolio Bisnis terpisah untuk setiap lini brand atau klien yang Anda kelola agar aset tidak tercampur.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form and List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creation Form */}
          <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1c2b33] flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-700" />
              Buat Portofolio Baru (Simulator)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Nama Bisnis / Portofolio</label>
                <input
                  type="text"
                  placeholder="Contoh: Metalabs Digital Agency / Toko Baju Sukses"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Email Bisnis Resmi</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Contoh: info@metalabs.co.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                    required
                  />
                </div>
              </div>

              {errorMsg && <p className="text-red-500 text-xs font-medium">{errorMsg}</p>}
              {successMsg && <p className="text-emerald-600 text-xs font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {successMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#0866FF] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Buat Portofolio
              </button>
            </form>
          </div>

          {/* List of portfolios */}
          <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1c2b33]">
              Portofolio Bisnis Anda ({portfolios.length})
            </h2>

            {fetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada portofolio bisnis yang dibuat.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-bl">
                      Simulator Verified
                    </div>
                    <h4 className="font-bold text-sm text-[#1c2b33]">{portfolio.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {portfolio.businessEmail}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Dibuat pada: {new Date(portfolio.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions to next step */}
          {portfolios.length > 0 && (
            <div className="flex justify-end">
              <Link
                href="/dashboard/pages"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Lanjut ke Langkah 2: Buat Halaman Fanspage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
