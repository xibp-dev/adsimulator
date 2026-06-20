import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  pixelCode: z.string().optional(),
  template: z.enum(["ecommerce", "leadform", "simple"]).optional(),
  title: z.string().min(1).optional(),
  headline: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  ctaText: z.string().min(1).optional(),
  buttonEvent: z.string().min(1).optional(),
  imageUrl: z.string().optional(),
  trackingRules: z.array(z.any()).optional(),
});

async function ownsPage(userId: string, id: string) {
  const { data } = await supabaseAdmin
    .from("LandingPage")
    .select("id")
    .eq("id", id)
    .eq("userId", userId)
    .single();
  return !!data;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await ownsPage(session.user.id, params.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { trackingRules, ...rest } = parsed.data;
    const updates: Record<string, unknown> = { ...rest, updatedAt: new Date().toISOString() };
    if (trackingRules !== undefined) {
      updates.trackingRules = JSON.stringify(trackingRules);
    }

    const { data, error } = await supabaseAdmin
      .from("LandingPage")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ...data, trackingRules: JSON.parse(data.trackingRules || "[]") });
  } catch (error) {
    console.error("Update landing page error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await ownsPage(session.user.id, params.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("LandingPage")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json({ success: true });
}
