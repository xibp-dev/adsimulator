"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepObjective from "./StepObjective";
import StepCampaign from "./StepCampaign";
import StepAdSet from "./StepAdSet";
import StepAd from "./StepAd";
import AdPreview from "./AdPreview";
import { CampaignObjective, BudgetType, AdFormat, CTA } from "@/types";
import { OBJECTIVE_INFO, PERFORMANCE_GOALS, CONVERSION_LOCATIONS, OBJECTIVE_ADSET_CONFIG, DEFAULT_CTA } from "@/lib/mockData";
import { formatNumber, estimateAudienceSize, estimateDailyResults } from "@/lib/simulate";
import { X, Megaphone, LayoutGrid, FileImage, Loader2, ChevronRight } from "lucide-react";

export interface CampaignFormData {
  // Kampanye
  buyingType: string;
  objective: CampaignObjective;
  name: string;
  specialAdCategories: string[];
  abTestEnabled: boolean;
  cboEnabled: boolean;
  budgetType: BudgetType;
  budgetAmount: number;
  // Set Iklan
  adSetName: string;
  conversionLocation: string;
  datasetPixel: string;
  conversionEvent: string;
  catalogOn: boolean;
  appToPromote: string;
  appStore: string;
  dynamicCreativeOn: boolean;
  performanceGoal: string;
  bidStrategy: string;
  costControlEnabled: boolean;
  costPerResultGoal: number;
  freqCapImpressions: number;
  freqCapDays: number;
  adSetBudgetType: BudgetType;
  adSetBudgetAmount: number;
  scheduleStart: string;
  scheduleEnd: string;
  advantageAudienceOn: boolean;
  customAudiences: string[];
  locations: string[];
  ageMin: number;
  ageMax: number;
  genders: string[];
  detailedTargeting: string[];
  languages: string[];
  advantagePlacementsOn: boolean;
  manualPlacements: string[];
  // Iklan
  adName: string;
  adSetupMode: "CREATE" | "EXISTING_POST";
  identityPage: string;
  identityInstagram: string;
  format: AdFormat;
  primaryText: string;
  headline: string;
  description: string;
  mediaUrls: string[];
  cta: CTA;
  destinationUrl: string;
  instantForm: string;
  contactNumber: string;
  messengerGreeting: string;
  appDeepLink: string;
  trackingUrlParams: string;
}

const defaultData: CampaignFormData = {
  buyingType: "AUCTION",
  objective: "AWARENESS",
  name: "",
  specialAdCategories: [],
  abTestEnabled: false,
  cboEnabled: false,
  budgetType: "DAILY",
  budgetAmount: 100000,
  adSetName: "",
  conversionLocation: "WEBSITE",
  datasetPixel: "",
  conversionEvent: "PURCHASE",
  catalogOn: false,
  appToPromote: "",
  appStore: "GOOGLE_PLAY",
  dynamicCreativeOn: false,
  performanceGoal: "MAXIMIZE_REACH",
  bidStrategy: "LOWEST_COST",
  costControlEnabled: false,
  costPerResultGoal: 0,
  freqCapImpressions: 2,
  freqCapDays: 7,
  adSetBudgetType: "DAILY",
  adSetBudgetAmount: 100000,
  scheduleStart: new Date().toISOString().split("T")[0],
  scheduleEnd: "",
  advantageAudienceOn: true,
  customAudiences: [],
  locations: ["Indonesia"],
  ageMin: 18,
  ageMax: 65,
  genders: [],
  detailedTargeting: [],
  languages: [],
  advantagePlacementsOn: true,
  manualPlacements: [],
  adName: "",
  adSetupMode: "CREATE",
  identityPage: "",
  identityInstagram: "",
  format: "SINGLE_IMAGE_VIDEO",
  primaryText: "",
  headline: "",
  description: "",
  mediaUrls: [],
  cta: "LEARN_MORE",
  destinationUrl: "",
  instantForm: "",
  contactNumber: "",
  messengerGreeting: "Halo! Ada yang bisa kami bantu?",
  appDeepLink: "",
  trackingUrlParams: "",
};

type Level = "campaign" | "adset" | "ad";

interface CreateCampaignFlowProps {
  mode?: "create" | "edit";
  editLevel?: Level;
  entityId?: string;
  initialData?: Partial<CampaignFormData>;
  entityLabels?: { campaign?: string; adset?: string; ad?: string };
}

export default function CreateCampaignFlow({
  mode = "create",
  editLevel,
  entityId,
  initialData,
  entityLabels,
}: CreateCampaignFlowProps = {}) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [objectiveSelected, setObjectiveSelected] = useState(isEdit);
  const [level, setLevel] = useState<Level>(isEdit ? (editLevel ?? "campaign") : "campaign");
  const [data, setData] = useState<CampaignFormData>(
    isEdit ? { ...defaultData, ...initialData } : defaultData
  );
  const [publishing, setPublishing] = useState(false);

  const update = (partial: Partial<CampaignFormData>) => setData((prev) => ({ ...prev, ...partial }));

  // ---- Edit mode: simpan satu entitas via PATCH ----
  const handleSaveEdit = async () => {
    if (!entityId || !editLevel) return;
    setPublishing(true);
    try {
      let url = "";
      let payload: Record<string, unknown> = {};
      if (editLevel === "campaign") {
        url = `/api/campaigns/${entityId}`;
        payload = {
          name: data.name,
          budgetType: data.budgetType,
          budgetAmount: data.budgetAmount,
        };
      } else if (editLevel === "adset") {
        url = `/api/adsets/${entityId}`;
        payload = {
          name: data.adSetName,
          budgetType: data.adSetBudgetType,
          budgetAmount: data.adSetBudgetAmount,
          scheduleStart: data.scheduleStart,
          scheduleEnd: data.scheduleEnd || null,
        };
      } else {
        url = `/api/ads/${entityId}`;
        payload = {
          name: data.adName,
          primaryText: data.primaryText,
          headline: data.headline,
          description: data.description,
          cta: data.cta,
          destinationUrl: data.destinationUrl,
          mediaUrls: data.mediaUrls,
        };
      }
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Penyimpanan gagal");
      router.push("/dashboard/ads-manager");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setPublishing(false);
    }
  };

  // Saat tujuan kampanye berubah, sesuaikan field yang bergantung pada tujuan
  const selectObjective = (obj: CampaignObjective) => {
    const goals = PERFORMANCE_GOALS[obj] ?? [];
    const locs = CONVERSION_LOCATIONS[obj] ?? [];
    const cfg = OBJECTIVE_ADSET_CONFIG[obj];
    setData((prev) => ({
      ...prev,
      objective: obj,
      performanceGoal: goals[0]?.value ?? prev.performanceGoal,
      conversionLocation: locs[0]?.value ?? prev.conversionLocation,
      bidStrategy: cfg?.bidStrategies.includes(prev.bidStrategy) ? prev.bidStrategy : "LOWEST_COST",
      cta: (DEFAULT_CTA[obj] as CampaignFormData["cta"]) ?? prev.cta,
    }));
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const campRes = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          objective: data.objective,
          cboEnabled: data.cboEnabled,
          budgetType: data.budgetType,
          budgetAmount: data.budgetAmount,
          specialAdCategories: data.specialAdCategories,
        }),
      });
      const campaign = await campRes.json();
      if (!campRes.ok) throw new Error("Pembuatan kampanye gagal");

      const adSetRes = await fetch("/api/adsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          name: data.adSetName || `${data.name} - Set Iklan 1`,
          performanceGoal: data.performanceGoal,
          conversionLocation: data.conversionLocation,
          budgetType: data.adSetBudgetType,
          budgetAmount: data.adSetBudgetAmount,
          scheduleStart: data.scheduleStart,
          scheduleEnd: data.scheduleEnd || null,
          advantageAudienceOn: data.advantageAudienceOn,
          locations: data.locations,
          ageMin: data.ageMin,
          ageMax: data.ageMax,
          genders: data.genders,
          detailedTargeting: data.detailedTargeting,
          languages: data.languages,
          advantagePlacementsOn: data.advantagePlacementsOn,
          manualPlacements: data.manualPlacements,
        }),
      });
      const adSet = await adSetRes.json();
      if (!adSetRes.ok) throw new Error("Pembuatan set iklan gagal");

      const adRes = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adSetId: adSet.id,
          name: data.adName || `${data.name} - Iklan 1`,
          identityPage: data.identityPage,
          identityInstagram: data.identityInstagram,
          format: data.format,
          primaryText: data.primaryText,
          headline: data.headline,
          description: data.description,
          mediaUrls: data.mediaUrls,
          cta: data.cta,
          destinationUrl: data.destinationUrl,
        }),
      });
      if (!adRes.ok) throw new Error("Pembuatan iklan gagal");

      router.push("/dashboard/ads-manager");
    } catch (e) {
      console.error(e);
      alert("Gagal membuat kampanye. Coba lagi.");
    } finally {
      setPublishing(false);
    }
  };

  // ---- Objective modal first ----
  if (!objectiveSelected) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f0f2f5] overflow-y-auto">
        <StepObjective
          data={data}
          selected={data.objective}
          buyingType={data.buyingType}
          onBuyingTypeChange={(v) => update({ buyingType: v })}
          onSelect={selectObjective}
          onNext={() => { setObjectiveSelected(true); setLevel("campaign"); }}
        />
      </div>
    );
  }

  const objLabel = OBJECTIVE_INFO[data.objective]?.label ?? data.objective;
  const campaignTitle = (entityLabels?.campaign ?? data.name).trim() || "Kampanye baru";
  const adSetTitle = (entityLabels?.adset ?? data.adSetName).trim() || "Set Iklan baru";
  const adTitle = (entityLabels?.ad ?? data.adName).trim() || "Iklan baru";

  const editTitle =
    editLevel === "campaign" ? "Edit kampanye" :
    editLevel === "adset" ? "Edit set iklan" :
    editLevel === "ad" ? "Edit iklan" : "Edit";

  const saveAction = isEdit ? handleSaveEdit : handlePublish;
  const saveDisabled = isEdit
    ? publishing
    : (publishing || !data.name.trim());

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f0f2f5]">
      {/* ===== Top toolbar ===== */}
      <header className="flex items-center justify-between bg-white border-b border-[#dddfe2] px-3 md:px-4 h-12 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => router.push(isEdit ? "/dashboard/ads-manager" : "/dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1c2b33] px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" /> {isEdit ? "Batal" : "Tutup"}
          </button>
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />
          <span className="text-sm font-semibold text-[#1c2b33] truncate">{isEdit ? editTitle : "Buat kampanye"}</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400">
            <ChevronRight className="w-3 h-3" /> {objLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <button
            onClick={() => router.push(isEdit ? "/dashboard/ads-manager" : "/dashboard")}
            className="hidden sm:block px-3 py-1.5 text-sm font-semibold text-[#1c2b33] hover:bg-gray-100 rounded-lg"
          >
            {isEdit ? "Batal" : "Buang draf"}
          </button>
          <button
            onClick={saveAction}
            disabled={saveDisabled}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white rounded-lg whitespace-nowrap"
          >
            {publishing && <Loader2 className="w-4 h-4 animate-spin" />}
            {/* Mobile: ringkas */}
            <span className="sm:hidden">
              {isEdit
                ? (publishing ? "Menyimpan..." : "Simpan")
                : (publishing ? "Memublikasi..." : "Publikasi")}
            </span>
            {/* Desktop: lengkap */}
            <span className="hidden sm:inline">
              {isEdit
                ? (publishing ? "Menyimpan..." : "Simpan perubahan")
                : (publishing ? "Memublikasikan..." : "Publikasikan")}
            </span>
          </button>
        </div>
      </header>

      {/* ===== 3-panel body ===== */}
      <div className="flex-1 flex min-h-0">
        {/* ---- Left: navigation tree ---- */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-[#dddfe2] overflow-y-auto hidden md:block">
          <div className="p-3">
            <NavNode
              icon={<Megaphone className="w-4 h-4" />}
              title={campaignTitle}
              subtitle={objLabel}
              active={level === "campaign"}
              disabled={isEdit && editLevel !== "campaign"}
              onClick={() => setLevel("campaign")}
              depth={0}
            />
            <NavNode
              icon={<LayoutGrid className="w-4 h-4" />}
              title={adSetTitle}
              subtitle="Set Iklan"
              active={level === "adset"}
              disabled={isEdit && editLevel !== "adset"}
              onClick={() => setLevel("adset")}
              depth={1}
            />
            <NavNode
              icon={<FileImage className="w-4 h-4" />}
              title={adTitle}
              subtitle="Iklan"
              active={level === "ad"}
              disabled={isEdit && editLevel !== "ad"}
              onClick={() => setLevel("ad")}
              depth={2}
            />
          </div>
        </aside>

        {/* ---- Center: form ---- */}
        <main className={`flex-1 overflow-y-auto bg-[#f0f2f5] ${level === "ad" ? "overflow-hidden" : ""}`}>
          {/* Mobile level tabs */}
          <div className="md:hidden flex border-b border-[#dddfe2] bg-white sticky top-0 z-10">
            {([["campaign", "Kampanye"], ["adset", "Set Iklan"], ["ad", "Iklan"]] as const).map(([lv, lb]) => {
              const tabDisabled = isEdit && editLevel !== lv;
              return (
                <button
                  key={lv}
                  onClick={() => { if (!tabDisabled) setLevel(lv); }}
                  disabled={tabDisabled}
                  className={`flex-1 py-2.5 text-sm font-medium ${
                    level === lv ? "text-[#0866FF] border-b-2 border-[#0866FF]" : "text-gray-500"
                  } ${tabDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {lb}
                </button>
              );
            })}
          </div>

          {level === "campaign" && (
            <StepCampaign data={data} onChange={update} onNext={isEdit ? handleSaveEdit : () => setLevel("adset")} />
          )}
          {level === "adset" && (
            <StepAdSet data={data} onChange={update} onNext={isEdit ? handleSaveEdit : () => setLevel("ad")} />
          )}
          {level === "ad" && (
            <StepAd data={data} onChange={update} onPublish={saveAction} publishing={publishing} />
          )}
        </main>

        {/* ---- Right panel: hidden on ad step (preview is built-in) ---- */}
        {level !== "ad" && (
          <aside className="w-80 flex-shrink-0 bg-white border-l border-[#dddfe2] overflow-y-auto hidden lg:block">
            <RightPanel level={level} data={data} />
          </aside>
        )}
      </div>
    </div>
  );
}

function NavNode({
  icon, title, subtitle, active, onClick, depth, disabled,
}: {
  icon: React.ReactNode; title: string; subtitle: string;
  active: boolean; onClick: () => void; depth: number; disabled?: boolean;
}) {
  return (
    <div style={{ paddingLeft: depth * 16 }} className="relative">
      {depth > 0 && (
        <span className="absolute left-2 top-0 bottom-1/2 w-px bg-gray-200" style={{ left: depth * 16 - 8 }} />
      )}
      <button
        onClick={() => { if (!disabled) onClick(); }}
        disabled={disabled}
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors mb-1 ${
          active ? "bg-[#e7f0ff]" : disabled ? "" : "hover:bg-gray-50"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <span className={active ? "text-[#0866FF]" : "text-gray-400"}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className={`block text-sm font-medium truncate ${active ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>
            {title}
          </span>
          <span className="block text-xs text-gray-400 truncate">{subtitle}</span>
        </span>
      </button>
    </div>
  );
}

function RightPanel({ level, data }: { level: Level; data: CampaignFormData }) {
  if (level === "ad") {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm text-[#1c2b33] mb-4">Pratinjau iklan</h3>
        <AdPreview data={data} />
      </div>
    );
  }

  if (level === "adset") {
    const audienceSize = estimateAudienceSize({
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      locations: data.locations,
      advantagePlacementsOn: data.advantagePlacementsOn,
    });
    const dailyResults = estimateDailyResults(data.adSetBudgetAmount, data.objective);
    return (
      <div className="p-5">
        <h3 className="font-semibold text-sm text-[#1c2b33] mb-4">Estimasi hasil harian</h3>
        <div className="space-y-4">
          <Estimate label="Ukuran pemirsa" value={`${formatNumber(audienceSize)}–${formatNumber(Math.round(audienceSize * 1.2))}`} unit="orang" />
          <Estimate label="Jangkauan harian" value={`${formatNumber(Math.round(dailyResults.min * 8))}–${formatNumber(Math.round(dailyResults.max * 12))}`} unit="orang per hari" />
          <Estimate label="Hasil" value={`${dailyResults.min}–${dailyResults.max}`} unit="per hari (estimasi)" />
        </div>
        <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700 leading-relaxed">
            Estimasi ini disimulasikan untuk tujuan edukasi. Hasil sebenarnya dapat berbeda berdasarkan banyak faktor.
          </p>
        </div>
      </div>
    );
  }

  // campaign-level tips
  return (
    <div className="p-5">
      <h3 className="font-semibold text-sm text-[#1c2b33] mb-3">Tentang level kampanye</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Di level kampanye, Anda menetapkan tujuan dan struktur. Tujuan memberi tahu Meta tipe orang
        yang harus diprioritaskan untuk iklan Anda.
      </p>
      <div className="space-y-3">
        <Tip
          title={`Tujuan: ${OBJECTIVE_INFO[data.objective]?.label ?? ""}`}
          body={OBJECTIVE_INFO[data.objective]?.description ?? ""}
        />
        <Tip title="Penamaan yang jelas" body="Gunakan format konsisten seperti Promo_Lebaran2026_Penjualan_ID agar mudah dikelola." />
        <Tip title="Anggaran stabil" body="Pengeluaran harian yang stabil umumnya berperforma lebih baik daripada lonjakan besar." />
      </div>
    </div>
  );
}

function Estimate({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-[#1c2b33]">{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
}

function Tip({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg border border-[#dddfe2]">
      <p className="text-sm font-semibold text-[#1c2b33] mb-0.5">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
    </div>
  );
}
