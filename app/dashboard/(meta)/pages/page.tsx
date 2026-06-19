"use client";

import { useState, useEffect } from "react";
import { 
  Flag, 
  Tag, 
  BookOpen, 
  HelpCircle,
  Plus,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  User,
  Image as ImageIcon,
  Lock
} from "lucide-react";
import Link from "next/link";

interface Fanspage {
  id: string;
  name: string;
  category: string;
  bio: string;
  createdAt: string;
}

export default function FanspagePage() {
  const [pages, setPages] = useState<Fanspage[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bisnis Lokal");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);

  const categories = [
    "Bisnis Lokal",
    "Pakaian (Merek)",
    "Belanja & E-commerce",
    "Restoran / Cafe",
    "Kreator Digital",
    "Agensi Pemasaran",
    "Lainnya"
  ];

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const checkPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setHasPortfolio(data.length > 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkPortfolio();
    fetchPages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, bio }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          const errors = Object.values(data.error).flat().join(", ");
          setErrorMsg(errors);
        } else {
          setErrorMsg(data.error || "Gagal membuat Halaman Fanspage");
        }
      } else {
        setSuccessMsg(`Halaman "${data.name}" berhasil dibuat!`);
        setName("");
        setBio("");
        fetchPages();
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPortfolio === null) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (hasPortfolio === false) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-[#dddfe2] rounded-xl shadow-sm max-w-2xl w-full p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1c2b33]">Halaman Fanspage Terkunci</h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Anda wajib membuat <strong className="font-bold text-gray-800">Portofolio Bisnis</strong> terlebih dahulu sebelum diizinkan mengonfigurasi Halaman Fanspage.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Kembali ke Beranda
            </Link>
            <Link href="/dashboard/business-settings" className="bg-[#0866FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow">
              Buat Portofolio Bisnis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#dddfe2]">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Langkah 2 dari 4</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <Flag className="w-6 h-6 text-emerald-600" />
              Simulasi Pembuatan Halaman Fanspage
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Educational Guide */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1c2b33] flex items-center gap-2 text-sm border-b border-gray-100 pb-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Mengapa Perlu Halaman Fanspage?
            </h3>
            
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p>
                Di platform Meta (Facebook & Instagram), Anda <strong className="font-bold text-gray-800">tidak bisa</strong> beriklan dengan akun profil personal biasa. Iklan harus keluar di bawah bendera halaman resmi, yang disebut <strong className="font-bold text-gray-800">Fanspage / Facebook Page</strong>.
              </p>
              <p>
                Fungsi Fanspage dalam Iklan:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Sebagai identitas pengirim iklan di beranda/feed audiens.</li>
                <li>Menjadi wadah untuk membalas komentar iklan.</li>
                <li>Mengumpulkan statistik pengikut dan brand presence Anda.</li>
              </ul>
              <p className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg border border-emerald-100 font-medium">
                💡 <strong className="font-bold text-emerald-900">Tips:</strong> Buat nama halaman yang jelas, tepercaya, dan cocok dengan kategori produk Anda agar audiens lebih yakin saat mengeklik iklan.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form and List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creation Form */}
          <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1c2b33] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-700" />
              Form Halaman Baru (Simulator)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Nama Halaman</label>
                <input
                  type="text"
                  placeholder="Contoh: Hijab Cantik Nusantara / Gadget Center Indonesia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase">Kategori Halaman</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase">Bio / Keterangan Singkat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Menyediakan fashion muslim premium berkualitas"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                  />
                </div>
              </div>

              {/* Mock Upload Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-1.5"><User className="w-3.5 h-3.5" /> Foto Profil (Mockup)</label>
                  <div className="border border-dashed border-gray-300 rounded px-3 py-2 text-xs text-gray-400 bg-white text-center cursor-not-allowed">
                    Default Avatar (Simulator)
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-1.5"><ImageIcon className="w-3.5 h-3.5" /> Foto Sampul/Cover (Mockup)</label>
                  <div className="border border-dashed border-gray-300 rounded px-3 py-2 text-xs text-gray-400 bg-white text-center cursor-not-allowed">
                    Default Cover Banner (Simulator)
                  </div>
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
                Buat Halaman Fanspage
              </button>
            </form>
          </div>

          {/* List of Pages */}
          <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1c2b33]">
              Halaman Fanspage Anda ({pages.length})
            </h2>

            {fetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <Flag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada halaman fanspage yang dibuat.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((page) => (
                  <div key={page.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 relative overflow-hidden flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 font-bold uppercase">
                      {page.name.charAt(0)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-[#1c2b33] truncate">{page.name}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" /> {page.category}
                      </p>
                      {page.bio && <p className="text-xs text-gray-400 italic truncate">"{page.bio}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions to next step */}
          {pages.length > 0 && (
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/business-settings"
                className="text-gray-600 hover:text-gray-800 text-sm font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <Link
                href="/dashboard/pixels"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Lanjut ke Langkah 3: Setup Pixel Tracker
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
