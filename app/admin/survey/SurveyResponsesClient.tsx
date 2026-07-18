"use client";

import { useState } from "react";
import {
  ClipboardCheck, Users, Megaphone, Briefcase, Globe, Share2, Phone,
  Download, Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, Trash2, RotateCcw
} from "lucide-react";

interface SurveyRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  hasAdvertised: string;
  profession: string;
  whatsapp: string;
  hasWebsite: string;
  socialMedia: string;
  createdAt: string;
}

export default function SurveyResponsesClient({ responses: initialResponses }: { responses: SurveyRow[] }) {
  const [responses, setResponses] = useState<SurveyRow[]>(initialResponses);
  const [search, setSearch] = useState("");
  const [filterAdv, setFilterAdv] = useState<"all" | "Pernah" | "Belum Pernah">("all");
  const [filterWeb, setFilterWeb] = useState<"all" | "Punya" | "Belum Punya">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = responses.filter((r) => {
    const matchSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.profession.toLowerCase().includes(search.toLowerCase()) ||
      r.whatsapp.includes(search);
    const matchAdv = filterAdv === "all" || r.hasAdvertised === filterAdv;
    const matchWeb = filterWeb === "all" || r.hasWebsite === filterWeb;
    return matchSearch && matchAdv && matchWeb;
  });

  // Stats
  const total = responses.length;
  const everAdv = responses.filter(r => r.hasAdvertised === "Pernah").length;
  const hasWebsite = responses.filter(r => r.hasWebsite === "Punya").length;
  const professionCounts: Record<string, number> = {};
  responses.forEach(r => {
    professionCounts[r.profession] = (professionCounts[r.profession] || 0) + 1;
  });
  const topProfession = Object.entries(professionCounts).sort((a, b) => b[1] - a[1])[0];

  async function deleteResponse(id: string, name: string) {
    if (!confirm(`Hapus data survei dari "${name}"? Pengguna akan diminta mengisi survei lagi saat masuk dashboard.`)) return;

    try {
      const res = await fetch(`/api/survey?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setResponses(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Gagal menghapus respon.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
  }

  async function resetAll() {
    if (!confirm("Hapus SEMUA data survei dari semua pengguna? Semua pengguna harus mengisi survei ulang. Tindakan ini tidak bisa dibatalkan!")) return;

    try {
      const res = await fetch("/api/survey?all=true", { method: "DELETE" });
      if (res.ok) {
        setResponses([]);
      } else {
        alert("Gagal mereset semua survei.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
  }

  function downloadCSV() {
    const headers = ["Nama", "Email", "Pernah Beriklan", "Profesi", "WhatsApp", "Punya Website", "Sosial Media", "Tanggal Isi"];
    const rows = filtered.map(r => [
      r.userName, r.userEmail, r.hasAdvertised, r.profession,
      r.whatsapp, r.hasWebsite, r.socialMedia,
      new Date(r.createdAt).toLocaleString("id-ID")
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-[#0866FF]" /> Data Survei Pengguna
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Semua jawaban survei profil yang telah diisi pengguna.</p>
        </div>
        <div className="flex items-center gap-2">
          {responses.length > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-750 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm text-red-600"
            >
              <RotateCcw className="w-4 h-4" /> Reset Semua
            </button>
          )}
          {filtered.length > 0 && (
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0866FF]" />
            <p className="text-xs text-gray-400 font-semibold">Total Responden</p>
          </div>
          <p className="text-3xl font-extrabold text-[#0866FF]">{total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-gray-400 font-semibold">Pernah Beriklan</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-500">{everAdv}</p>
          <p className="text-[10px] text-gray-400">{total > 0 ? Math.round((everAdv/total)*100) : 0}% dari total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-gray-400 font-semibold">Punya Website</p>
          </div>
          <p className="text-3xl font-extrabold text-amber-500">{hasWebsite}</p>
          <p className="text-[10px] text-gray-400">{total > 0 ? Math.round((hasWebsite/total)*100) : 0}% dari total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-purple-500" />
            <p className="text-xs text-gray-400 font-semibold">Profesi Terbanyak</p>
          </div>
          <p className="text-sm font-bold text-[#1c2b33] leading-snug">{topProfession?.[0] ?? "—"}</p>
          {topProfession && <p className="text-[10px] text-gray-400">{topProfession[1]} orang</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari nama, email, profesi, WA..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1"
          />
        </div>
        <select
          value={filterAdv}
          onChange={e => setFilterAdv(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0866FF]"
        >
          <option value="all">Semua (Beriklan)</option>
          <option value="Pernah">Pernah Beriklan</option>
          <option value="Belum Pernah">Belum Pernah</option>
        </select>
        <select
          value={filterWeb}
          onChange={e => setFilterWeb(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0866FF]"
        >
          <option value="all">Semua (Website)</option>
          <option value="Punya">Punya Website</option>
          <option value="Belum Punya">Belum Punya</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} dari {total} responden</span>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <ClipboardCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">
            {total === 0 ? "Belum ada pengguna yang mengisi survei." : "Tidak ada hasil yang sesuai filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Pengguna</th>
                  <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Beriklan</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Profesi</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">WhatsApp</th>
                  <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Website</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Sosmed</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <>
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-[#1c2b33] truncate max-w-[140px]">{r.userName}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{r.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.hasAdvertised === "Pernah" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" /> Pernah
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">
                            <XCircle className="w-3 h-3" /> Belum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-gray-700">{r.profession}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-700 font-mono">{r.whatsapp}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.hasWebsite === "Punya" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-[#0866FF] px-2 py-0.5 rounded-lg">
                            <Globe className="w-3 h-3" /> Punya
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 truncate max-w-[120px] block">{r.socialMedia || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteResponse(r.id, r.userName);
                            }}
                            className="p-1 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Respon"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                          <div className="text-gray-400">
                            {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedId === r.id && (
                      <tr key={r.id + "-expanded"}>
                        <td colSpan={8} className="px-4 py-4 bg-[#f7f9ff] border-b border-gray-100">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {[
                              { icon: Megaphone, label: "Pernah Beriklan", value: r.hasAdvertised, color: "text-emerald-600" },
                              { icon: Briefcase, label: "Profesi", value: r.profession, color: "text-purple-600" },
                              { icon: Phone, label: "WhatsApp", value: r.whatsapp, color: "text-green-600" },
                              { icon: Globe, label: "Punya Website", value: r.hasWebsite, color: "text-[#0866FF]" },
                              { icon: Share2, label: "Sosial Media", value: r.socialMedia || "Tidak diisi", color: "text-pink-500" },
                            ].map(({ icon: Icon, label, value, color }) => (
                              <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 space-y-1">
                                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${color}`}>
                                  <Icon className="w-3 h-3" /> {label}
                                </div>
                                <p className="text-xs font-semibold text-[#1c2b33] break-words">{value}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
