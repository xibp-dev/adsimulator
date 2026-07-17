"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Sparkles, UserPlus, MoreHorizontal, Trash2, X, Loader2 } from "lucide-react";
import { MOCK_CUSTOM_AUDIENCES } from "@/lib/mockData";
import GuidePanel from "@/components/create/GuidePanel";

type AudType = "CUSTOM" | "LOOKALIKE" | "SAVED";

interface Audience {
  id: string;
  name: string;
  type: AudType;
  source: string;
  estimatedSize: number;
  createdAt: string;
}

const TYPE_META: Record<AudType, { label: string; icon: typeof Users; desc: string; color: string }> = {
  CUSTOM: { label: "Khusus", icon: UserPlus, desc: "Jangkau orang yang sudah berinteraksi dengan bisnis Anda.", color: "bg-blue-50 text-blue-600" },
  LOOKALIKE: { label: "Serupa (Lookalike)", icon: Sparkles, desc: "Jangkau orang baru yang mirip pelanggan terbaik Anda.", color: "bg-violet-50 text-violet-600" },
  SAVED: { label: "Tersimpan", icon: Users, desc: "Tetapkan demografi, minat & perilaku untuk dipakai ulang.", color: "bg-emerald-50 text-emerald-600" },
};

const CUSTOM_SOURCES = [
  "Pengunjung Situs Web (30 hari)",
  "Daftar Pelanggan",
  "Interaksi Instagram (365 hari)",
  "Penonton Video (75%)",
  "Interaksi Halaman Facebook",
];
const LOOKALIKE_PCT = ["1%", "2%", "5%", "10%"];

function fmtSize(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  return n.toLocaleString("id-ID");
}

export default function AudiencesView() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState<AudType>("CUSTOM");
  const [name, setName] = useState("");
  const [customSource, setCustomSource] = useState(CUSTOM_SOURCES[0]);
  const [lkBase, setLkBase] = useState(MOCK_CUSTOM_AUDIENCES[0] ?? "Daftar Pelanggan");
  const [lkPct, setLkPct] = useState(LOOKALIKE_PCT[0]);
  const [savedTargeting, setSavedTargeting] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/audiences")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setAudiences(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setType("CUSTOM"); setName(""); setCustomSource(CUSTOM_SOURCES[0]);
    setLkBase(MOCK_CUSTOM_AUDIENCES[0] ?? "Daftar Pelanggan"); setLkPct(LOOKALIKE_PCT[0]);
    setSavedTargeting(""); setErr("");
  }

  function openModal() { resetForm(); setModalOpen(true); }

  async function handleCreate() {
    if (!name.trim()) { setErr("Nama pemirsa wajib diisi."); return; }
    const source =
      type === "CUSTOM" ? customSource :
      type === "LOOKALIKE" ? `Serupa ${lkPct} dari ${lkBase}` :
      savedTargeting.trim() || "Penargetan tersimpan";

    setCreating(true); setErr("");
    try {
      const res = await fetch("/api/audiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), type, source }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setAudiences((prev) => [created, ...prev]);
      setModalOpen(false);
    } catch {
      setErr("Gagal menyimpan pemirsa. Coba lagi.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setMenuOpen(null);
    const prev = audiences;
    setAudiences((a) => a.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await fetch(`/api/audiences?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setAudiences(prev); // rollback
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Pemirsa</h1>
          <p className="text-sm text-gray-400 mt-0.5">Buat dan kelola pemirsa untuk dipakai di kampanye.</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-[#0866FF]/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat pemirsa
        </button>
      </div>

      {/* Guide Panel – Pemirsa */}
      <GuidePanel
        title="🎯 Panduan: Pemirsa (Audiences)"
        summary="Pemirsa adalah kumpulan orang yang ingin kamu targetkan dengan iklan. Meta menawarkan 3 jenis pemirsa utama, masing-masing dengan strategi penggunaan yang berbeda. Membuat pemirsa yang tepat adalah kunci efisiensi biaya iklan."
        tips={[
          {
            field: "Pemirsa Khusus (Custom Audience)",
            what: "Audiens yang dibuat dari data yang sudah kamu miliki: pengunjung website (via Pixel), daftar pelanggan, orang yang sudah berinteraksi dengan konten Instagram/Facebook, atau penonton video.",
            recommendation: "Gunakan untuk RETARGETING — menjangkau kembali orang yang sudah kenal brand kamu tapi belum beli. Ini biasanya paling murah dan konversinya paling tinggi. Buat minimal: 'Pengunjung Website 30 hari' dan 'Interaksi Instagram 90 hari'.",
          },
          {
            field: "Pemirsa Serupa (Lookalike Audience)",
            what: "Meta menganalisis karakteristik pemirsa khusus kamu (source), lalu mencari orang baru yang memiliki profil serupa di seluruh platform. Persentase 1% = paling mirip, 10% = paling luas.",
            recommendation: "Gunakan Lookalike 1% dari 'Pembeli Terakhir 180 hari' untuk prospecting baru yang paling berkualitas. Mulai dari 1%, baru coba 2-5% jika audiens 1% sudah terlalu kecil. Butuh minimal 100 orang di source audience agar akurat.",
          },
          {
            field: "Pemirsa Tersimpan (Saved Audience)",
            what: "Kombinasi targeting berdasarkan demografi (usia, gender, lokasi), minat, dan perilaku yang disimpan untuk digunakan berulang kali di berbagai kampanye.",
            recommendation: "Gunakan untuk cold audience baru yang belum pernah mengenal brand kamu. Simpan kombinasi targeting yang terbukti efektif agar tidak perlu setup ulang setiap buat kampanye baru. Beri nama deskriptif seperti 'Wanita 25-35 Jakarta - Minat Fashion'.",
          },
        ]}
      />

      {/* Type cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(Object.keys(TYPE_META) as AudType[]).map((t) => {
          const m = TYPE_META[t];
          return (
            <button
              key={t}
              onClick={() => { resetForm(); setType(t); setModalOpen(true); }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:border-[#0866FF]/40 hover:shadow-md transition-all"
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-[#1c2b33]">Pemirsa {m.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1c2b33]">Pemirsa Tersimpan</h2>
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{audiences.length}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : audiences.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="inline-flex p-3 rounded-2xl bg-gray-50 text-gray-300 mb-3">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-[#1c2b33]">Belum ada pemirsa</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">Buat pemirsa pertamamu untuk dipakai saat menyiapkan iklan.</p>
            <button onClick={openModal} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Buat pemirsa
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Tipe</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Sumber</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Estimasi ukuran</th>
                  <th className="w-12 px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {audiences.map((a) => {
                  const m = TYPE_META[a.type] ?? TYPE_META.CUSTOM;
                  return (
                    <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-semibold text-[#1c2b33]">{a.name}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${m.color}`}>
                          <m.icon className="w-3 h-3" /> {m.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{a.source || "—"}</td>
                      <td className="px-5 py-3 text-right font-semibold text-[#1c2b33]">{fmtSize(a.estimatedSize)}</td>
                      <td className="px-5 py-3 relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === a.id ? null : a.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpen === a.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                            <div className="absolute right-5 top-10 z-20 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1">
                              <button
                                onClick={() => handleDelete(a.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" /> Hapus
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">Estimasi ukuran disimulasikan untuk tujuan edukasi.</p>

      {/* Create modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !creating && setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 sticky top-0 bg-white">
              <h3 className="text-base font-bold text-[#1c2b33]">Buat Pemirsa</h3>
              <button onClick={() => !creating && setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Tipe pemirsa</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TYPE_META) as AudType[]).map((t) => {
                    const m = TYPE_META[t];
                    const active = type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`p-3 rounded-xl border text-center transition-colors ${active ? "border-[#0866FF] bg-[#e7f0ff]" : "border-gray-200 hover:bg-gray-50"}`}
                      >
                        <m.icon className={`w-5 h-5 mx-auto mb-1 ${active ? "text-[#0866FF]" : "text-gray-400"}`} />
                        <p className={`text-xs font-semibold ${active ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>{m.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama pemirsa</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mis. Pembeli 30 hari terakhir"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] transition-colors"
                />
              </div>

              {/* Adaptive source */}
              {type === "CUSTOM" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sumber data</label>
                  <select
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF]"
                  >
                    {CUSTOM_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {type === "LOOKALIKE" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Pemirsa sumber</label>
                    <select
                      value={lkBase}
                      onChange={(e) => setLkBase(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF]"
                    >
                      {MOCK_CUSTOM_AUDIENCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Persentase kemiripan</label>
                    <select
                      value={lkPct}
                      onChange={(e) => setLkPct(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF]"
                    >
                      {LOOKALIKE_PCT.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <p className="col-span-2 text-[11px] text-gray-400">Makin kecil persen, makin mirip sumber (jangkauan lebih sempit).</p>
                </div>
              )}

              {type === "SAVED" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ringkasan penargetan</label>
                  <textarea
                    value={savedTargeting}
                    onChange={(e) => setSavedTargeting(e.target.value)}
                    rows={3}
                    placeholder="mis. Indonesia · 18-35 · Minat: Skincare, Belanja online"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] resize-none transition-colors"
                  />
                </div>
              )}

              {err && <p className="text-sm text-red-500">{err}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-50 sticky bottom-0 bg-white">
              <button onClick={() => !creating && setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? "Menyimpan..." : "Buat Pemirsa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
