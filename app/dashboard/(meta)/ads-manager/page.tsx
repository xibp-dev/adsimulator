import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAdAccount } from "@/lib/adAccount";
import CampaignTable from "@/components/dashboard/CampaignTable";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function AdsManagerPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Check prerequisites + akun iklan — paralel (getAdAccount di-dedupe dengan layout)
  const [{ count: portfoliosCount }, { count: pagesCount }, adAccount] = await Promise.all([
    supabase.from("BusinessPortfolio").select("id", { count: "exact", head: true }).eq("userId", session.user.id),
    supabase.from("Fanspage").select("id", { count: "exact", head: true }).eq("userId", session.user.id),
    getAdAccount(session.user.id),
  ]);

  const hasPortfolio = (portfoliosCount ?? 0) > 0;
  const hasPage = (pagesCount ?? 0) > 0;

  if (!hasPortfolio || !hasPage) {
    return <PrerequisiteWarning hasPortfolio={hasPortfolio} hasPage={hasPage} />;
  }

  if (!adAccount) {
    return <CampaignTable campaigns={[]} />;
  }

  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("*, adSets:AdSet(count)")
    .eq("adAccountId", adAccount.id)
    .order("createdAt", { ascending: false });

  const campaignsList = campaigns ?? [];
  const campaignIds = campaignsList.map((c: any) => c.id);

  // Ambil metrik dalam SATU query (hindari N+1), dibatasi 14 hari terakhir
  // karena tabel hanya memakai 7 baris terbaru per campaign
  let metricsByCampaign: Record<string, any[]> = {};
  if (campaignIds.length > 0) {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: allMetrics } = await supabase
      .from("SimMetrics")
      .select("entityId, date, reach, impressions, results, costPerResult, amountSpent, ctr, cpm, frequency")
      .eq("entityType", "campaign")
      .in("entityId", campaignIds)
      .gte("date", since)
      .order("date", { ascending: false });

    metricsByCampaign = (allMetrics ?? []).reduce((acc: Record<string, any[]>, m: any) => {
      (acc[m.entityId] ??= []).push(m);
      return acc;
    }, {});
  }

  const campaignsWithMetrics = campaignsList.map((campaign: any) => ({
    ...campaign,
    _count: { adSets: campaign.adSets && campaign.adSets[0] ? campaign.adSets[0].count : 0 },
    simMetrics: (metricsByCampaign[campaign.id] ?? []).slice(0, 7),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <CampaignTable campaigns={campaignsWithMetrics as any} />;
}
