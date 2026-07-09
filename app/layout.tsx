import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { getSiteSettings } from "@/lib/siteSettings";
import { GTMScript, GTMNoScript } from "@/components/GoogleTagManager";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const keywords = s.keywords.split(",").map((k) => k.trim()).filter(Boolean);

  return {
    metadataBase: new URL(s.siteUrl),

    title: {
      default: s.title,
      template: `%s | ${s.siteName}`,
    },
    description: s.description,
    keywords,

    authors: [{ name: s.siteName, url: s.siteUrl }],
    creator: s.siteName,
    publisher: s.siteName,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      url: s.siteUrl,
      siteName: s.siteName,
      title: s.title,
      description: s.description,
      images: [{ url: s.ogImageUrl, width: 1200, height: 630, alt: s.title }],
    },

    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: [s.ogImageUrl],
    },

    alternates: {
      canonical: s.siteUrl,
      languages: { "id-ID": s.siteUrl },
    },

    category: "education",

    verification: {
      google: "oxbRS09d7RU4FvsFCv8-jNqR1VcpqNUWsxeKZ4CAIHQ",
    },
    icons: s.faviconUrl ? {
      icon: s.faviconUrl,
      shortcut: s.faviconUrl,
      apple: s.faviconUrl,
    } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  const gtmId = s.gtmContainerId?.trim() || "";

  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full bg-[#f0f2f5] antialiased`}>
        {/* GTM noscript — tepat setelah <body> */}
        <GTMNoScript id={gtmId} />
        <SessionProvider>
          {children}
        </SessionProvider>
        {/* GTM script */}
        <GTMScript id={gtmId} />
      </body>
    </html>
  );
}
