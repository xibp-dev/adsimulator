"use client";

import { useState } from "react";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, X, Heart, Send, Bookmark, Volume2, Play } from "lucide-react";
import { CTA_OPTIONS } from "@/lib/mockData";
import { CampaignFormData } from "./CreateCampaignFlow";

type Placement = "fb_feed" | "ig_feed" | "ig_stories" | "fb_stories" | "ig_reels";

const PLACEMENTS: { id: Placement; label: string; icon: string }[] = [
  { id: "fb_feed", label: "Facebook Feed", icon: "📘" },
  { id: "ig_feed", label: "Instagram Feed", icon: "📸" },
  { id: "ig_stories", label: "IG Stories", icon: "⭕" },
  { id: "fb_stories", label: "FB Stories", icon: "🔵" },
  { id: "ig_reels", label: "Instagram Reels", icon: "🎬" },
];

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80";

function getMediaImage(data: CampaignFormData): string {
  const url = data.mediaUrls?.[0] ?? "";
  if (!url || url.startsWith("yt:")) return PLACEHOLDER_IMAGE;
  return url;
}

function getCarouselImage(data: CampaignFormData, index: number): string {
  const url = data.mediaUrls?.[index] ?? "";
  if (!url || url.startsWith("yt:")) return PLACEHOLDER_IMAGE;
  return url;
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url || "situsanda.com"; }
}

function ctaLabel(value: string) {
  return CTA_OPTIONS.find((c) => c.value === value)?.label ?? "Pelajari Selengkapnya";
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

interface Props {
  data: CampaignFormData;
}

/* ── Facebook Feed ── */
function FbFeedPreview({ data }: Props) {
  const pageName = data.identityPage || "Nama Halaman Anda";
  const primaryText = data.primaryText || "Teks utama iklan Anda akan muncul di sini.";
  const headline = data.headline || "Judul iklan Anda";
  const description = data.description || "";
  const domain = getDomain(data.destinationUrl);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-[380px] mx-auto text-[13px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {pageName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1c2b33] text-[13px] leading-tight truncate">{pageName}</p>
          <p className="text-[10px] text-gray-400">Bersponsor · <span>🌐</span></p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <MoreHorizontal className="w-4 h-4" />
          <X className="w-4 h-4" />
        </div>
      </div>

      {/* Post text */}
      <p className="px-3.5 pb-2.5 text-[13px] text-gray-800 leading-relaxed whitespace-pre-line">
        {truncate(primaryText, 125)}
      </p>

      {/* Media */}
      <div className="w-full bg-gray-100 aspect-[1.91/1] relative overflow-hidden">
        {(data.mediaUrls?.[0] ?? "").startsWith("yt:") ? (() => {
          const ytUrl = (data.mediaUrls![0]).replace("yt:", "");
          const match = ytUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
          return match ? (
            <iframe src={`https://www.youtube.com/embed/${match[1]}`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <Play className="w-10 h-10 text-white/50" />
            </div>
          );
        })() : (
          <img src={getMediaImage(data)} alt="ad media" className="w-full h-full object-cover" />
        )}
        <span className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IKLAN</span>
      </div>

      {/* Link bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#f0f2f5] border-t border-gray-200">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">{domain}</p>
          <p className="font-semibold text-[#1c2b33] text-[12px] leading-tight truncate">{headline || "Judul iklan Anda"}</p>
          {description && <p className="text-[11px] text-gray-500 truncate">{description}</p>}
        </div>
        <button className="ml-3 flex-shrink-0 bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#1c2b33] text-[12px] font-semibold px-3 py-1.5 rounded-md transition-colors">
          {ctaLabel(data.cta)}
        </button>
      </div>

      {/* Reactions */}
      <div className="px-3.5 py-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-500 text-[12px]">
          <span>👍❤️😆</span>
          <span className="ml-1">1,2 rb</span>
        </div>
        <div className="text-[11px] text-gray-400">48 komentar · 12 dibagikan</div>
      </div>
      <div className="flex border-t border-gray-100">
        {[
          { icon: <ThumbsUp className="w-3.5 h-3.5" />, label: "Suka" },
          { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Komentar" },
          { icon: <Share2 className="w-3.5 h-3.5" />, label: "Bagikan" },
        ].map((a) => (
          <button key={a.label} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] text-gray-500 hover:bg-gray-50">
            {a.icon}{a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Instagram Feed ── */
function IgFeedPreview({ data }: Props) {
  const igAccount = data.identityInstagram || data.identityPage || "akun_instagram_anda";
  const accountSlug = igAccount.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.]/g, "");
  const primaryText = data.primaryText || "Teks utama iklan Anda akan muncul di sini.";
  const headline = data.headline || "Judul iklan Anda";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-[380px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
              {accountSlug.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#1c2b33] text-[12px] leading-tight">{accountSlug}</p>
          <p className="text-[10px] text-gray-400">Berbayar · Iklan</p>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </div>

      {/* Square media */}
      <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
        <img src={getMediaImage(data)} alt="ad" className="w-full h-full object-cover" />
        <span className="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IKLAN</span>
      </div>

      {/* Actions */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-3 text-[#1c2b33]">
            <Heart className="w-5 h-5" />
            <MessageCircle className="w-5 h-5" />
            <Send className="w-5 h-5" />
          </div>
          <Bookmark className="w-5 h-5 text-[#1c2b33]" />
        </div>
        <p className="text-[12px] font-semibold text-[#1c2b33]">1.234 suka</p>
        <p className="text-[12px] text-[#1c2b33] mt-0.5">
          <span className="font-semibold">{accountSlug}</span>{" "}
          <span className="text-gray-700">{truncate(primaryText, 80)}</span>
        </p>

        {/* CTA bar */}
        <div className="mt-2 flex items-center justify-between bg-[#f0f2f5] rounded-lg px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11px] text-gray-500 truncate">{getDomain(data.destinationUrl)}</p>
            <p className="text-[12px] font-semibold text-[#1c2b33] truncate">{headline}</p>
          </div>
          <button className="ml-2 flex-shrink-0 bg-[#0866FF] text-white text-[11px] font-bold px-3 py-1.5 rounded-md">
            {ctaLabel(data.cta)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Stories (IG & FB) ── */
function StoriesPreview({ data, platform }: Props & { platform: "ig" | "fb" }) {
  const name = platform === "ig"
    ? (data.identityInstagram || data.identityPage || "akun_anda")
    : (data.identityPage || "Nama Halaman Anda");
  const primaryText = data.primaryText || "Teks iklan Anda";

  return (
    <div className="w-full max-w-[220px] mx-auto rounded-2xl overflow-hidden shadow-md relative bg-black" style={{ aspectRatio: "9/16" }}>
      {/* BG image */}
      <img src={getMediaImage(data)} alt="story" className="absolute inset-0 w-full h-full object-cover opacity-90" />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* Top bar */}
      <div className="relative z-10 px-3 pt-3">
        <div className="flex gap-1 mb-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/60" style={{ opacity: i === 1 ? 1 : 0.4 }} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-[10px] font-semibold leading-tight truncate max-w-[120px]">{name}</p>
            <p className="text-white/70 text-[9px]">Bersponsor</p>
          </div>
          <X className="w-3.5 h-3.5 text-white ml-auto" />
        </div>
      </div>

      {/* IKLAN badge */}
      <span className="absolute top-16 right-3 z-10 bg-white/20 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">IKLAN</span>

      {/* Text overlay */}
      <div className="absolute bottom-14 left-3 right-3 z-10">
        <p className="text-white text-[11px] font-medium leading-snug drop-shadow-md">
          {truncate(primaryText, 60)}
        </p>
      </div>

      {/* CTA swipe up */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <button className="w-full bg-white text-[#1c2b33] font-bold text-[11px] py-2 rounded-full shadow-lg">
          {ctaLabel(data.cta)}
        </button>
      </div>
    </div>
  );
}

/* ── Instagram Reels ── */
function IgReelsPreview({ data }: Props) {
  const igAccount = data.identityInstagram || data.identityPage || "akun_anda";
  const accountSlug = igAccount.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.]/g, "");
  const primaryText = data.primaryText || "Teks utama iklan Anda";

  return (
    <div className="w-full max-w-[220px] mx-auto rounded-2xl overflow-hidden shadow-md relative bg-black" style={{ aspectRatio: "9/16" }}>
      <img src={getMediaImage(data)} alt="reel" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Right side actions */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-0.5">
          <Heart className="w-6 h-6 text-white drop-shadow" />
          <span className="text-white text-[9px]">1,2 rb</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MessageCircle className="w-6 h-6 text-white drop-shadow" />
          <span className="text-white text-[9px]">48</span>
        </div>
        <Send className="w-6 h-6 text-white drop-shadow" />
        <MoreHorizontal className="w-6 h-6 text-white drop-shadow" />
        <Volume2 className="w-5 h-5 text-white drop-shadow" />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-12 z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold border border-white">
            {accountSlug.charAt(0).toUpperCase()}
          </div>
          <p className="text-white text-[11px] font-semibold">{accountSlug}</p>
          <span className="text-white/60 text-[9px]">· Bersponsor</span>
        </div>
        <p className="text-white text-[10px] leading-snug mb-2">{truncate(primaryText, 50)}</p>
        <button className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
          {ctaLabel(data.cta)}
        </button>
      </div>

      {/* IKLAN badge */}
      <span className="absolute top-3 left-3 z-10 bg-white/20 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">IKLAN</span>
    </div>
  );
}

/* ── Main Panel ── */
export default function AdPreviewPanel({ data }: Props) {
  const [placement, setPlacement] = useState<Placement>("fb_feed");

  return (
    <div className="flex flex-col h-full">
      {/* Placement tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PLACEMENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlacement(p.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              placement === p.id
                ? "bg-[#0866FF] text-white border-[#0866FF]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0866FF] hover:text-[#0866FF]"
            }`}
          >
            <span>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center pt-2 pb-6 overflow-y-auto">
        {placement === "fb_feed" && <FbFeedPreview data={data} />}
        {placement === "ig_feed" && <IgFeedPreview data={data} />}
        {placement === "ig_stories" && <StoriesPreview data={data} platform="ig" />}
        {placement === "fb_stories" && <StoriesPreview data={data} platform="fb" />}
        {placement === "ig_reels" && <IgReelsPreview data={data} />}
      </div>

      <p className="text-center text-[10px] text-gray-400 pb-2">
        Preview simulasi — tampilan asli bisa sedikit berbeda di platform Meta.
      </p>
    </div>
  );
}
