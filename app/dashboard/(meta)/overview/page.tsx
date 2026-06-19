import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function AccountOverviewPage() {
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
    .select("*")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) {
    return <div className="p-6">Akun tidak ditemukan.</div>;
  }

  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("id")
    .eq("adAccountId", adAccount.id);

  const campaignIds = (campaigns || []).map((c: any) => c.id);

  let chartData: any[] = [];
  let totals = { reach: 0, impressions: 0, results: 0, amountSpent: 0 };

  if (campaignIds.length > 0) {
    const { data: last7Days } = await supabase
      .from("SimMetrics")
      .select("*")
      .eq("entityType", "campaign")
      .in("entityId", campaignIds)
      .order("date", { ascending: true });

    const byDate: Record<string, { reach: number; impressions: number; results: number; amountSpent: number }> = {};
    (last7Days || []).forEach((m: any) => {
      const key = new Date(m.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      if (!byDate[key]) byDate[key] = { reach: 0, impressions: 0, results: 0, amountSpent: 0 };
      byDate[key].reach += m.reach;
      byDate[key].impressions += m.impressions;
      byDate[key].results += m.results;
      byDate[key].amountSpent += m.amountSpent;
    });

    chartData = Object.entries(byDate).map(([date, vals]) => ({ date, ...vals }));
    totals = chartData.reduce(
      (acc, d) => ({
        reach: acc.reach + d.reach,
        impressions: acc.impressions + d.impressions,
        results: acc.results + d.results,
        amountSpent: acc.amountSpent + d.amountSpent,
      }),
      { reach: 0, impressions: 0, results: 0, amountSpent: 0 }
    );
  }

  return <PerformanceChart data={chartData} totals={totals} balance={adAccount.balance} currency={adAccount.currency} />;
}
