"use server";

import { updateSiteSettings, SITE_SETTINGS_TAG } from "@/lib/siteSettings";
import { revalidatePath, updateTag } from "next/cache";

export async function saveSeoSettings(formData: FormData) {
  // Hanya field yang dikirim form yang disimpan — field absen (undefined) tidak menimpa nilai lama.
  const values = {
    siteUrl: (formData.get("siteUrl") as string | null)?.trim(),
    siteName: (formData.get("siteName") as string | null)?.trim(),
    title: (formData.get("title") as string | null)?.trim(),
    description: (formData.get("description") as string | null)?.trim(),
    keywords: (formData.get("keywords") as string | null)?.trim(),
    ogImageUrl: (formData.get("ogImageUrl") as string | null)?.trim(),
    logoUrl: (formData.get("logoUrl") as string | null)?.trim(),
    faviconUrl: (formData.get("faviconUrl") as string | null)?.trim(),
    gtmContainerId: (formData.get("gtmContainerId") as string | null)?.trim(),
  };

  const result = await updateSiteSettings(values);
  if (result.success) {
    updateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}

export async function setTraktirEnabled(enabled: boolean) {
  const result = await updateSiteSettings({ traktirEnabled: enabled });
  if (result.success) {
    updateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}

export async function saveCertificateSettings(formData: FormData) {
  const values = {
    certInstitution: (formData.get("certInstitution") as string)?.trim() || "AdSimulator Academy",
    certSignatory: (formData.get("certSignatory") as string)?.trim() || "AdSimulator Academy",
    certSignatoryTitle: (formData.get("certSignatoryTitle") as string)?.trim() || "Penyelenggara",
    certLogoUrl: (formData.get("certLogoUrl") as string)?.trim() ?? "",
    certAccent: (formData.get("certAccent") as string)?.trim() || "#0866FF",
  };

  const result = await updateSiteSettings(values);
  if (result.success) {
    updateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}

export async function setSurveyEnabled(enabled: boolean) {
  const result = await updateSiteSettings({ surveyEnabled: enabled });
  if (result.success) {
    updateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}

export async function saveSurveyConfig(config: import("@/lib/siteSettings").SurveyConfig) {
  const result = await updateSiteSettings({ surveyConfig: config });
  if (result.success) {
    updateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}
