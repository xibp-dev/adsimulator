import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatNumber } from "@/lib/simulate";
import { OBJECTIVE_INFO } from "@/lib/mockData";
import { CampaignObjective } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { ChevronLeft } from "lucide-react";

async function latest(entityType: string, entityId: string) {
  const { data } = await supabase
    .from("SimMetrics")
    .select("*")
    .eq("entityType", entityType)
    .eq("entityId", entityId)
    .order("date", { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) return <div className="p-6 text-gray-500">Akun iklan tidak ditemukan.</div>;

  const { data: campaign } = await supabase
    .from("Campaign")
    .select("*")
    .eq("id", id)
    .eq("adAccountId", adAccount.id)
    .single();

  if (!campaign) notFound();

  // Fetch adSets + metrik kampanye secara paralel (keduanya hanya butuh campaign.id)
  const [{ data: adSets }, cm] = await Promise.all([
    supabase.from("AdSet").select("*").eq("campaignId", campaign.id).order("createdAt", { ascending: false }),
    latest("campaign", campaign.id),
  ]);

  const adSetsList = adSets || [];
  const adSetIds = adSetsList.map((a: any) => a.id);

  // Batch fetch ads-count & metrics secara PARALEL (keduanya hanya butuh adSetIds)
  const adsCountBySet: Record<string, number> = {};
  const metricsBySet: Record<string, any[]> = {};
  if (adSetIds.length > 0) {
    const [{ data: allAds }, { data: allMetrics }] = await Promise.all([
      supabase.from("Ad").select("id, adSetId").in("adSetId", adSetIds),
      supabase.from("SimMetrics").select("*").eq("entityType", "adset").in("entityId", adSetIds),
    ]);
    (allAds ?? []).forEach((ad: any) => {
      adsCountBySet[ad.adSetId] = (adsCountBySet[ad.adSetId] ?? 0) + 1;
    });
    (allMetrics ?? []).forEach((m: any) => {
      (metricsBySet[m.entityId] ??= []).push(m);
    });
  }

  const adSetsWithMetrics = adSetsList.map((adSet: any) => {
    const mList = metricsBySet[adSet.id] || [];
    mList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      ...adSet,
      ads: { length: adsCountBySet[adSet.id] ?? 0 },
      m: mList[0] ?? null
    };
  });

  const objLabel = OBJECTIVE_INFO[campaign.objective as CampaignObjective]?.label ?? campaign.objective;

  const stat = (label: string, value: string) => (
    <div className="bg-white rounded-xl border border-[#dddfe2] p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-[#1c2b33]">{value}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/ads-manager" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1c2b33]">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Kampanye
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c2b33]">{campaign.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {objLabel} · Anggaran {campaign.budgetType === "DAILY" ? "harian" : "seumur hidup"} {formatCurrency(campaign.budgetAmount)}
          </p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stat("Hasil", formatNumber(cm?.results ?? 0))}
        {stat("Jangkauan", formatNumber(cm?.reach ?? 0))}
        {stat("Tayangan", formatNumber(cm?.impressions ?? 0))}
        {stat("Jumlah dibelanjakan", formatCurrency(cm?.amountSpent ?? 0))}
      </div>

      {/* Ad sets */}
      <div className="bg-white rounded-xl border border-[#dddfe2]">
        <div className="px-5 py-4 border-b border-[#dddfe2] flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[#1c2b33]">Set Iklan ({adSetsList.length})</h2>
          <Link href="/dashboard/create" className="text-sm text-[#0866FF] hover:underline">+ Buat set iklan</Link>
        </div>
        {adSetsWithMetrics.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Belum ada set iklan di kampanye ini.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f2f5] bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Nama set iklan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Anggaran</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Iklan</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Hasil</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Jangkauan</th>
              </tr>
            </thead>
            <tbody>
              {adSetsWithMetrics.map((a) => (
                <tr key={a.id} className="border-b border-[#f0f2f5] hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-[#1c2b33]">{a.name}</td>
                  <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3 text-gray-500">{formatCurrency(a.budgetAmount)}</td>
                  <td className="px-5 py-3 text-right text-[#1c2b33]">{a.ads.length}</td>
                  <td className="px-5 py-3 text-right font-medium text-[#1c2b33]">{formatNumber(a.m?.results ?? 0)}</td>
                  <td className="px-5 py-3 text-right text-[#1c2b33]">{formatNumber(a.m?.reach ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
