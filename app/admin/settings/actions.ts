"use server";

import { updateSiteSettings, SITE_SETTINGS_TAG } from "@/lib/siteSettings";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveSeoSettings(formData: FormData) {
  const values = {
    siteUrl: (formData.get("siteUrl") as string)?.trim(),
    siteName: (formData.get("siteName") as string)?.trim(),
    title: (formData.get("title") as string)?.trim(),
    description: (formData.get("description") as string)?.trim(),
    keywords: (formData.get("keywords") as string)?.trim(),
    ogImageUrl: (formData.get("ogImageUrl") as string)?.trim(),
  };

  const result = await updateSiteSettings(values);
  if (result.success) {
    revalidateTag(SITE_SETTINGS_TAG);
    revalidatePath("/", "layout");
  }
  return result;
}
