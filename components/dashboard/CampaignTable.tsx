"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Copy, Edit2, Trash2, Download, Columns,
  ChevronDown, MoreHorizontal, TrendingUp, Eye, X,
  ImageIcon, PlayCircle
} from "lucide-react";
import { CampaignObjective, CampaignStatus } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import { OBJECTIVE_INFO } from "@/lib/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusToggle from "@/components/ui/StatusToggle";

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
    cpm: number;
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
  identityPage: string;
  mediaUrls: string[];
  cta: string;
  destinationUrl: string;
}

interface Props {
  campaigns: Campaign[];
}

type Tab = "campaigns" | "adsets" | "ads";

/* ── Ad Preview Modal ── */
function AdPreviewModal({ ad, onClose }: { ad: Ad; onClose: () => void }) {
  const imgUrl = ad.mediaUrls.find((u) => u && !u.startsWith("yt:")) ?? "";
  const ytUrl = ad.mediaUrls.find((u) => u?.startsWith("yt:"))?.replace("yt:", "") ?? "";
  const ytId = ytUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#dddfe2]">
          <h2 className="font-semibold text-[#1c2b33] text-sm">Preview Iklan</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mock FB Feed preview */}
        <div className="bg-white p-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {(ad.identityPage || "H").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1c2b33] text-[13px]">{ad.identityPage || "Nama Halaman"}</p>
                <p className="text-[10px] text-gray-400">Bersponsor · 🌐</p>
              </div>
            </div>
            {/* Text */}
            {ad.primaryText && (
              <p className="px-3 pb-2 text-[13px] text-gray-800 leading-relaxed">{ad.primaryText.slice(0, 100)}{ad.primaryText.length > 100 ? "…" : ""}</p>
            )}
            {/* Media */}
            <div className="w-full bg-gray-100 aspect-[1.91/1] overflow-hidden relative">
              {ytId ? (
                <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen />
              ) : imgUrl ? (
                <img src={imgUrl} alt="ad" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Belum ada gambar</span>
                </div>
              )}
              <span className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IKLAN</span>
            </div>
            {/* CTA */}
            {ad.headline && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#f0f2f5]">
                <div>
                  <p className="text-[10px] text-gray-500 truncate max-w-[220px]">{ad.destinationUrl?.replace(/^https?:\/\//, "").split("/")[0] || "situsanda.com"}</p>
                  <p className="font-semibold text-[#1c2b33] text-[12px]">{ad.headline}</p>
                </div>
                <button className="bg-[#e4e6eb] text-[#1c2b33] text-[12px] font-semibold px-3 py-1.5 rounded-md ml-2 flex-shrink-0">
                  {ad.cta?.replace(/_/g, " ") || "Pelajari"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-4 text-xs text-gray-400 text-center">
          Format: {ad.format} · Set Iklan: {ad.adSetName}
        </div>
      </div>
    </div>
  );
}

export default function CampaignTable({ campaigns }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewAd, setPreviewAd] = useState<Ad | null>(null);

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

  return (
    <div className="p-6">
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
        <button disabled={selected.size === 0} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#dddfe2] rounded-lg hover:bg-gray-50 disabled:opacity-40 text-red-500">
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

      {/* Tables */}
      <div className="bg-white rounded-xl border border-[#dddfe2] overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Memuat data…</div>
        ) : activeTab === "campaigns" ? (
          /* ── KAMPANYE ── */
          <table className="w-full text-sm">
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
                <th className="w-10 px-3 py-3" />
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
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>
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
        ) : activeTab === "adsets" ? (
          /* ── SET IKLAN ── */
          <table className="w-full text-sm">
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
              </tr>
            </thead>
            <tbody>
              {adSets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">Belum ada set iklan.</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          /* ── IKLAN ── */
          <table className="w-full text-sm">
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
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">Belum ada iklan.</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Ad Preview Modal */}
      {previewAd && <AdPreviewModal ad={previewAd} onClose={() => setPreviewAd(null)} />}
    </div>
  );
}
