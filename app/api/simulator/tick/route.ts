import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { evaluateAd } from "@/lib/evaluate";
import { simulateDailyMetrics } from "@/lib/simulate";
import { randomUUID } from "crypto";

// This endpoint can be called periodically (e.g. via cron or manually via a button)
// to process IN_REVIEW ads and transition them to ACTIVE or REJECTED.
export async function GET() {
  try {
    // 1. Fetch ads that are IN_REVIEW
    // In a real scenario, we might check if they have been in review for > 5 mins
    // For the simulator, we will just process all IN_REVIEW ads that are at least 1 minute old
    const { data: adsInReview, error: fetchError } = await supabase
      .from("Ad")
      .select("*, adSet:AdSet(*, campaign:Campaign(*))")
      .eq("status", "IN_REVIEW");

    if (fetchError) throw fetchError;
    if (!adsInReview || adsInReview.length === 0) {
      return NextResponse.json({ message: "No ads pending review." });
    }

    const processedIds = [];

    for (const ad of adsInReview) {
      // 2. Evaluate Ad Copy
      const evaluation = evaluateAd({
        headline: ad.headline || "",
        primaryText: ad.primaryText || "",
        description: ad.description || ""
      });

      // 3. Update Ad Status & Evaluation Result
      await supabase
        .from("Ad")
        .update({
          status: evaluation.status,
          qualityScore: evaluation.qualityScore,
          rejectionReason: evaluation.rejectionReason || null,
          updatedAt: new Date().toISOString()
        })
        .eq("id", ad.id);

      // If ad is approved, generate initial metrics based on qualityScore
      if (evaluation.status === "ACTIVE" && ad.adSet) {
        const adSet = Array.isArray(ad.adSet) ? ad.adSet[0] : ad.adSet;
        const campaign = Array.isArray(adSet.campaign) ? adSet.campaign[0] : adSet.campaign;

        if (adSet && campaign) {
          const locations = adSet.locations ? JSON.parse(adSet.locations as string) : [];
          
          // Generate metrics using the new qualityScore multiplier
          const metrics = simulateDailyMetrics({
            budgetAmount: adSet.budgetAmount || campaign.budgetAmount,
            budgetType: adSet.budgetType as "DAILY" | "LIFETIME",
            objective: campaign.objective as import("@/types").CampaignObjective,
            ageMin: adSet.ageMin,
            ageMax: adSet.ageMax,
            advantagePlacementsOn: adSet.advantagePlacementsOn,
            locations,
            qualityScore: evaluation.qualityScore // Pass the score!
          });

          const baseMetric = {
            id: randomUUID(),
            reach: metrics.reach,
            impressions: metrics.impressions,
            results: metrics.results,
            costPerResult: metrics.costPerResult,
            amountSpent: metrics.amountSpent,
            ctr: metrics.ctr,
            cpm: metrics.cpm,
            frequency: metrics.frequency,
            date: new Date().toISOString(),
          };

          await supabase.from("SimMetrics").insert({ entityType: "ad", entityId: ad.id, ...baseMetric, id: randomUUID() });
          await supabase.from("SimMetrics").insert({ entityType: "adset", entityId: adSet.id, ...baseMetric, id: randomUUID() });
          await supabase.from("SimMetrics").insert({ entityType: "campaign", entityId: adSet.campaignId, ...baseMetric, id: randomUUID() });

          // Kurangi saldo akun iklan sesuai belanja awal yang disimulasikan
          if (campaign.adAccountId) {
            const { data: account } = await supabase
              .from("AdAccount")
              .select("id, balance")
              .eq("id", campaign.adAccountId)
              .maybeSingle();
            if (account) {
              await supabase
                .from("AdAccount")
                .update({ balance: Math.max(0, account.balance - metrics.amountSpent) })
                .eq("id", account.id);
            }
          }

          // Update AdSet status to ACTIVE if it has at least one ACTIVE ad
          await supabase.from("AdSet").update({ status: "ACTIVE" }).eq("id", adSet.id);
        }
      } else if (evaluation.status === "REJECTED") {
        // If rejected, check if AdSet has any other active ads, if not, maybe leave it or mark as rejected?
        // We'll leave the AdSet as IN_REVIEW for simplicity, or we could mark it REJECTED.
      }

      processedIds.push(ad.id);
    }

    return NextResponse.json({ 
      message: `Processed ${processedIds.length} ads.`,
      processedIds 
    });

  } catch (error: any) {
    console.error("Tick Simulator Error:", error);
    return NextResponse.json({ error: "Tick Failed", details: error.message }, { status: 500 });
  }
}
