import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  budgetType: z.enum(["DAILY", "LIFETIME"]).optional(),
  budgetAmount: z.number().min(0).optional(),
});

async function getAdAccountId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", userId)
    .single();
  return data?.id ?? null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const adAccountId = await getAdAccountId(session.user.id);
  if (!adAccountId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ownership check
  const { data: campaign } = await supabase
    .from("Campaign")
    .select("id")
    .eq("id", id)
    .eq("adAccountId", adAccountId)
    .single();

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: updated, error } = await supabase
    .from("Campaign")
    .update({ ...parsed.data, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const adAccountId = await getAdAccountId(session.user.id);
  if (!adAccountId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ownership check
  const { data: campaign } = await supabase
    .from("Campaign")
    .select("id")
    .eq("id", id)
    .eq("adAccountId", adAccountId)
    .single();

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete cascade: Ads → AdSets → Campaign
  const { data: adSets } = await supabase.from("AdSet").select("id").eq("campaignId", id);
  const adSetIds = (adSets ?? []).map((a: any) => a.id);
  if (adSetIds.length > 0) {
    await supabase.from("Ad").delete().in("adSetId", adSetIds);
    await supabase.from("AdSet").delete().in("id", adSetIds);
  }

  const { error } = await supabase.from("Campaign").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
