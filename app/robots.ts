import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSiteSettings();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
