import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdSetTable from "@/components/dashboard/AdSetTable";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function AdSetsPage() {
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
    return <AdSetTable adSets={[]} />;
  }

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("id, name, objective")
    .eq("adAccountId", adAccount.id);

  const campaignIds = (campaigns || []).map((c: any) => c.id);

  if (campaignIds.length === 0) {
    return <AdSetTable adSets={[]} />;
  }

  // Fetch ad sets
  const { data: adSets } = await supabase
    .from("AdSet")
    .select("*")
    .in("campaignId", campaignIds)
    .order("createdAt", { ascending: false });

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

  const adSetsWithCounts = adSetsList.map((adSet: any) => {
    const campaignInfo = (campaigns || []).find((c: any) => c.id === adSet.campaignId);
    const mList = metricsBySet[adSet.id] || [];
    mList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      ...adSet,
      campaign: campaignInfo || { id: "", name: "", objective: "" },
      _count: { ads: adsCountBySet[adSet.id] ?? 0 },
      simMetrics: mList.slice(0, 1)
    };
  });

  return <AdSetTable adSets={adSetsWithCounts as any} />;
}
