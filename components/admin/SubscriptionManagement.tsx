"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Crown, Check, X, Hourglass, CheckCircle2, XCircle, Clock, Loader2, Search, Mail, Plus, UserPlus, AlertCircle,
} from "lucide-react";

interface PlanLite {
  slug: string;
  name: string;
  price: number;
  period: string;
  perLabel: string;
}
interface UserLite {
  id: string;
  name: string;
  email: string;
}

interface Sub {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  planSlug: string;
  amount: number;
  period: string;
  status: string;
  note: string;
  createdAt: string;
  startedAt: string | null;
  expiresAt: string | null;
  approvedBy: string | null;
}

const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  PENDING: { label: "Menunggu", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Hourglass },
  ACTIVE: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  EXPIRED: { label: "Kedaluwarsa", cls: "bg-gray-50 text-gray-500 border-gray-200", icon: Clock },
  REJECTED: { label: "Ditolak", cls: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
};

const rp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");

type Tab = "PENDING" | "ACTIVE" | "REJECTED" | "ALL";

export default function SubscriptionManagement({ initialSubs, plans }: { initialSubs: Sub[]; plans: PlanLite[] }) {
  const [subs, setSubs] = useState<Sub[]>(initialSubs);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Modal "Buat Langganan Manual"
  const [showModal, setShowModal] = useState(false);
  const [uQuery, setUQuery] = useState("");
  const [uResults, setUResults] = useState<UserLite[]>([]);
  const [uSearching, setUSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserLite | null>(null);
  const [planSlug, setPlanSlug] = useState(plans[0]?.slug ?? "");
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedUser) return; // sudah pilih, tak perlu cari
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = uQuery.trim();
    if (term.length < 2) { setUResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setUSearching(true);
      try {
        const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setUResults(Array.isArray(data) ? data : []);
      } catch { setUResults([]); }
      finally { setUSearching(false); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [uQuery, selectedUser]);

  function resetModal() {
    setShowModal(false); setUQuery(""); setUResults([]); setSelectedUser(null);
    setPlanSlug(plans[0]?.slug ?? ""); setModalError("");
  }

  async function createManual() {
    if (!selectedUser) { setModalError("Pilih pengguna dulu."); return; }
    setCreating(true); setModalError("");
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, planSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubs((prev) => [data, ...prev]);
        setTab("ACTIVE");
        resetModal();
      } else {
        setModalError(data.error ?? "Gagal membuat langganan");
      }
    } catch {
      setModalError("Gagal terhubung ke server");
    } finally {
      setCreating(false);
    }
  }

  const counts = useMemo(() => ({
    PENDING: subs.filter((s) => s.status === "PENDING").length,
    ACTIVE: subs.filter((s) => s.status === "ACTIVE").length,
    REJECTED: subs.filter((s) => s.status === "REJECTED").length,
    ALL: subs.length,
  }), [subs]);

  const filtered = subs.filter((s) => {
    if (tab !== "ALL" && s.status !== tab) return false;
    if (q) {
      const t = q.toLowerCase();
      return s.userName.toLowerCase().includes(t) || s.userEmail.toLowerCase().includes(t) || s.planName.toLowerCase().includes(t);
    }
    return true;
  });

  const totalRevenue = subs.filter((s) => s.status === "ACTIVE").reduce((a, s) => a + s.amount, 0);

  async function act(id: string, action: "approve" | "reject") {
    let note: string | undefined;
    if (action === "reject") {
      note = window.prompt("Alasan penolakan (opsional):") ?? undefined;
    }
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
      } else {
        alert(data.error ?? "Gagal memproses");
      }
    } catch {
      alert("Gagal terhubung ke server");
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "PENDING", label: `Menunggu (${counts.PENDING})` },
    { id: "ACTIVE", label: `Aktif (${counts.ACTIVE})` },
    { id: "REJECTED", label: `Ditolak (${counts.REJECTED})` },
    { id: "ALL", label: `Semua (${counts.ALL})` },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" /> Langganan LMS
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Verifikasi pembayaran & kelola akses Kelas Premium.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
            <p className="text-xl font-bold text-[#1c2b33] leading-none">{counts.PENDING}</p>
            <p className="text-[11px] text-gray-400 mt-1">Perlu ditinjau</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
            <p className="text-xl font-bold text-emerald-600 leading-none">{rp(totalRevenue)}</p>
            <p className="text-[11px] text-gray-400 mt-1">Pendapatan aktif</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-white text-[#0866FF] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama / email…"
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30 w-56"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Buat Langganan Manual
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Pengguna</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Paket</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Nominal</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Diajukan</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Berlaku s/d</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const b = STATUS[s.status] ?? STATUS.PENDING;
                const Icon = b.icon;
                return (
                  <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0866FF] to-[#5b9bff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1c2b33] truncate">{s.userName}</p>
                          <p className="text-xs text-gray-400 truncate flex items-center gap-1"><Mail className="w-3 h-3" /> {s.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{s.planName}</td>
                    <td className="px-5 py-3 font-semibold text-[#1c2b33]">{rp(s.amount)}</td>
                    <td className="px-5 py-3 text-gray-400">{fmt(s.createdAt)}</td>
                    <td className="px-5 py-3 text-gray-400">{fmt(s.expiresAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${b.cls}`}>
                        <Icon className="w-3 h-3" /> {b.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => act(s.id, "approve")}
                              disabled={busyId === s.id}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {busyId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Setujui
                            </button>
                            <button
                              onClick={() => act(s.id, "reject")}
                              disabled={busyId === s.id}
                              className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">{s.approvedBy ? `oleh ${s.approvedBy}` : "—"}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400 text-sm">Tidak ada data langganan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Langganan Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={resetModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0866FF]" /> Buat Langganan Manual
              </h2>
              <button onClick={resetModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                Langganan akan langsung <b>AKTIF</b> untuk user terpilih tanpa perlu pembayaran. Cocok untuk demo atau pemberian akses.
              </p>

              {/* Pilih user */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pengguna</label>
                {selectedUser ? (
                  <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0866FF] to-[#5b9bff] flex items-center justify-center text-white text-xs font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1c2b33] truncate">{selectedUser.name}</p>
                      <p className="text-xs text-gray-400 truncate">{selectedUser.email}</p>
                    </div>
                    <button onClick={() => { setSelectedUser(null); setUQuery(""); }} className="text-xs text-[#0866FF] font-semibold hover:underline">Ganti</button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      value={uQuery}
                      onChange={(e) => setUQuery(e.target.value)}
                      placeholder="Ketik nama atau email (min. 2 huruf)…"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
                    />
                    {(uSearching || uResults.length > 0) && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                        {uSearching && <div className="px-3 py-2.5 text-xs text-gray-400 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mencari…</div>}
                        {!uSearching && uResults.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => { setSelectedUser(u); setUResults([]); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left"
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1c2b33] truncate">{u.name}</p>
                              <p className="text-xs text-gray-400 truncate">{u.email}</p>
                            </div>
                          </button>
                        ))}
                        {!uSearching && uQuery.trim().length >= 2 && uResults.length === 0 && (
                          <div className="px-3 py-2.5 text-xs text-gray-400">Tidak ada user cocok.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pilih paket */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Paket</label>
                <div className="grid grid-cols-1 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => setPlanSlug(p.slug)}
                      className={`flex items-center justify-between border rounded-xl px-3.5 py-2.5 text-left transition-all ${planSlug === p.slug ? "border-[#0866FF] ring-2 ring-[#0866FF]/15 bg-blue-50/50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#1c2b33]">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.period === "YEARLY" ? "Berlaku 1 tahun" : "Berlaku 1 bulan"}</p>
                      </div>
                      <span className="text-sm font-bold text-[#0866FF]">{rp(p.price)}<span className="text-xs font-normal text-gray-400">{p.perLabel}</span></span>
                    </button>
                  ))}
                </div>
              </div>

              {modalError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {modalError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={resetModal} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Batal</button>
              <button
                onClick={createManual}
                disabled={creating || !selectedUser}
                className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat…</> : <><Check className="w-4 h-4" /> Aktifkan Langganan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
