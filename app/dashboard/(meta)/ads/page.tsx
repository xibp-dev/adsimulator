import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdTable from "@/components/dashboard/AdTable";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function AdsPage() {
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
    return <AdTable ads={[]} />;
  }

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("id")
    .eq("adAccountId", adAccount.id);

  const campaignIds = (campaigns || []).map((c: any) => c.id);

  if (campaignIds.length === 0) {
    return <AdTable ads={[]} />;
  }

  // Fetch ad sets
  const { data: adSets } = await supabase
    .from("AdSet")
    .select("id, name, campaign:Campaign(name)")
    .in("campaignId", campaignIds);

  const adSetIds = (adSets || []).map((s: any) => s.id);

  if (adSetIds.length === 0) {
    return <AdTable ads={[]} />;
  }

  // Fetch ads
  const { data: ads } = await supabase
    .from("Ad")
    .select("*")
    .in("adSetId", adSetIds)
    .order("createdAt", { ascending: false });

  const adsList = ads || [];

  // Map them to include their adSet hierarchy
  const mappedAds = adsList.map((ad: any) => {
    const parentSet = (adSets || []).find((s: any) => s.id === ad.adSetId);
    const campaignInfo: any = parentSet?.campaign && Array.isArray(parentSet.campaign) 
      ? parentSet.campaign[0] 
      : (parentSet?.campaign || {});
    return {
      ...ad,
      adSet: {
        id: parentSet?.id || "",
        name: parentSet?.name || "",
        campaign: {
          name: campaignInfo?.name || ""
        }
      }
    };
  });

  const adIds = mappedAds.map((ad: any) => ad.id);
  
  let metricsByAd: Record<string, any[]> = {};
  if (adIds.length > 0) {
    const { data: allMetrics } = await supabase
      .from("SimMetrics")
      .select("*")
      .eq("entityType", "ad")
      .in("entityId", adIds);

    if (allMetrics) {
      allMetrics.forEach((m: any) => {
        if (!metricsByAd[m.entityId]) metricsByAd[m.entityId] = [];
        metricsByAd[m.entityId].push(m);
      });
    }
  }

  const adsWithMetrics = mappedAds.map((ad: any) => {
    const mList = metricsByAd[ad.id] || [];
    mList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      ...ad,
      simMetrics: mList.slice(0, 1)
    };
  });

  return <AdTable ads={adsWithMetrics as any} />;
}
