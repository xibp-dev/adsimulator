import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { evaluateAd } from "@/lib/evaluate";
import { simulateDailyMetrics } from "@/lib/simulate";
import { randomUUID } from "crypto";

// Proses iklan IN_REVIEW milik user yang sedang login → ACTIVE/REJECTED.
// Dipanggil saat membuka Kelola Iklan. Semua operasi DB dibatch agar ringan.
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Akun iklan milik user — sekaligus dipakai untuk update saldo di akhir
    const { data: account } = await supabase
      .from("AdAccount")
      .select("id, balance")
      .eq("userId", session.user.id)
      .maybeSingle();

    if (!account) {
      return NextResponse.json({ message: "No ads pending review.", processedIds: [] });
    }

    // Hanya iklan IN_REVIEW milik akun ini (inner join agar filter nested bekerja)
    const { data: adsInReview, error: fetchError } = await supabase
      .from("Ad")
      .select(
        "id, headline, primaryText, description, adSet:AdSet!inner(id, campaignId, budgetAmount, budgetType, ageMin, ageMax, advantagePlacementsOn, locations, campaign:Campaign!inner(id, adAccountId, objective, budgetAmount))"
      )
      .eq("status", "IN_REVIEW")
      .eq("adSet.campaign.adAccountId", account.id);

    if (fetchError) throw fetchError;
    if (!adsInReview || adsInReview.length === 0) {
      return NextResponse.json({ message: "No ads pending review.", processedIds: [] });
    }

    const processedIds: string[] = [];
    const adUpdates: PromiseLike<unknown>[] = [];
    const metricRows: Record<string, unknown>[] = [];
    const activatedAdSetIds = new Set<string>();
    let totalSpent = 0;
    const now = new Date().toISOString();

    for (const ad of adsInReview) {
      const evaluation = evaluateAd({
        headline: ad.headline || "",
        primaryText: ad.primaryText || "",
        description: ad.description || "",
      });

      adUpdates.push(
        supabase
          .from("Ad")
          .update({
            status: evaluation.status,
            qualityScore: evaluation.qualityScore,
            rejectionReason: evaluation.rejectionReason || null,
            updatedAt: now,
          })
          .eq("id", ad.id)
          .then()
      );

      const adSet = Array.isArray(ad.adSet) ? ad.adSet[0] : ad.adSet;
      const campaign = adSet && (Array.isArray(adSet.campaign) ? adSet.campaign[0] : adSet.campaign);

      if (evaluation.status === "ACTIVE" && adSet && campaign) {
        const locations = adSet.locations ? JSON.parse(adSet.locations as string) : [];

        const metrics = simulateDailyMetrics({
          budgetAmount: adSet.budgetAmount || campaign.budgetAmount,
          budgetType: adSet.budgetType as "DAILY" | "LIFETIME",
          objective: campaign.objective as import("@/types").CampaignObjective,
          ageMin: adSet.ageMin,
          ageMax: adSet.ageMax,
          advantagePlacementsOn: adSet.advantagePlacementsOn,
          locations,
          qualityScore: evaluation.qualityScore,
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
          date: now,
        };

        metricRows.push(
          { id: randomUUID(), entityType: "ad", entityId: ad.id, ...baseMetric },
          { id: randomUUID(), entityType: "adset", entityId: adSet.id, ...baseMetric },
          { id: randomUUID(), entityType: "campaign", entityId: adSet.campaignId, ...baseMetric }
        );

        totalSpent += metrics.amountSpent;
        activatedAdSetIds.add(adSet.id);
      }

      processedIds.push(ad.id);
    }

    // Eksekusi semua penulisan sekaligus
    const writes: PromiseLike<unknown>[] = [...adUpdates];
    if (metricRows.length > 0) {
      writes.push(supabase.from("SimMetrics").insert(metricRows).then());
    }
    if (activatedAdSetIds.size > 0) {
      writes.push(
        supabase.from("AdSet").update({ status: "ACTIVE" }).in("id", [...activatedAdSetIds]).then()
      );
    }
    if (totalSpent > 0) {
      writes.push(
        supabase
          .from("AdAccount")
          .update({ balance: Math.max(0, account.balance - totalSpent) })
          .eq("id", account.id)
          .then()
      );
    }
    await Promise.all(writes);

    return NextResponse.json({
      message: `Processed ${processedIds.length} ads.`,
      processedIds,
    });
  } catch (error: unknown) {
    console.error("Tick Simulator Error:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Tick Failed", details }, { status: 500 });
  }
}
