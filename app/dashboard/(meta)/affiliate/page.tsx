"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  Link2, 
  Copy, 
  Check, 
  HelpCircle,
  TrendingUp,
  Award,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Calendar,
  Gift,
  RotateCcw,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/simulate";
import GuidePanel from "@/components/create/GuidePanel";
import WithdrawModal from "@/components/ui/WithdrawModal";

interface AffiliateStats {
  totalReferrals: number;
  totalEarnings: number;
  activeReferrals: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Commission {
  id: string;
  referredUserId: string;
  referredUserName: string;
  subscriptionId: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface UserWithdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountName: string;
  accountNo: string;
  status: string;
  note: string;
  createdAt: string;
}

export default function AffiliatePage() {
  const [stats, setStats] = useState<AffiliateStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    activeReferrals: 0,
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<UserWithdrawal[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showWDModal, setShowWDModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"referrals" | "commissions" | "withdrawals">("referrals");

  // Load all data
  const loadData = () => {
    Promise.all([
      fetch("/api/affiliate").then((res) => res.json()),
      fetch("/api/affiliate/withdraw").then((res) => res.json())
    ])
      .then(([affData, wdData]) => {
        if (affData.stats) setStats(affData.stats);
        if (affData.referrals) setReferrals(affData.referrals);
        if (affData.commissions) setCommissions(affData.commissions);
        if (affData.referralCode) setReferralCode(affData.referralCode);
        if (Array.isArray(wdData)) setWithdrawals(wdData);
      })
      .catch((e) => console.error("Error loading affiliate data:", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);


  const getAffiliateLink = () => {
    if (typeof window !== "undefined" && referralCode) {
      return `${window.location.origin}/register?ref=${referralCode}`;
    }
    return "";
  };

  const handleCopyLink = () => {
    const link = getAffiliateLink();
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate available balance
  const totalWD = withdrawals
    .filter(w => w.status === "PENDING" || w.status === "APPROVED")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = Math.max(0, stats.totalEarnings - totalWD);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0866FF]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dddfe2] gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Program Afiliasi</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-600" />
              Sistem Kemitraan Afiliasi
            </h1>
          </div>
        </div>
      </div>

      {/* Guide Panel */}
      <GuidePanel
        title="🤝 Panduan: Program Kemitraan Afiliasi"
        summary="Dapatkan komisi pasif sebesar 20% untuk setiap pembayaran langganan terverifikasi yang dilakukan oleh pengguna baru yang mendaftar melalui tautan rujukan (referral link) Anda."
        tips={[
          {
            field: "Cara Kerja Afiliasi",
            what: "Bagikan tautan referral unik Anda. Ketika seseorang mendaftar melalui link tersebut, sistem secara otomatis mencatat Anda sebagai referer.",
            recommendation: "Bagikan link di komunitas belajar digital marketing, grup Telegram/WhatsApp, atau media sosial Anda untuk menjangkau calon praktisi iklan.",
          },
          {
            field: "Komisi 20% Berlangganan",
            what: "Setiap kali pengguna rujukan Anda melakukan pembayaran langganan kelas premium dan disetujui oleh admin, Anda mendapatkan komisi sebesar 20% dari total nilai langganan.",
            recommendation: "Pantau daftar 'Riwayat Komisi' di bawah untuk melihat pencairan dana simulasi Anda yang telah disetujui.",
          },
        ]}
        defaultOpen
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Referrals */}
        <div className="bg-white border border-[#dddfe2] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#0866FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Rujukan</span>
            <h2 className="text-lg font-black text-gray-900 mt-0.5">{stats.totalReferrals} Orang</h2>
          </div>
        </div>

        {/* Active Referrals */}
        <div className="bg-white border border-[#dddfe2] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Rujukan Aktif</span>
            <h2 className="text-lg font-black text-gray-900 mt-0.5">{stats.activeReferrals} Orang</h2>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border border-[#dddfe2] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Komisi</span>
            <h2 className="text-lg font-black text-gray-900 mt-0.5">{formatCurrency(stats.totalEarnings, "IDR")}</h2>
          </div>
        </div>

        {/* Available Balance / WD */}
        <div className="bg-[#e7f0ff]/40 border border-[#0866FF]/20 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0866FF] text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Saldo Tersedia</span>
              <h2 className="text-lg font-black text-[#0866FF] mt-0.5">{formatCurrency(availableBalance, "IDR")}</h2>
            </div>
          </div>
          {availableBalance >= 10000 && (
            <button
              onClick={() => setShowWDModal(true)}
              className="bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-[#0866FF]/10 whitespace-nowrap"
            >
              Tarik Dana
            </button>
          )}
        </div>
      </div>

      {/* Link Generator Area */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-pink-400" />
            Tautan Referral Anda
          </h3>
          <p className="text-xs text-slate-300 leading-normal">
            Salin tautan di bawah dan bagikan. Setiap pengguna yang mendaftar melalui link ini akan terhubung ke sistem rujukan Anda secara otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 rounded-xl p-1.5 flex-1 max-w-md w-full">
          <input
            type="text"
            readOnly
            value={getAffiliateLink()}
            className="bg-transparent text-xs font-mono text-pink-300 flex-1 px-3 py-1.5 focus:outline-none select-all truncate"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              copied 
                ? "bg-emerald-600 text-white" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lists Tabs */}
      <div className="bg-white border border-[#dddfe2] rounded-2xl overflow-hidden shadow-sm">
        <div className="border-b border-[#e9ebee] bg-slate-50 flex items-center">
          <button
            onClick={() => setActiveTab("referrals")}
            className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "referrals" 
                ? "border-[#0866FF] text-[#0866FF] bg-white" 
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            👥 Daftar Rujukan ({referrals.length})
          </button>
          <button
            onClick={() => setActiveTab("commissions")}
            className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "commissions" 
                ? "border-[#0866FF] text-[#0866FF] bg-white" 
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            💰 Riwayat Komisi ({commissions.length})
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "withdrawals" 
                ? "border-[#0866FF] text-[#0866FF] bg-white" 
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            💸 Tarik Dana ({withdrawals.length})
          </button>
        </div>

        <div className="p-4 overflow-x-auto">
          {activeTab === "referrals" ? (
            referrals.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs italic">
                Belum ada rujukan yang terdaftar. Bagikan link referral Anda untuk memulai!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Alamat Email</th>
                    <th className="py-3 px-4">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-800">{ref.name}</td>
                      <td className="py-3.5 px-4 text-gray-600 font-mono">{ref.email}</td>
                      <td className="py-3.5 px-4 text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ref.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : activeTab === "commissions" ? (
            commissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs italic">
                Belum ada komisi yang dicatat. Dapatkan 20% komisi ketika rujukan Anda berlangganan kelas premium!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">Rujukan Pembayar</th>
                    <th className="py-3 px-4">ID Langganan</th>
                    <th className="py-3 px-4">Nilai Komisi (20%)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal Diterima</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-800">{comm.referredUserName}</td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono">{comm.subscriptionId.substring(0, 8)}...</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{formatCurrency(comm.amount, "IDR")}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          comm.status === "APPROVED" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {comm.status === "APPROVED" ? "Disetujui" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(comm.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            withdrawals.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs italic">
                Belum ada pengajuan penarikan dana.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Tujuan Rekening</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Catatan Admin</th>
                    <th className="py-3 px-4">Tanggal Pengajuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {withdrawals.map((wd) => (
                    <tr key={wd.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-800">{formatCurrency(wd.amount, "IDR")}</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="font-bold">{wd.bankName}</span> · <span className="font-mono">{wd.accountNo}</span> ({wd.accountName})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          wd.status === "APPROVED" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : wd.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {wd.status === "APPROVED" ? "Selesai" : wd.status === "REJECTED" ? "Ditolak" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 italic max-w-[200px] truncate" title={wd.note}>
                        {wd.note || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(wd.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {showWDModal && (
        <WithdrawModal
          availableBalance={availableBalance}
          onClose={() => setShowWDModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
