import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adAccount, error: acctError } = await supabase
    .from("AdAccount")
    .select("*")
    .eq("userId", session.user.id)
    .single();

  if (acctError || !adAccount) {
    return NextResponse.json({ error: "Ad Account tidak ditemukan" }, { status: 404 });
  }

  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("id")
    .eq("adAccountId", adAccount.id);

  const campaignIds = (campaigns || []).map((c: any) => c.id);

  let metrics: any[] = [];
  if (campaignIds.length > 0) {
    const { data: rawMetrics } = await supabase
      .from("SimMetrics")
      .select("*")
      .eq("entityType", "campaign")
      .in("entityId", campaignIds)
      .order("date", { ascending: false });
    
    if (rawMetrics) metrics = rawMetrics;
  }

  const totalSpent = metrics.reduce((s: number, m: any) => s + m.amountSpent, 0);

  // Build simulated monthly statements
  const byMonth: Record<string, number> = {};
  metrics.forEach((m: any) => {
    const key = new Date(m.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    byMonth[key] = (byMonth[key] ?? 0) + m.amountSpent;
  });
  const statements = Object.entries(byMonth);

  return NextResponse.json({
    adAccount,
    campaigns: campaigns || [],
    totalSpent,
    statements
  });
}
