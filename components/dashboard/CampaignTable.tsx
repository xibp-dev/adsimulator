"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Copy, Edit2, Trash2, Download, Columns,
  ChevronDown, TrendingUp, Eye, X,
  Loader2, Save
} from "lucide-react";
import { CampaignObjective, CampaignStatus } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import { OBJECTIVE_INFO } from "@/lib/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusToggle from "@/components/ui/StatusToggle";
import AdPreviewPanel from "@/components/create/AdPreviewPanel";
import type { CampaignFormData } from "@/components/create/CreateCampaignFlow";

interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budgetType: string;
  budgetAmount: number;
  cboEnabled: boolean;
  createdAt: Date;
  _count: { adSets: number };
  simMetrics: Array<{
    reach: number;
    impressions: number;
    results: number;
    costPerResult: number;
    amountSpent: number;
    ctr: number;
    date: Date;
  }>;
}

interface AdSet {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  status: CampaignStatus;
  budgetType: string;
  budgetAmount: number;
  scheduleStart: string;
  scheduleEnd: string | null;
}

interface Ad {
  id: string;
  name: string;
  adSetId: string;
  adSetName: string;
  status: CampaignStatus;
  format: string;
  primaryText: string;
  headline: string;
  description: string;
  identityPage: string;
  mediaUrls: string[];
  cta: string;
  destinationUrl: string;
}

interface Props {
  campaigns: Campaign[];
}

type Tab = "campaigns" | "adsets" | "ads";

/* ── Ad Preview Modal — pakai AdPreviewPanel yang sama dengan halaman buat/edit ── */
function AdPreviewModal({ ad, onClose }: { ad: Ad; onClose: () => void }) {
  // Map data iklan ke bentuk CampaignFormData agar tampilan preview identik
  const previewData = {
    identityPage: ad.identityPage,
    identityInstagram: "",
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    cta: ad.cta,
    destinationUrl: ad.destinationUrl,
    mediaUrls: ad.mediaUrls,
    format: ad.format,
  } as unknown as CampaignFormData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-[#dddfe2] flex-shrink-0">
          <h2 className="font-semibold text-[#1c2b33] text-sm">Preview Iklan</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto bg-[#f0f2f5]">
          <AdPreviewPanel data={previewData} />
        </div>

        <div className="px-5 py-3 border-t border-[#dddfe2] text-xs text-gray-400 text-center flex-shrink-0">
          Format: {ad.format} · Set Iklan: {ad.adSetName}
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteConfirmModal({
  name,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold text-[#1c2b33] text-base mb-2">Hapus item?</h2>
        <p className="text-sm text-gray-600 mb-5">
          Yakin hapus <span className="font-semibold text-[#1c2b33]">{name}</span>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33] disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Campaign Modal ── */
function EditCampaignModal({
  campaign,
  onSave,
  onClose,
}: {
  campaign: Campaign;
  onSave: (updated: Campaign) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(campaign.name);
  const [budgetType, setBudgetType] = useState(campaign.budgetType);
  const [budgetAmount, setBudgetAmount] = useState(String(campaign.budgetAmount));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, budgetType, budgetAmount: parseFloat(budgetAmount) || 0 }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      const data = await res.json();
      onSave({ ...campaign, ...data });
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-[#dddfe2]">
          <h2 className="font-semibold text-[#1c2b33] text-sm">Edit Kampanye</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Kampanye</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Anggaran</label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            >
              <option value="DAILY">Harian</option>
              <option value="LIFETIME">Seumur Hidup</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah Anggaran (Rp)</label>
            <input
              type="number"
              min={0}
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">Batal</button>
            <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit AdSet Modal ── */
function EditAdSetModal({
  adSet,
  onSave,
  onClose,
}: {
  adSet: AdSet;
  onSave: (updated: AdSet) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(adSet.name);
  const [budgetType, setBudgetType] = useState(adSet.budgetType);
  const [budgetAmount, setBudgetAmount] = useState(String(adSet.budgetAmount));
  const [scheduleStart, setScheduleStart] = useState(adSet.scheduleStart ? adSet.scheduleStart.slice(0, 10) : "");
  const [scheduleEnd, setScheduleEnd] = useState(adSet.scheduleEnd ? adSet.scheduleEnd.slice(0, 10) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/adsets/${adSet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          budgetType,
          budgetAmount: parseFloat(budgetAmount) || 0,
          scheduleStart: scheduleStart || undefined,
          scheduleEnd: scheduleEnd || null,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      const data = await res.json();
      onSave({ ...adSet, ...data });
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-[#dddfe2]">
          <h2 className="font-semibold text-[#1c2b33] text-sm">Edit Set Iklan</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Set Iklan</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Anggaran</label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            >
              <option value="DAILY">Harian</option>
              <option value="LIFETIME">Seumur Hidup</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah Anggaran (Rp)</label>
            <input
              type="number"
              min={0}
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={scheduleStart}
              onChange={(e) => setScheduleStart(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Berakhir (opsional)</label>
            <input
              type="date"
              value={scheduleEnd}
              onChange={(e) => setScheduleEnd(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">Batal</button>
            <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit Ad Modal ── */
const CTA_OPTIONS = ["LEARN_MORE", "SHOP_NOW", "SIGN_UP", "BOOK_NOW", "CONTACT_US", "DOWNLOAD", "GET_OFFER", "GET_QUOTE", "SUBSCRIBE", "WATCH_MORE"];

function EditAdModal({
  ad,
  onSave,
  onClose,
}: {
  ad: Ad;
  onSave: (updated: Ad) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(ad.name);
  const [primaryText, setPrimaryText] = useState(ad.primaryText);
  const [headline, setHeadline] = useState(ad.headline);
  const [cta, setCta] = useState(ad.cta);
  const [destinationUrl, setDestinationUrl] = useState(ad.destinationUrl);
  const [mediaUrl, setMediaUrl] = useState(ad.mediaUrls[0] ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const mediaUrls = mediaUrl ? [mediaUrl] : [];
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, primaryText, headline, cta, destinationUrl, mediaUrls }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      const data = await res.json();
      onSave({ ...ad, ...data });
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-[#dddfe2] sticky top-0 bg-white">
          <h2 className="font-semibold text-[#1c2b33] text-sm">Edit Iklan</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Iklan</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teks Utama</label>
            <textarea
              value={primaryText}
              onChange={(e) => setPrimaryText(e.target.value)}
              rows={3}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Judul</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CTA</label>
            <select
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
            >
              {CTA_OPTIONS.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">URL Tujuan</label>
            <input
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">URL Gambar/Video</label>
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full border border-[#dddfe2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30"
              placeholder="https://..."
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">Batal</button>
            <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function CampaignTable({ campaigns: initialCampaigns }: Props) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewAd, setPreviewAd] = useState<Ad | null>(null);

  // Edit modals
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editAdSet, setEditAdSet] = useState<AdSet | null>(null);
  const [editAd, setEditAd] = useState<Ad | null>(null);

  // Delete modals
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: Tab } | null>(null);
  const [bulkDeletePending, setBulkDeletePending] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Proses otomatis iklan yang masih IN_REVIEW saat halaman dibuka:
  // setujui → buat metrik → potong saldo. Lalu refresh agar tabel & saldo TopBar terbarui.
  useEffect(() => {
    fetch("/api/simulator/tick")
      .then((r) => r.json())
      .then((res) => {
        if (res?.processedIds?.length) {
          router.refresh();
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "adsets" && adSets.length === 0) {
      setLoading(true);
      fetch("/api/adsets").then((r) => r.json()).then((data) => {
        setAdSets(Array.isArray(data) ? data : []);
      }).finally(() => setLoading(false));
    }
    if (activeTab === "ads" && ads.length === 0) {
      setLoading(true);
      fetch("/api/ads").then((r) => r.json()).then((data) => {
        setAds(Array.isArray(data) ? data : []);
      }).finally(() => setLoading(false));
    }
  }, [activeTab]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const items = activeTab === "campaigns" ? campaigns : activeTab === "adsets" ? adSets : ads;
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((c) => c.id)));
    }
  };

  const getLatestMetrics = (campaign: Campaign) => {
    const latest = campaign.simMetrics[0];
    return latest ?? { reach: 0, impressions: 0, results: 0, costPerResult: 0, amountSpent: 0, ctr: 0 };
  };

  const tabCounts: Record<Tab, number> = {
    campaigns: campaigns.length,
    adsets: adSets.length,
    ads: ads.length,
  };

  /* ── Delete handler ── */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const endpoint = deleteTarget.type === "campaigns"
      ? `/api/campaigns/${deleteTarget.id}`
      : deleteTarget.type === "adsets"
      ? `/api/adsets/${deleteTarget.id}`
      : `/api/ads/${deleteTarget.id}`;
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      if (deleteTarget.type === "campaigns") setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (deleteTarget.type === "adsets") setAdSets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      if (deleteTarget.type === "ads") setAds((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setSelected((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
    } catch {
      // silently ignore, modal stays open momentarily
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  /* ── Bulk delete handler ── */
  const handleBulkDeleteConfirm = async () => {
    setDeleteLoading(true);
    const ids = Array.from(selected);
    const endpointBase = activeTab === "campaigns" ? "/api/campaigns" : activeTab === "adsets" ? "/api/adsets" : "/api/ads";
    try {
      await Promise.all(ids.map((id) => fetch(`${endpointBase}/${id}`, { method: "DELETE" })));
      if (activeTab === "campaigns") setCampaigns((prev) => prev.filter((c) => !ids.includes(c.id)));
      if (activeTab === "adsets") setAdSets((prev) => prev.filter((a) => !ids.includes(a.id)));
      if (activeTab === "ads") setAds((prev) => prev.filter((a) => !ids.includes(a.id)));
      setSelected(new Set());
    } finally {
      setDeleteLoading(false);
      setBulkDeletePending(false);
    }
  };

  const currentBulkName = `${selected.size} item yang dipilih`;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1c2b33]">Kelola Iklan</h1>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#dddfe2] mb-4">
        {(["campaigns", "adsets", "ads"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelected(new Set()); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#0866FF] text-[#0866FF]"
                : "border-transparent text-gray-600 hover:text-[#1c2b33]"
            }`}
          >
            {tab === "adsets" ? "Set Iklan" : tab === "ads" ? "Iklan" : "Kampanye"}
            {(tab === "campaigns" || (tab === "adsets" && adSets.length > 0) || (tab === "ads" && ads.length > 0)) && (
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button disabled={selected.size === 0} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-[#1c2b33]">
          <Copy className="w-3.5 h-3.5" /> Duplikat
        </button>
        <button disabled={selected.size === 0} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-[#1c2b33]">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          disabled={selected.size === 0}
          onClick={() => setBulkDeletePending(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-red-500"
        >
          <Trash2 className="w-3.5 h-3.5" /> Hapus
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">
            <Columns className="w-3.5 h-3.5" /> Kolom: Performa
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 text-[#1c2b33]">
            <Download className="w-3.5 h-3.5" /> Ekspor
          </button>
        </div>
      </div>

      {/* Tables (desktop) + Cards (mobile) */}
      <div className="bg-white rounded-xl border border-[#dddfe2] md:overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Memuat data…</div>
        ) : activeTab === "campaigns" ? (
          /* ── KAMPANYE ── */
          <>
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="border-b border-[#dddfe2] bg-gray-50">
                <th className="w-10 px-3 py-3">
                  <input type="checkbox" checked={selected.size === campaigns.length && campaigns.length > 0} onChange={toggleAll} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                </th>
                <th className="w-10 px-2 py-3 text-left text-xs font-semibold text-gray-500">Aktif</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[200px]">Nama kampanye</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Pengiriman</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Anggaran</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Hasil</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Jangkauan</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Tayangan</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Biaya/hasil</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500">Dibelanjakan</th>
                <th className="w-20 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <TrendingUp className="w-10 h-10" />
                      <p className="font-medium text-[#1c2b33]">Belum ada kampanye</p>
                      <p className="text-sm">Buat kampanye pertama Anda untuk memulai</p>
                      <Link href="/dashboard/create" className="mt-2 flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg">
                        <Plus className="w-4 h-4" /> Buat kampanye
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const metrics = getLatestMetrics(campaign);
                  const objInfo = OBJECTIVE_INFO[campaign.objective as CampaignObjective];
                  return (
                    <tr key={campaign.id} className={`border-b border-[#f0f2f5] hover:bg-[#f7f8fa] transition-colors ${selected.has(campaign.id) ? "bg-[#e7f0ff]" : ""}`}>
                      <td className="px-3 py-3">
                        <input type="checkbox" checked={selected.has(campaign.id)} onChange={() => toggleSelect(campaign.id)} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                      </td>
                      <td className="px-2 py-3">
                        <StatusToggle entityId={campaign.id} entityType="campaign" isActive={campaign.status === "ACTIVE"} />
                      </td>
                      <td className="px-3 py-3">
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:underline">
                          <p className="font-medium text-[#1c2b33] leading-tight">{campaign.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{objInfo?.label} · {campaign._count.adSets} set iklan</p>
                        </Link>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={campaign.status} /></td>
                      <td className="px-3 py-3 text-[#1c2b33]">
                        <span className="text-xs text-gray-400 block">{campaign.budgetType === "DAILY" ? "Harian" : "Seumur hidup"}</span>
                        {formatCurrency(campaign.budgetAmount)}
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-[#1c2b33]">{formatNumber(metrics.results)}</td>
                      <td className="px-3 py-3 text-right text-[#1c2b33]">{formatNumber(metrics.reach)}</td>
                      <td className="px-3 py-3 text-right text-[#1c2b33]">{formatNumber(metrics.impressions)}</td>
                      <td className="px-3 py-3 text-right text-[#1c2b33]">{metrics.costPerResult > 0 ? formatCurrency(metrics.costPerResult) : "—"}</td>
                      <td className="px-3 py-3 text-right font-medium text-[#1c2b33]">{formatCurrency(metrics.amountSpent)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
                            className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0866FF]"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: campaign.id, name: campaign.name, type: "campaigns" })}
                            className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {campaigns.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 border-t border-[#dddfe2]">
                  <td colSpan={5} className="px-3 py-2.5 text-xs font-semibold text-gray-500">Total ({campaigns.length} kampanye)</td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">{formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.results ?? 0), 0))}</td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">{formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.reach ?? 0), 0))}</td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">{formatNumber(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.impressions ?? 0), 0))}</td>
                  <td className="px-3 py-2.5 text-right text-sm text-gray-500">—</td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-[#1c2b33]">{formatCurrency(campaigns.reduce((s, c) => s + (c.simMetrics[0]?.amountSpent ?? 0), 0))}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>

          {/* ── KAMPANYE: kartu mobile ── */}
          <div className="md:hidden p-3">
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center gap-3 text-gray-400 py-12">
                <TrendingUp className="w-10 h-10" />
                <p className="font-medium text-[#1c2b33]">Belum ada kampanye</p>
                <Link href="/dashboard/create" className="mt-1 flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg">
                  <Plus className="w-4 h-4" /> Buat kampanye
                </Link>
              </div>
            ) : (
              campaigns.map((campaign) => {
                const metrics = getLatestMetrics(campaign);
                const objInfo = OBJECTIVE_INFO[campaign.objective as CampaignObjective];
                return (
                  <div key={campaign.id} className="bg-white border border-[#dddfe2] rounded-xl p-4 mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/dashboard/campaigns/${campaign.id}`} className="min-w-0 flex-1">
                        <p className="font-semibold text-[#1c2b33] leading-tight truncate">{campaign.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{objInfo?.label} · {campaign._count.adSets} set iklan</p>
                      </Link>
                      <StatusToggle entityId={campaign.id} entityType="campaign" isActive={campaign.status === "ACTIVE"} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={campaign.status} />
                      <span className="text-xs text-gray-500">
                        {formatCurrency(campaign.budgetAmount)} / {campaign.budgetType === "DAILY" ? "hari" : "seumur hidup"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400">Hasil</p>
                        <p className="text-sm font-semibold text-[#1c2b33]">{formatNumber(metrics.results)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400">Jangkauan</p>
                        <p className="text-sm font-semibold text-[#1c2b33]">{formatNumber(metrics.reach)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400">Dibelanjakan</p>
                        <p className="text-sm font-semibold text-[#1c2b33]">{formatCurrency(metrics.amountSpent)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-[#1c2b33] hover:bg-gray-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: campaign.id, name: campaign.name, type: "campaigns" })}
                        className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          </>
        ) : activeTab === "adsets" ? (
          /* ── SET IKLAN ── */
          <>
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="border-b border-[#dddfe2] bg-gray-50">
                <th className="w-10 px-3 py-3">
                  <input type="checkbox" checked={selected.size === adSets.length && adSets.length > 0} onChange={toggleAll} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                </th>
                <th className="w-10 px-2 py-3 text-left text-xs font-semibold text-gray-500">Aktif</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[180px]">Nama set iklan</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Kampanye</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Anggaran</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Mulai</th>
                <th className="w-20 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {adSets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">Belum ada set iklan.</td>
                </tr>
              ) : (
                adSets.map((a) => (
                  <tr key={a.id} className={`border-b border-[#f0f2f5] hover:bg-[#f7f8fa] transition-colors ${selected.has(a.id) ? "bg-[#e7f0ff]" : ""}`}>
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                    </td>
                    <td className="px-2 py-3">
                      <StatusToggle entityId={a.id} entityType="adset" isActive={a.status === "ACTIVE"} />
                    </td>
                    <td className="px-3 py-3 font-medium text-[#1c2b33]">{a.name}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{a.campaignName}</td>
                    <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-3 text-[#1c2b33]">
                      <span className="text-xs text-gray-400 block">{a.budgetType === "DAILY" ? "Harian" : "Seumur hidup"}</span>
                      {formatCurrency(a.budgetAmount)}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{a.scheduleStart ? new Date(a.scheduleStart).toLocaleDateString("id-ID") : "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => router.push(`/dashboard/adsets/${a.id}/edit`)}
                          className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0866FF]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: a.id, name: a.name, type: "adsets" })}
                          className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── SET IKLAN: kartu mobile ── */}
          <div className="md:hidden p-3">
            {adSets.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Belum ada set iklan.</div>
            ) : (
              adSets.map((a) => (
                <div key={a.id} className="bg-white border border-[#dddfe2] rounded-xl p-4 mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1c2b33] leading-tight truncate">{a.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{a.campaignName}</p>
                    </div>
                    <StatusToggle entityId={a.id} entityType="adset" isActive={a.status === "ACTIVE"} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-gray-500">
                      {formatCurrency(a.budgetAmount)} / {a.budgetType === "DAILY" ? "hari" : "seumur hidup"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Mulai: {a.scheduleStart ? new Date(a.scheduleStart).toLocaleDateString("id-ID") : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => router.push(`/dashboard/adsets/${a.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-[#1c2b33] hover:bg-gray-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: a.id, name: a.name, type: "adsets" })}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          </>
        ) : (
          /* ── IKLAN ── */
          <>
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="border-b border-[#dddfe2] bg-gray-50">
                <th className="w-10 px-3 py-3">
                  <input type="checkbox" checked={selected.size === ads.length && ads.length > 0} onChange={toggleAll} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                </th>
                <th className="w-10 px-2 py-3 text-left text-xs font-semibold text-gray-500">Aktif</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 min-w-[180px]">Nama iklan</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Set Iklan</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Format</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Teks Utama</th>
                <th className="w-20 px-3 py-3 text-center text-xs font-semibold text-gray-500">Preview</th>
                <th className="w-20 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">Belum ada iklan.</td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className={`border-b border-[#f0f2f5] hover:bg-[#f7f8fa] transition-colors ${selected.has(ad.id) ? "bg-[#e7f0ff]" : ""}`}>
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.has(ad.id)} onChange={() => toggleSelect(ad.id)} className="rounded border-[#dddfe2] accent-[#0866FF]" />
                    </td>
                    <td className="px-2 py-3">
                      <StatusToggle entityId={ad.id} entityType="ad" isActive={ad.status === "ACTIVE"} />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-[#1c2b33] leading-tight">{ad.name}</p>
                      {ad.headline && <p className="text-xs text-gray-400 mt-0.5">{ad.headline}</p>}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{ad.adSetName}</td>
                    <td className="px-3 py-3"><StatusBadge status={ad.status} /></td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      {ad.format === "SINGLE_IMAGE_VIDEO" ? "Single" : ad.format === "CAROUSEL" ? "Carousel" : "Koleksi"}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500 max-w-[180px] truncate">
                      {ad.primaryText || "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setPreviewAd(ad)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#e7f0ff] hover:bg-[#d0e4ff] text-[#0866FF] text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => router.push(`/dashboard/ads/${ad.id}/edit`)}
                          className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0866FF]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: ad.id, name: ad.name, type: "ads" })}
                          className="p-2 md:p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── IKLAN: kartu mobile ── */}
          <div className="md:hidden p-3">
            {ads.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Belum ada iklan.</div>
            ) : (
              ads.map((ad) => (
                <div key={ad.id} className="bg-white border border-[#dddfe2] rounded-xl p-4 mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1c2b33] leading-tight truncate">{ad.name}</p>
                      {ad.headline && <p className="text-xs text-gray-400 mt-0.5 truncate">{ad.headline}</p>}
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{ad.adSetName}</p>
                    </div>
                    <StatusToggle entityId={ad.id} entityType="ad" isActive={ad.status === "ACTIVE"} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge status={ad.status} />
                    <span className="text-xs text-gray-500">
                      {ad.format === "SINGLE_IMAGE_VIDEO" ? "Single" : ad.format === "CAROUSEL" ? "Carousel" : "Koleksi"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setPreviewAd(ad)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#e7f0ff] text-[#0866FF] text-sm font-semibold hover:bg-[#d0e4ff]"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/ads/${ad.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-[#1c2b33] hover:bg-gray-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: ad.id, name: ad.name, type: "ads" })}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#dddfe2] text-sm text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          </>
        )}
      </div>

      {/* Ad Preview Modal */}
      {previewAd && <AdPreviewModal ad={previewAd} onClose={() => setPreviewAd(null)} />}

      {/* Edit Modals */}
      {editCampaign && (
        <EditCampaignModal
          campaign={editCampaign}
          onSave={(updated) => {
            setCampaigns((prev) => prev.map((c) => c.id === updated.id ? { ...c, ...updated } : c));
            setEditCampaign(null);
          }}
          onClose={() => setEditCampaign(null)}
        />
      )}
      {editAdSet && (
        <EditAdSetModal
          adSet={editAdSet}
          onSave={(updated) => {
            setAdSets((prev) => prev.map((a) => a.id === updated.id ? { ...a, ...updated } : a));
            setEditAdSet(null);
          }}
          onClose={() => setEditAdSet(null)}
        />
      )}
      {editAd && (
        <EditAdModal
          ad={editAd}
          onSave={(updated) => {
            setAds((prev) => prev.map((a) => a.id === updated.id ? { ...a, ...updated } : a));
            setEditAd(null);
          }}
          onClose={() => setEditAd(null)}
        />
      )}

      {/* Single Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Bulk Delete Confirm */}
      {bulkDeletePending && (
        <DeleteConfirmModal
          name={currentBulkName}
          onConfirm={handleBulkDeleteConfirm}
          onCancel={() => setBulkDeletePending(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
