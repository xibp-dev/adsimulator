"use client";

import { CampaignFormData } from "./CreateCampaignFlow";
import { ImagePlus, ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

const CTA_LABELS: Record<string, string> = {
  LEARN_MORE: "Pelajari Selengkapnya",
  SHOP_NOW: "Belanja Sekarang",
  SIGN_UP: "Daftar",
  BOOK_NOW: "Pesan Sekarang",
  CONTACT_US: "Hubungi Kami",
  DOWNLOAD: "Unduh",
  GET_OFFER: "Dapatkan Penawaran",
  GET_QUOTE: "Dapatkan Penawaran Harga",
  SUBSCRIBE: "Berlangganan",
  WATCH_MORE: "Tonton Lebih Lanjut",
  SEND_MESSAGE: "Kirim Pesan",
  INSTALL_NOW: "Instal Sekarang",
  USE_APP: "Gunakan Aplikasi",
  CALL_NOW: "Telepon Sekarang",
  WHATSAPP_MESSAGE: "Kirim Pesan WhatsApp",
  APPLY_NOW: "Lamar Sekarang",
};

function destinationLabel(objective: string, conversionLocation: string): string | null {
  if (objective === "APP_PROMOTION" || conversionLocation === "APP") return "Toko aplikasi";
  if (objective === "LEADS" && conversionLocation === "MESSENGER") return "Formulir instan";
  switch (conversionLocation) {
    case "WHATSAPP": return "WhatsApp";
    case "CALLS": return "Panggilan telepon";
    case "MESSENGER": return "Messenger";
    default: return null; // website → tampilkan domain
  }
}

interface Props {
  data: CampaignFormData;
}

export default function AdPreview({ data }: Props) {
  const pageName = data.identityPage || "Halaman Anda";
  const primaryText = data.primaryText || "Teks utama Anda akan muncul di sini...";
  const headline = data.headline || "Judul";
  const description = data.description || "";
  const ctaLabel = CTA_LABELS[data.cta] || "Pelajari Selengkapnya";
  const destLabel = destinationLabel(data.objective, data.conversionLocation);
  let url = "situsanda.com";
  if (data.destinationUrl) {
    try {
      url = new URL(data.destinationUrl.startsWith("http") ? data.destinationUrl : `https://${data.destinationUrl}`).hostname;
    } catch {
      url = "situsanda.com";
    }
  }
  // Untuk tujuan non-website, tampilkan label tujuan alih-alih domain
  const displayUrl = destLabel ?? url;

  return (
    <div className="space-y-4">
      {/* Facebook Feed Preview */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Facebook Feed</p>
        <div className="border border-[#dddfe2] rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Post header */}
          <div className="p-3 flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0866FF] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {pageName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1c2b33] leading-tight truncate">{pageName}</p>
              <p className="text-xs text-gray-400">Bersponsor · <span className="text-[#0866FF]">🌐</span></p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>

          {/* Primary text */}
          <div className="px-3 pb-2">
            <p className="text-sm text-[#1c2b33] leading-relaxed line-clamp-3">{primaryText}</p>
          </div>

          {/* Media placeholder */}
          <div className="bg-gray-100 aspect-video flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ImagePlus className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs">Gambar/video Anda</p>
            </div>
          </div>

          {/* Headline & CTA bar */}
          <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#dddfe2] bg-gray-50">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{displayUrl}</p>
              <p className="text-sm font-semibold text-[#1c2b33] leading-tight truncate">{headline}</p>
              {description && <p className="text-xs text-gray-500 truncate">{description}</p>}
            </div>
            <button className="ml-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-[#1c2b33] text-xs font-semibold rounded-lg flex-shrink-0">
              {ctaLabel}
            </button>
          </div>

          {/* Engagement bar */}
          <div className="px-3 py-2 flex items-center gap-3 border-t border-[#dddfe2]">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0866FF]">
              <ThumbsUp className="w-3.5 h-3.5" /> Suka
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0866FF]">
              <MessageCircle className="w-3.5 h-3.5" /> Komentar
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0866FF]">
              <Share2 className="w-3.5 h-3.5" /> Bagikan
            </button>
          </div>
        </div>
      </div>

      {/* Instagram Feed Preview */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Instagram Feed</p>
        <div className="border border-[#dddfe2] rounded-xl overflow-hidden bg-white shadow-sm">
          {/* IG header */}
          <div className="p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {pageName.charAt(0)}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#1c2b33]">{data.identityInstagram || pageName}</p>
              <p className="text-xs text-gray-400">Bersponsor</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>

          {/* IG Media */}
          <div className="bg-gray-100 aspect-square flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ImagePlus className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs">Gambar/video Anda</p>
            </div>
          </div>

          {/* IG CTA button */}
          <div className="px-3 py-2">
            <button className="w-full py-2 border border-[#dddfe2] rounded-lg text-xs font-semibold text-[#1c2b33] bg-white hover:bg-gray-50">
              {ctaLabel}
            </button>
            <p className="text-xs font-semibold text-[#1c2b33] mt-2 truncate">{headline}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{primaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
