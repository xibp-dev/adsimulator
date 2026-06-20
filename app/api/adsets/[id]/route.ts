import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  budgetType: z.enum(["DAILY", "LIFETIME"]).optional(),
  budgetAmount: z.number().min(0).optional(),
  scheduleStart: z.string().optional(),
  scheduleEnd: z.string().nullable().optional(),
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

  // Ownership check via join: AdSet → Campaign → AdAccount
  const { data: adSet } = await supabase
    .from("AdSet")
    .select("id, campaign:Campaign(adAccountId)")
    .eq("id", id)
    .single();

  if (!adSet || (adSet as any).campaign?.adAccountId !== adAccountId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date().toISOString() };
  if (parsed.data.scheduleStart) updateData.scheduleStart = new Date(parsed.data.scheduleStart).toISOString();
  if (parsed.data.scheduleEnd) updateData.scheduleEnd = new Date(parsed.data.scheduleEnd).toISOString();
  if (parsed.data.scheduleEnd === null) updateData.scheduleEnd = null;

  const { data: updated, error } = await supabase
    .from("AdSet")
    .update(updateData)
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
  const { data: adSet } = await supabase
    .from("AdSet")
    .select("id, campaign:Campaign(adAccountId)")
    .eq("id", id)
    .single();

  if (!adSet || (adSet as any).campaign?.adAccountId !== adAccountId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete ads first
  await supabase.from("Ad").delete().eq("adSetId", id);

  const { error } = await supabase.from("AdSet").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
