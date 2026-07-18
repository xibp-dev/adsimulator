import { supabaseAdmin } from "./supabase";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const SITE_SETTINGS_TAG = "site-settings";

export interface SiteSettings {
  id: string;
  siteUrl: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string;
  qrisString: string;
  logoUrl: string;
  faviconUrl: string;
  qrisImageUrl: string;
  gtmContainerId: string;
  certInstitution: string;
  certSignatory: string;
  certSignatoryTitle: string;
  certLogoUrl: string;
  certAccent: string;
  traktirEnabled: boolean;
  surveyEnabled: boolean;
  updatedAt: string;
}

const DEFAULTS: SiteSettings = {
  id: "singleton",
  siteUrl: "https://adsimulator.web.id",
  siteName: "AdSimulator",
  title: "AdSimulator - Simulator Iklan Facebook, Instagram & Ads Digital Gratis",
  description:
    "AdSimulator adalah platform simulator iklan digital berbahasa Indonesia. Belajar Facebook Ads, Instagram Ads, dan Meta Ads Manager secara gratis tanpa budget nyata. Cocok untuk pemula, pebisnis, dan digital marketer.",
  keywords:
    "simulator iklan,simulator iklan facebook,simulator meta ads,belajar iklan facebook,belajar meta ads,belajar iklan instagram,cara buat iklan facebook,latihan meta ads manager,praktek iklan digital,kursus iklan facebook gratis,simulator ads manager,belajar digital marketing,cara pasang iklan facebook,iklan instagram tutorial,meta business suite simulator,belajar facebook ads pemula,simulasi kampanye iklan,tools belajar iklan,latihan iklan tanpa modal,edukasi iklan digital,adsimulator",
  ogImageUrl: "/og-image.png",
  qrisString: "",
  logoUrl: "",
  faviconUrl: "",
  qrisImageUrl: "",
  gtmContainerId: "",
  certInstitution: "AdSimulator Academy",
  certSignatory: "AdSimulator Academy",
  certSignatoryTitle: "Penyelenggara",
  certLogoUrl: "",
  certAccent: "#0866FF",
  traktirEnabled: true,
  surveyEnabled: false,
  updatedAt: new Date().toISOString(),
};

// Cache lintas-request (1 jam) + dedupe per-request (React cache).
// Settings jarang berubah; di-invalidate via updateTag saat admin menyimpan.
const fetchSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("SiteSettings")
        .select("*")
        .eq("id", "singleton")
        .single();
      if (error || !data) return DEFAULTS;
      return data as SiteSettings;
    } catch {
      return DEFAULTS;
    }
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_TAG], revalidate: 3600 }
);

export const getSiteSettings = cache(fetchSiteSettings);

export async function updateSiteSettings(
  values: Partial<Omit<SiteSettings, "id" | "updatedAt">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from("SiteSettings")
      .upsert({ id: "singleton", ...values, updatedAt: new Date().toISOString() });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: String(e) };
  }
}
