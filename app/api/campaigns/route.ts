import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { simulateDailyMetrics } from "@/lib/simulate";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1),
  objective: z.enum(["AWARENESS", "TRAFFIC", "ENGAGEMENT", "LEADS", "APP_PROMOTION", "SALES"]),
  cboEnabled: z.boolean().default(false),
  budgetType: z.enum(["DAILY", "LIFETIME"]).default("DAILY"),
  budgetAmount: z.number().min(0).default(0),
  specialAdCategories: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) return NextResponse.json({ error: "Ad account not found" }, { status: 404 });

  const { data: campaign, error } = await supabase
    .from("Campaign")
    .insert({
      id: randomUUID(),
      adAccountId: adAccount.id,
      name: parsed.data.name,
      objective: parsed.data.objective,
      cboEnabled: parsed.data.cboEnabled,
      budgetType: parsed.data.budgetType,
      budgetAmount: parsed.data.budgetAmount,
      specialAdCategories: JSON.stringify(parsed.data.specialAdCategories),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json(campaign, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) return NextResponse.json([]);

  const { data: campaigns } = await supabase
    .from("Campaign")
    .select("*, adSets:AdSet(count)")
    .eq("adAccountId", adAccount.id)
    .order("createdAt", { ascending: false });

  const campaignsWithCount = (campaigns || []).map((c: any) => ({
    ...c,
    _count: { adSets: c.adSets && c.adSets[0] ? c.adSets[0].count : 0 }
  }));

  return NextResponse.json(campaignsWithCount);
}
