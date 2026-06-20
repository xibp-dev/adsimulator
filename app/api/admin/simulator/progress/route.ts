import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { simulateDailyMetrics } from "@/lib/simulate";
import { randomUUID } from "crypto";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    // 1. Fetch all ACTIVE ads
    const { data: activeAds, error: adsError } = await supabase
      .from("Ad")
      .select(`
        id, name, qualityScore,
        adSet:AdSet(
          id, budgetAmount, budgetType, locations, advantagePlacementsOn, ageMin, ageMax,
          campaign:Campaign(id, budgetAmount, objective, adAccountId)
        )
      `)
      .eq("status", "ACTIVE");

    if (adsError) return NextResponse.json({ error: adsError.message }, { status: 500 });
    if (!activeAds || activeAds.length === 0) {
      return NextResponse.json({ message: "Tidak ada iklan aktif untuk diproses." });
    }

    const newMetricsCount = [];

    // Calculate progression date: next day after last metric
    for (const ad of activeAds) {
      const adSetRaw = Array.isArray(ad.adSet) ? ad.adSet[0] : ad.adSet;
      const campaignRaw = adSetRaw?.campaign 
        ? (Array.isArray(adSetRaw.campaign) ? adSetRaw.campaign[0] : adSetRaw.campaign)
        : null;

      if (!adSetRaw || !campaignRaw) continue;

      // Find last metric date
      const { data: lastMetric } = await supabase
        .from("SimMetrics")
        .select("date")
        .eq("entityType", "ad")
        .eq("entityId", ad.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      let nextDate = new Date();
      if (lastMetric) {
        nextDate = new Date(lastMetric.date);
        nextDate.setDate(nextDate.getDate() + 1); // Advance by 1 day
      }

      const locations = adSetRaw.locations ? JSON.parse(adSetRaw.locations) : [];

      // Simulate new day metrics
      const metrics = simulateDailyMetrics({
        budgetAmount: adSetRaw.budgetAmount || campaignRaw.budgetAmount,
        budgetType: adSetRaw.budgetType as any,
        objective: campaignRaw.objective as any,
        ageMin: adSetRaw.ageMin,
        ageMax: adSetRaw.ageMax,
        advantagePlacementsOn: adSetRaw.advantagePlacementsOn,
        locations,
        qualityScore: ad.qualityScore || 1.0,
      });

      const baseMetric = {
        reach: metrics.reach,
        impressions: metrics.impressions,
        results: metrics.results,
        costPerResult: metrics.costPerResult,
        amountSpent: metrics.amountSpent,
        ctr: metrics.ctr,
        cpm: metrics.cpm,
        frequency: metrics.frequency,
        date: nextDate.toISOString(),
      };

      // Create new metrics for Ad, AdSet, and Campaign
      await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "ad", entityId: ad.id, ...baseMetric });
      await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "adset", entityId: adSetRaw.id, ...baseMetric });
      await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "campaign", entityId: campaignRaw.id, ...baseMetric });

      // Deduct budget spent from user ad account balance
      const { data: account } = await supabase
        .from("AdAccount")
        .select("id, balance")
        .eq("id", campaignRaw.adAccountId)
        .maybeSingle();

      if (account) {
        await supabase
          .from("AdAccount")
          .update({
            balance: Math.max(0, account.balance - metrics.amountSpent),
          })
          .eq("id", account.id);
      }

      newMetricsCount.push(ad.name);
    }

    return NextResponse.json({
      success: true,
      message: `Simulasi progres hari baru selesai untuk ${newMetricsCount.length} iklan.`,
      ads: newMetricsCount,
    });
  } catch (error: any) {
    console.error("Progress Simulation Error:", error);
    return NextResponse.json({ error: "Failed to simulate progression", details: error.message }, { status: 500 });
  }
}
