import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1),
  pixelCode: z.string(),
  template: z.enum(["ecommerce", "leadform", "simple"]),
  title: z.string().min(1),
  headline: z.string().min(1),
  description: z.string(),
  price: z.string().default("0"),
  ctaText: z.string().min(1),
  buttonEvent: z.string().min(1),
  imageUrl: z.string(),
  trackingRules: z.array(z.any()).default([]),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("LandingPage")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { trackingRules, ...rest } = parsed.data;
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("LandingPage")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        ...rest,
        trackingRules: JSON.stringify(trackingRules),
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ...data, trackingRules: JSON.parse(data.trackingRules || "[]") }, { status: 201 });
  } catch (error) {
    console.error("Create landing page error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
