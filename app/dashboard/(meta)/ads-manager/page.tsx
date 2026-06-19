import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CampaignTable from "@/components/dashboard/CampaignTable";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function AdsManagerPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Check prerequisites — paralel
  const [{ count: portfoliosCount }, { count: pagesCount }] = await Promise.all([
    supabase.from("BusinessPortfolio").select("*", { count: "exact", head: true }).eq("userId", session.user.id),
    supabase.from("Fanspage").select("*", { count: "exact", head: true }).eq("userId", session.user.id),
  ]);

  const hasPortfolio = (portfoliosCount ?? 0) > 0;
  const hasPage = (pagesCount ?? 0) > 0;

  if (!hasPortfolio || !hasPage) {
    return <PrerequisiteWarning hasPortfolio={hasPortfolio} hasPage={hasPage} />;
  }

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

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

  // Ambil semua metrik dalam SATU query (hindari N+1), lalu kelompokkan di memori
  let metricsByCampaign: Record<string, any[]> = {};
  if (campaignIds.length > 0) {
    const { data: allMetrics } = await supabase
      .from("SimMetrics")
      .select("*")
      .eq("entityType", "campaign")
      .in("entityId", campaignIds)
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
