"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, Search, AlertCircle, Check, X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface Ad {
  id: string;
  name: string;
  headline: string;
  primaryText: string;
  status: string;
  createdAt: string;
  rejectionReason?: string;
  adSet: {
    campaign: {
      name: string;
      adAccount: {
        user: {
          name: string;
        } | null;
      } | null;
    };
  };
}

export default function ContentMonitorPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/admin/ads");
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleReview = async (adId: string, status: "ACTIVE" | "REJECTED", rejectionReason?: string) => {
    setActionLoading(adId);
    try {
      const res = await fetch(`/api/admin/ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((ad) => (ad.id === adId ? { ...ad, status, rejectionReason: rejectionReason || undefined } : ad))
        );
        alert(status === "ACTIVE" ? "Iklan berhasil disetujui!" : "Iklan ditolak.");
      } else {
        alert("Gagal memproses review.");
      }
    } catch (error) {
      console.error("Error reviewing ad:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus iklan ini secara permanen? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setActionLoading(adId);
    try {
      const res = await fetch(`/api/admin/ads/${adId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAds((prev) => prev.filter((ad) => ad.id !== adId));
      } else {
        alert("Gagal menghapus iklan.");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      alert("Terjadi kesalahan saat menghapus iklan.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAds = ads.filter((ad) => {
    const searchLower = search.toLowerCase();
    const matchName = ad.name.toLowerCase().includes(searchLower);
    const matchUser = ad.adSet.campaign.adAccount?.user?.name.toLowerCase().includes(searchLower) ?? false;
    const matchCampaign = ad.adSet.campaign.name.toLowerCase().includes(searchLower);
    const matchText = (ad.headline || ad.primaryText || "").toLowerCase().includes(searchLower);
    return matchName || matchUser || matchCampaign || matchText;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c2b33]">Monitor Konten</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pantau dan kelola iklan yang dibuat oleh seluruh pengguna simulator.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari iklan, pengguna, kampanye, atau headline..."
            className="w-full pl-9 pr-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">
          {loading ? "Memuat..." : `${filteredAds.length} iklan ditemukan`}
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#dddfe2] overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#dddfe2] bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Iklan</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kampanye</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dibuat</th>
              <th className="px-5 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-16 text-center text-gray-500 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span>Memuat data iklan...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAds.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-16 text-center text-gray-400 text-sm">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Belum ada iklan atau tidak ada iklan yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredAds.map((ad) => (
                <tr key={ad.id} className="border-b border-[#f0f2f5] hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#1c2b33] text-sm">{ad.name}</p>
                    <p className="text-xs text-gray-400 max-w-[280px] truncate mt-0.5">
                      {ad.headline || ad.primaryText || "Tidak ada teks"}
                    </p>
                    {ad.status === "REJECTED" && ad.rejectionReason && (
                      <p className="text-[10px] text-red-650 font-medium mt-1 bg-red-50 px-2 py-0.5 rounded inline-block">
                        Alasan ditolak: {ad.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-medium">
                    {ad.adSet.campaign.adAccount?.user?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-550 max-w-[180px] truncate font-mono text-xs">
                    {ad.adSet.campaign.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ad.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(ad.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ad.status === "IN_REVIEW" && (
                        <>
                          <button
                            onClick={() => handleReview(ad.id, "ACTIVE")}
                            disabled={actionLoading === ad.id}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
                            title="Setujui Iklan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Masukkan alasan penolakan iklan:", "Melanggar kebijakan periklanan");
                              if (reason) handleReview(ad.id, "REJECTED", reason);
                            }}
                            disabled={actionLoading === ad.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                            title="Tolak Iklan"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(ad.id)}
                        disabled={actionLoading === ad.id}
                        className="p-2 rounded-lg hover:bg-red-55 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Hapus Iklan"
                      >
                        {actionLoading === ad.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-650" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
