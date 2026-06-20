import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  primaryText: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  cta: z.enum(["LEARN_MORE", "SHOP_NOW", "SIGN_UP", "BOOK_NOW", "CONTACT_US", "DOWNLOAD", "GET_OFFER", "GET_QUOTE", "SUBSCRIBE", "WATCH_MORE"]).optional(),
  destinationUrl: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
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

  // Ownership check via join: Ad → AdSet → Campaign → AdAccount
  const { data: ad } = await supabase
    .from("Ad")
    .select("id, adSet:AdSet(id, campaign:Campaign(adAccountId))")
    .eq("id", id)
    .single();

  const adAccountIdFromAd = (ad as any)?.adSet?.campaign?.adAccountId;
  if (!ad || adAccountIdFromAd !== adAccountId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { mediaUrls, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date().toISOString() };
  if (mediaUrls !== undefined) updateData.mediaUrls = JSON.stringify(mediaUrls);

  const { data: updated, error } = await supabase
    .from("Ad")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = {
    ...updated,
    mediaUrls: (() => { try { return JSON.parse(updated.mediaUrls); } catch { return []; } })(),
  };

  return NextResponse.json(result);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const adAccountId = await getAdAccountId(session.user.id);
  if (!adAccountId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ownership check
  const { data: ad } = await supabase
    .from("Ad")
    .select("id, adSet:AdSet(id, campaign:Campaign(adAccountId))")
    .eq("id", id)
    .single();

  const adAccountIdFromAd = (ad as any)?.adSet?.campaign?.adAccountId;
  if (!ad || adAccountIdFromAd !== adAccountId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase.from("Ad").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
