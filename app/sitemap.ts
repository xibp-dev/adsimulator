import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getSiteSettings();
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
