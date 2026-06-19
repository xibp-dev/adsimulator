import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  
  try {
    const { error } = await supabase.from("Ad").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  
  try {
    const { status, rejectionReason } = await req.json();

    const { data: adRaw, error: adError } = await supabase
      .from("Ad")
      .update({
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        id, name, status, adSetId,
        adSet:AdSet(id, campaignId)
      `)
      .single();

    if (adError) return NextResponse.json({ error: adError.message }, { status: 500 });

    const adSetRaw = Array.isArray(adRaw.adSet) ? adRaw.adSet[0] : adRaw.adSet;

    // If approved, initialize metrics if they do not exist
    if (status === "ACTIVE" && adSetRaw) {
      const { data: existingMetrics } = await supabase
        .from("SimMetrics")
        .select("id")
        .eq("entityType", "ad")
        .eq("entityId", adRaw.id)
        .maybeSingle();

      if (!existingMetrics) {
        const baseMetric = {
          reach: 1200,
          impressions: 1500,
          results: 15,
          costPerResult: 500,
          amountSpent: 7500,
          ctr: 1.0,
          cpm: 5000,
          frequency: 1.25,
          date: new Date().toISOString(),
        };

        await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "ad", entityId: adRaw.id, ...baseMetric });
        await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "adset", entityId: adSetRaw.id, ...baseMetric });
        await supabase.from("SimMetrics").insert({ id: randomUUID(), entityType: "campaign", entityId: adSetRaw.campaignId, ...baseMetric });
      }

      // Update AdSet status to ACTIVE
      await supabase.from("AdSet").update({ status: "ACTIVE" }).eq("id", adSetRaw.id);
    }

    const formattedAd = {
      ...adRaw,
      adSet: adSetRaw
        ? {
            id: adSetRaw.id,
            campaignId: adSetRaw.campaignId
          }
        : null
    };

    return NextResponse.json(formattedAd);
  } catch (error) {
    console.error("Error updating ad status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
