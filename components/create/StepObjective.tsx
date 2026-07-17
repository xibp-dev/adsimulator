"use client";

import { CampaignFormData } from "./CreateCampaignFlow";
import { CampaignObjective } from "@/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import GuidePanel from "./GuidePanel";

interface ObjectiveConfig {
  value: CampaignObjective;
  label: string;
  description: string;
  suitableFor: string[];
  color: string;
  illustration: React.ReactNode;
}

const objectives: ObjectiveConfig[] = [
  {
    value: "AWARENESS",
    label: "Awareness",
    description: "Tampilkan iklan Anda ke orang yang kemungkinan besar akan mengingatnya.",
    suitableFor: ["Jangkauan", "Brand awareness", "Tayangan video"],
    color: "#1877F2",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#E8F4FD" />
        <circle cx="60" cy="60" r="38" fill="#BDD9F5" />
        <ellipse cx="60" cy="72" rx="28" ry="10" fill="#1877F2" opacity="0.15" />
        {/* Megaphone */}
        <path d="M38 52 L55 45 L55 75 L38 68 Z" fill="#1877F2" />
        <rect x="30" y="52" width="10" height="16" rx="3" fill="#1877F2" />
        <path d="M55 52 Q75 42 80 60 Q75 78 55 68 Z" fill="#4A9FE8" />
        {/* Sound waves */}
        <path d="M83 50 Q92 60 83 70" stroke="#1877F2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M87 46 Q99 60 87 74" stroke="#1877F2" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    value: "TRAFFIC",
    label: "Traffic",
    description: "Kirim orang ke destinasi, seperti situs web, aplikasi, profil Instagram, atau acara Facebook.",
    suitableFor: ["Klik tautan", "Tayangan halaman tujuan", "Kunjungan profil Instagram", "Messenger, Instagram, dan WhatsApp", "Telepon"],
    color: "#F59E0B",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#FEF3C7" />
        <circle cx="60" cy="60" r="38" fill="#FDE68A" />
        {/* Browser window */}
        <rect x="28" y="38" width="64" height="46" rx="5" fill="white" />
        <rect x="28" y="38" width="64" height="12" rx="5" fill="#F59E0B" />
        <circle cx="36" cy="44" r="2.5" fill="white" opacity="0.7" />
        <circle cx="44" cy="44" r="2.5" fill="white" opacity="0.7" />
        <circle cx="52" cy="44" r="2.5" fill="white" opacity="0.7" />
        {/* Cursor arrow */}
        <path d="M70 65 L70 85 L75 79 L80 89 L83 87 L78 77 L85 74 Z" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    value: "ENGAGEMENT",
    label: "Interaksi",
    description: "Dapatkan lebih banyak pesan, tayangan video, interaksi postingan, suka Halaman, atau respons acara.",
    suitableFor: ["Pesan", "Interaksi postingan", "Suka Halaman", "Respons acara", "Tayangan video"],
    color: "#059669",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#D1FAE5" />
        <circle cx="60" cy="60" r="38" fill="#6EE7B7" />
        {/* Chat bubble */}
        <rect x="30" y="38" width="55" height="38" rx="8" fill="white" />
        <path d="M42 76 L35 88 L56 76 Z" fill="white" />
        {/* Like icon lines */}
        <rect x="38" y="50" width="20" height="3" rx="1.5" fill="#059669" />
        <rect x="38" y="57" width="30" height="3" rx="1.5" fill="#059669" />
        <rect x="38" y="64" width="25" height="3" rx="1.5" fill="#059669" />
        {/* Heart */}
        <path d="M72 50 C72 47 69 45 66 47 C63 45 60 47 60 50 C60 54 66 59 66 59 C66 59 72 54 72 50 Z" fill="#F87171" />
      </svg>
    ),
  },
  {
    value: "LEADS",
    label: "Prospek",
    description: "Kumpulkan prospek untuk bisnis atau merek Anda.",
    suitableFor: ["Situs web dan formulir instan", "Formulir Instan", "Messenger, Instagram, dan WhatsApp", "Konversi", "Telepon"],
    color: "#8B5CF6",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#EDE9FE" />
        <circle cx="60" cy="60" r="38" fill="#C4B5FD" />
        {/* Person */}
        <circle cx="60" cy="48" r="12" fill="#F97316" />
        <path d="M38 82 C38 70 48 63 60 63 C72 63 82 70 82 82" fill="#F97316" />
        {/* Checkmark */}
        <circle cx="78" cy="44" r="12" fill="white" />
        <path d="M72 44 L76 48 L84 40" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "APP_PROMOTION",
    label: "Promosi aplikasi",
    description: "Cari orang baru untuk menginstal aplikasi Anda dan terus menggunakannya.",
    suitableFor: ["Penginstalan aplikasi", "Peristiwa aplikasi"],
    color: "#7C3AED",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#F3E8FF" />
        <circle cx="60" cy="60" r="38" fill="#DDD6FE" />
        {/* Phone */}
        <rect x="44" y="30" width="32" height="55" rx="5" fill="white" />
        <rect x="48" y="36" width="24" height="36" rx="2" fill="#7C3AED" opacity="0.2" />
        <circle cx="60" cy="80" r="3" fill="#7C3AED" opacity="0.5" />
        {/* Star/app icon */}
        <path d="M60 40 L62.5 47 L70 47 L64 51.5 L66.5 58.5 L60 54 L53.5 58.5 L56 51.5 L50 47 L57.5 47 Z" fill="#7C3AED" />
        {/* Download arrow */}
        <path d="M60 60 L60 70 M55 65 L60 70 L65 65" stroke="#7C3AED" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "SALES",
    label: "Penjualan",
    description: "Cari orang yang kemungkinan akan membeli produk atau layanan Anda.",
    suitableFor: ["Konversi", "Penjualan katalog", "Messenger, Instagram, dan WhatsApp", "Telepon"],
    color: "#0891B2",
    illustration: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="#E0F2FE" />
        <circle cx="60" cy="60" r="38" fill="#7DD3FC" />
        {/* Shopping bag */}
        <path d="M42 55 L45 85 L75 85 L78 55 Z" fill="white" />
        <path d="M50 55 C50 47 53 40 60 40 C67 40 70 47 70 55" stroke="#0891B2" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Shopping cart wheels */}
        <circle cx="50" cy="88" r="3" fill="#0891B2" />
        <circle cx="70" cy="88" r="3" fill="#0891B2" />
        {/* Tag */}
        <path d="M56 68 L64 68 L64 76 L60 80 L56 76 Z" fill="#0891B2" opacity="0.6" />
      </svg>
    ),
  },
];

interface Props {
  data: CampaignFormData;
  onSelect: (obj: CampaignObjective) => void;
  selected: CampaignObjective;
  buyingType: string;
  onBuyingTypeChange: (v: string) => void;
  onNext: () => void;
}

export default function StepObjective({ data, selected, onSelect, buyingType, onBuyingTypeChange, onNext }: Props) {
  const router = useRouter();
  const selectedConfig = objectives.find((o) => o.value === selected) ?? objectives[0];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5] p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#dddfe2]">
          <div className="flex items-center gap-0">
            <button className="px-4 py-1.5 text-sm font-semibold text-[#0866FF] border-b-2 border-[#0866FF]">
              Buat kampanye baru
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-500">
              Set iklan atau iklan baru
            </button>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guide Panel – Langkah 1 */}
        <div className="px-5 pt-4">
          <GuidePanel
            title="📋 Panduan: Tujuan Kampanye"
            summary="Langkah pertama dalam membuat iklan di Meta Ads adalah memilih TUJUAN KAMPANYE (Objective). Tujuan menentukan apa yang ingin kamu capai dengan iklan ini — apakah kamu ingin lebih dikenal orang, mendatangkan kunjungan ke website, mendapatkan leads, atau meningkatkan penjualan."
            tips={[
              {
                field: "Jenis Pembelian (Buying Type)",
                what: "Cara kamu membayar iklan. 'Lelang' (Auction) artinya kamu bersaing dengan pengiklan lain secara real-time untuk menampilkan iklan. 'Reservasi' artinya kamu memesan slot iklan di muka dengan harga tetap.",
                recommendation: "Gunakan Lelang untuk fleksibilitas dan efisiensi biaya. Gunakan Reservasi hanya jika kamu punya event besar dan butuh jangkauan yang terjamin pada tanggal tertentu.",
              },
              {
                field: "Tujuan Kampanye (Objective)",
                what: "Pilihan tujuan utama iklan kamu. Meta akan mengoptimalkan penayangan iklan kepada orang-orang yang paling mungkin melakukan aksi sesuai tujuan yang dipilih.",
                recommendation: "Pilih 'Traffic' jika ingin mengarahkan orang ke website atau landing page. Pilih 'Leads' untuk mengumpulkan data calon pelanggan. Pilih 'Sales/Conversions' jika kamu ingin mendorong pembelian langsung. Untuk brand baru, mulai dengan 'Awareness' terlebih dahulu.",
              },
            ]}
            defaultOpen
          />
        </div>

        {/* Buying type */}
        <div className="px-5 pt-4 pb-2">
          <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
            Pilih jenis pembelian{" "}
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs ml-0.5 cursor-help">i</span>
          </label>
          <select
            value={buyingType}
            onChange={(e) => onBuyingTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          >
            <option value="AUCTION">Lelang</option>
            <option value="RESERVATION">Reservasi</option>
          </select>
        </div>

        {/* Objective section */}
        <div className="px-5 pb-2">
          <p className="text-sm font-semibold text-[#1c2b33] mb-3">Pilih tujuan kampanye</p>
        </div>

        <div className="flex flex-col md:flex-row border-t border-[#dddfe2]" style={{ minHeight: 320 }}>
          {/* Left: Radio list */}
          <div className="w-full md:w-[220px] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#dddfe2] py-1">
            {objectives.map((obj) => {
              const isSelected = selected === obj.value;
              return (
                <button
                  key={obj.value}
                  onClick={() => onSelect(obj.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                    isSelected ? "bg-[#e7f0ff]" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Radio */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-[#0866FF]" : "border-gray-400"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0866FF]" />}
                  </div>
                  {/* Objective icon */}
                  <ObjectiveIcon value={obj.value} active={isSelected} />
                  <span className={isSelected ? "text-[#0866FF]" : "text-[#1c2b33]"}>{obj.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Detail panel */}
          <div className="flex-1 p-5 flex flex-col">
            {/* Illustration */}
            <div className="w-24 h-24 mx-auto mb-4">
              {selectedConfig.illustration}
            </div>

            {/* Title & description */}
            <p className="font-bold text-[#1c2b33] mb-1">{selectedConfig.label}</p>
            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{selectedConfig.description}</p>

            {/* Suitable for */}
            <p className="text-sm font-semibold text-[#1c2b33] mb-2">Sesuai untuk:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedConfig.suitableFor.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#dddfe2]">
          <button className="text-sm text-[#0866FF] hover:underline font-medium">
            Tentang tujuan kampanye
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm font-semibold text-[#1c2b33] border border-[#dddfe2] rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={onNext}
              className="px-5 py-2 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ObjectiveIcon({ value, active }: { value: CampaignObjective; active: boolean }) {
  const color = active ? "#0866FF" : "#65676B";
  const icons: Record<CampaignObjective, React.ReactNode> = {
    AWARENESS: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 11V13L5 13V11L3 11ZM21 11L19 11V13L21 13V11ZM12 3V5H14V3H12ZM12 19V21H14V19H12ZM5.636 5.636L7.05 7.05L8.464 5.636L7.05 4.222L5.636 5.636ZM16.95 16.95L15.536 18.364L16.95 19.778L18.364 18.364L16.95 16.95ZM16.95 7.05L18.364 8.464L19.778 7.05L18.364 5.636L16.95 7.05ZM5.636 18.364L7.05 16.95L5.636 15.536L4.222 16.95L5.636 18.364Z" fill={color} />
        <path d="M8 11L5 8L8 8" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M7 12C7 9.239 9.239 7 12 7C14.761 7 17 9.239 17 12C17 14.761 14.761 17 12 17C9.239 17 7 14.761 7 12Z" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    TRAFFIC: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M13 3L21 12L13 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    ENGAGEMENT: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    LEADS: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V19C4 16.239 6.239 14 9 14H15C17.761 14 20 16.239 20 19V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
        <path d="M16 11L18 13L22 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    APP_PROMOTION: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="18" rx="2" stroke={color} strokeWidth="1.8" />
        <path d="M10 6H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill={color} />
      </svg>
    ),
    SALES: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 10C16 12.209 14.209 14 12 14C9.791 14 8 12.209 8 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };
  return <span className="flex-shrink-0">{icons[value]}</span>;
}
