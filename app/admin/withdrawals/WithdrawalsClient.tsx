"use client";

import { useState } from "react";
import { 
  DollarSign, Check, X, RefreshCw, Calendar, Loader2, 
  Search, ShieldCheck, XCircle, Info, Banknote, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/simulate";

interface WithdrawalRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  bankName: string;
  accountName: string;
  accountNo: string;
  status: string;
  note: string;
  createdAt: string;
}

export default function WithdrawalsClient({ initialWithdrawals }: { initialWithdrawals: WithdrawalRow[] }) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>(initialWithdrawals);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionModal, setActionModal] = useState<{ open: boolean; wd: WithdrawalRow | null; action: "approve" | "reject"; note: string }>({
    open: false,
    wd: null,
    action: "approve",
    note: "",
  });

  const filtered = withdrawals.filter((w) => {
    const matchSearch =
      w.userName.toLowerCase().includes(search.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      w.bankName.toLowerCase().includes(search.toLowerCase()) ||
      w.accountName.toLowerCase().includes(search.toLowerCase()) ||
      w.accountNo.includes(search);
    const matchStatus = filterStatus === "all" || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/withdrawals");
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleActionSubmit() {
    if (!actionModal.wd) return;
    const { id } = actionModal.wd;
    const status = actionModal.action === "approve" ? "APPROVED" : "REJECTED";

    setProcessingId(id);
    setActionModal(m => ({ ...m, open: false }));

    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, note: actionModal.note }),
      });
      if (res.ok) {
        setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status, note: actionModal.note } : w));
      } else {
        alert("Gagal memproses aksi.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setProcessingId(null);
    }
  }

  // Stats
  const totalPending = withdrawals.filter(w => w.status === "PENDING").length;
  const totalApproved = withdrawals.filter(w => w.status === "APPROVED").reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
            <Banknote className="w-6 h-6 text-[#0866FF]" /> Permintaan Penarikan Dana (WD)
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola dan proses pengajuan transfer komisi afiliasi pengguna.</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0866FF] transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Menunggu Diproses (Pending)</p>
          <p className="text-3xl font-extrabold text-amber-500">{totalPending} Permintaan</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Dana Dicairkan (Selesai)</p>
          <p className="text-3xl font-extrabold text-emerald-600">{formatCurrency(totalApproved, "IDR")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari nama, email, bank, rekening..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0866FF]"
        >
          <option value="all">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Selesai (Disetujui)</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} permintaan ditemukan</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center shadow-sm">
          <Banknote className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">Belum ada permintaan penarikan dana.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Pengguna</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Nominal</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Rekening Penerima</th>
                  <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Tanggal</th>
                  <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-[#1c2b33]">{w.userName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{w.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-[#1c2b33]">
                      {formatCurrency(w.amount, "IDR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-800"><span className="font-bold">{w.bankName}</span> · <span className="font-mono">{w.accountNo}</span></p>
                      <p className="text-[10px] text-gray-400">a.n. {w.accountName}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        w.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : w.status === "REJECTED"
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {w.status === "APPROVED" ? <ShieldCheck className="w-3 h-3" /> : w.status === "REJECTED" ? <XCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {w.status === "APPROVED" ? "Selesai" : w.status === "REJECTED" ? "Ditolak" : "Pending"}
                      </span>
                      {w.note && <p className="text-[9px] text-gray-450 italic mt-0.5 text-gray-500" title={w.note}>Ket: {w.note}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500">{new Date(w.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p className="text-[10px] text-gray-400">{new Date(w.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {processingId === w.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#0866FF]" />
                      ) : w.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActionModal({ open: true, wd: w, action: "approve", note: "Dana berhasil ditransfer" })}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3 h-3" /> Setujui
                          </button>
                          <button
                            onClick={() => setActionModal({ open: true, wd: w, action: "reject", note: "Rekening tidak valid" })}
                            className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-750 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors border border-red-100 flex items-center gap-1 text-red-600"
                          >
                            <X className="w-3 h-3" /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Modal (Approve/Reject) */}
      {actionModal.open && actionModal.wd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActionModal(m => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between">
              <h3 className="font-bold text-[#1c2b33]">
                {actionModal.action === "approve" ? "Setujui Penarikan" : "Tolak Penarikan"}
              </h3>
              <button onClick={() => setActionModal(m => ({ ...m, open: false }))} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 text-gray-600">
                <p><strong>Nama:</strong> {actionModal.wd.userName}</p>
                <p><strong>Nominal:</strong> Rp {actionModal.wd.amount.toLocaleString("id-ID")}</p>
                <p><strong>Tujuan:</strong> {actionModal.wd.bankName} - {actionModal.wd.accountNo} ({actionModal.wd.accountName})</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {actionModal.action === "approve" ? "Catatan / Bukti Transfer" : "Alasan Penolakan"}
                </label>
                <textarea
                  value={actionModal.note}
                  onChange={e => setActionModal(m => ({ ...m, note: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 transition-all h-20 resize-none"
                  placeholder={actionModal.action === "approve" ? "mis. Transfer sukses ke BCA" : "mis. Nomor rekening tidak valid / nama tidak sesuai"}
                />
              </div>
              <button
                onClick={handleActionSubmit}
                className={`w-full text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all ${
                  actionModal.action === "approve" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-650"
                }`}
              >
                Konfirmasi {actionModal.action === "approve" ? "Pencairan" : "Penolakan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
