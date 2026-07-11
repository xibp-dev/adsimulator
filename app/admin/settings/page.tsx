import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";
import SeoForm from "./SeoForm";
import BrandingForm from "./BrandingForm";
import QrisForm from "./QrisForm";
import CertificateForm from "./CertificateForm";
import TraktirToggle from "./TraktirToggle";
import { Search, Globe, Info, CheckCircle, AlertCircle, QrCode, Award, Palette, FileText } from "lucide-react";

export const metadata = { title: "Pengaturan Platform" };

type Tab = "seo" | "branding" | "qris" | "sertifikat";

const TABS: { id: Tab; label: string; icon: typeof Globe; desc: string }[] = [
  { id: "seo", label: "SEO", icon: Search, desc: "Judul, deskripsi, keywords, dan skor kesiapan SEO" },
  { id: "branding", label: "Branding & Integrasi", icon: Palette, desc: "Logo, favicon, dan Google Tag Manager" },
  { id: "qris", label: "QRIS & Pembayaran", icon: QrCode, desc: "QRIS untuk traktir dan pembayaran langganan" },
  { id: "sertifikat", label: "Sertifikat", icon: Award, desc: "Desain sertifikat kelulusan LMS" },
];

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab = (TABS.some((t) => t.id === tabParam) ? tabParam : "seo") as Tab;
  const settings = await getSiteSettings();

  const keywordList = settings.keywords.split(",").map((k) => k.trim()).filter(Boolean);

  const checklist = [
    { label: "Title tag & template halaman aktif", ok: true },
    { label: "Meta description diisi", ok: settings.description.length > 50 },
    { label: "Keywords ditargetkan (min. 10)", ok: keywordList.length >= 10 },
    { label: "Open Graph (share preview WhatsApp/FB)", ok: true },
    { label: "robots.txt & sitemap.xml ter-generate", ok: true },
    { label: "URL situs sudah diisi", ok: settings.siteUrl.startsWith("https://") },
    { label: "OG Image path diisi", ok: !!settings.ogImageUrl },
    { label: "Google Tag Manager terpasang", ok: /^GTM-[A-Z0-9]+$/i.test((settings.gtmContainerId ?? "").trim()) },
    { label: "Submit sitemap ke Google Search Console", ok: false, note: `Submit: ${settings.siteUrl}/sitemap.xml` },
  ];
  const done = checklist.filter((c) => c.ok).length;
  const pct = Math.round((done / checklist.length) * 100);

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Pengaturan Platform</h1>
        <p className="text-sm text-gray-400 mt-0.5">Setiap kategori pengaturan dipisah per tab agar mudah dikelola.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin/settings?tab=${t.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              tab === t.id ? "bg-white text-[#0866FF] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── TAB: SEO ── */}
      {tab === "seo" && (
        <div className="space-y-5">
          {/* Skor SEO */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#e7f0ff]">
                  <Search className="w-4 h-4 text-[#0866FF]" />
                </div>
                <h2 className="text-base font-bold text-[#1c2b33]">Skor Kesiapan SEO</h2>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                pct >= 80 ? "text-emerald-600 bg-emerald-50" : pct >= 60 ? "text-amber-600 bg-amber-50" : "text-red-500 bg-red-50"
              }`}>
                {done}/{checklist.length} ({pct}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  {item.ok
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className={`text-sm ${item.ok ? "text-gray-600" : "text-gray-700 font-medium"}`}>{item.label}</p>
                    {item.note && (
                      <p className="text-[11px] text-amber-500 flex items-center gap-1 mt-0.5">
                        <Info className="w-3 h-3 flex-shrink-0" />{item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <SectionHeader icon={Search} title="Pengaturan SEO" desc={active.desc} />
              <div className="p-6"><SeoForm settings={settings} /></div>
            </div>
            <div className="space-y-5">
              {/* Keywords */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-bold text-[#1c2b33]">Keywords Aktif</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{keywordList.length}</span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {keywordList.map((kw) => (
                      <span key={kw} className="text-[11px] px-2.5 py-1 bg-[#e7f0ff] text-[#0866FF] rounded-full font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* URL teknis */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-bold text-[#1c2b33]">URL Teknis SEO</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { label: "Sitemap XML", url: `${settings.siteUrl}/sitemap.xml`, desc: "Submit ke Google Search Console" },
                    { label: "Robots.txt", url: `${settings.siteUrl}/robots.txt`, desc: "Arahan crawl bot Google" },
                  ].map((r) => (
                    <div key={r.label} className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#1c2b33]">{r.label}</p>
                      <p className="text-xs text-gray-400 mb-1.5">{r.desc}</p>
                      <code className="text-[11px] bg-gray-50 text-[#0866FF] px-2 py-1 rounded-lg font-mono block truncate border border-gray-100">{r.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Branding & Integrasi ── */}
      {tab === "branding" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl">
          <SectionHeader icon={Palette} title="Branding & Integrasi" desc={active.desc} />
          <div className="p-6"><BrandingForm settings={settings} /></div>
        </div>
      )}

      {/* ── TAB: QRIS ── */}
      {tab === "qris" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl">
          <SectionHeader icon={QrCode} title="QRIS & Pembayaran" desc="Dipakai di halaman Traktir dan checkout langganan Kelas Premium" />
          <div className="p-6 space-y-6">
            <TraktirToggle initialEnabled={settings.traktirEnabled !== false} />
            <QrisForm
              initialQris={settings.qrisString ?? ""}
              initialQrisImageUrl={settings.qrisImageUrl ?? ""}
            />
          </div>
        </div>
      )}

      {/* ── TAB: Sertifikat ── */}
      {tab === "sertifikat" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader icon={Award} title="Desain Sertifikat" desc="Logo, lembaga, penandatangan, dan warna sertifikat kelulusan" />
          <div className="p-6"><CertificateForm settings={settings} /></div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: typeof Globe; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-50">
      <div className="p-1.5 rounded-lg bg-[#e7f0ff]">
        <Icon className="w-4 h-4 text-[#0866FF]" />
      </div>
      <div>
        <h2 className="text-base font-bold text-[#1c2b33]">{title}</h2>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  );
}
