import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/siteSettings";
import SettingsForm from "./SettingsForm";
import QrisForm from "./QrisForm";
import { Search, Globe, FileText, Info, CheckCircle, AlertCircle, Users, Megaphone, ShieldCheck, QrCode } from "lucide-react";

export const metadata = { title: "Pengaturan Platform" };

export default async function AdminSettingsPage() {
  const [settings, userCountRes, adminCountRes, campaignCountRes] = await Promise.all([
    getSiteSettings(),
    supabase.from("User").select("*", { count: "exact", head: true }),
    supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "ADMIN"),
    supabase.from("Campaign").select("*", { count: "exact", head: true }),
  ]);

  const userCount = userCountRes.count ?? 0;
  const adminCount = adminCountRes.count ?? 0;
  const campaignCount = campaignCountRes.count ?? 0;

  const keywordList = settings.keywords.split(",").map((k) => k.trim()).filter(Boolean);

  const checklist = [
    { label: "Title tag & template halaman aktif", ok: true },
    { label: "Meta description diisi", ok: settings.description.length > 50 },
    { label: "Keywords ditargetkan (min. 10)", ok: keywordList.length >= 10 },
    { label: "Open Graph (share preview WhatsApp/FB)", ok: true },
    { label: "Twitter Card aktif", ok: true },
    { label: "robots.txt ter-generate otomatis", ok: true },
    { label: "sitemap.xml ter-generate otomatis", ok: true },
    { label: "Canonical URL dikonfigurasi", ok: true },
    { label: "URL situs sudah diisi", ok: settings.siteUrl.startsWith("https://") },
    { label: "OG Image path diisi", ok: !!settings.ogImageUrl },
    { label: "Submit sitemap ke Google Search Console", ok: false, note: `Submit: ${settings.siteUrl}/sitemap.xml` },
    { label: "Daftarkan domain ke Google Search Console", ok: false, note: "Buka search.google.com/search-console" },
  ];

  const done = checklist.filter((c) => c.ok).length;
  const pct = Math.round((done / checklist.length) * 100);

  const stats = [
    { label: "Total Pengguna", value: userCount, icon: Users, light: "bg-blue-50 text-blue-600" },
    { label: "Total Admin", value: adminCount, icon: ShieldCheck, light: "bg-violet-50 text-violet-600" },
    { label: "Total Kampanye", value: campaignCount, icon: Megaphone, light: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight">Pengaturan Platform</h1>
        <p className="text-sm text-gray-400 mt-0.5">Kelola SEO dan konfigurasi situs AdSimulator.</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.light}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1c2b33] leading-none">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Score */}
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

      {/* Two-column: form + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SEO Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-50">
            <div className="p-1.5 rounded-lg bg-[#e7f0ff]">
              <Globe className="w-4 h-4 text-[#0866FF]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c2b33]">Pengaturan SEO</h2>
              <p className="text-xs text-gray-400">Perubahan langsung aktif di seluruh halaman</p>
            </div>
          </div>
          <div className="p-6">
            <SettingsForm settings={settings} />
          </div>
        </div>

        {/* Right column */}
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
                  <span key={kw} className="text-[11px] px-2.5 py-1 bg-[#e7f0ff] text-[#0866FF] rounded-full font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* URL Teknis */}
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
                  <code className="text-[11px] bg-gray-50 text-[#0866FF] px-2 py-1 rounded-lg font-mono block truncate border border-gray-100">
                    {r.url}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Simulasi note */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5">
            <p className="text-sm font-semibold text-amber-800">Mode simulasi aktif</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Semua data bersifat edukasi. Tidak ada koneksi ke API Meta asli, tidak ada biaya nyata.
            </p>
          </div>
        </div>
      </div>

      {/* QRIS Traktir */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-50">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <QrCode className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1c2b33]">Pengaturan QRIS Traktir</h2>
            <p className="text-xs text-gray-400">Konfigurasi QRIS statis untuk fitur donasi pengembang di halaman /traktir</p>
          </div>
        </div>
        <div className="p-6">
          <QrisForm
            initialQris={settings.qrisString ?? ""}
            initialQrisImageUrl={settings.qrisImageUrl ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
