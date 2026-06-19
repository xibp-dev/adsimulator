import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1, "Nama Pixel wajib diisi"),
  websiteUrl: z.string().url("Format URL website tidak valid"),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pixels, error } = await supabase
    .from("Pixel")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  if (!pixels || pixels.length === 0) {
    return NextResponse.json([]);
  }

  // 1. Get all pixel IDs
  const pixelIds = pixels.map((p) => p.id);

  // 2. Fetch all events for these pixels in a single query
  const { data: events, error: eventsError } = await supabase
    .from("PixelEvent")
    .select("pixelId")
    .in("pixelId", pixelIds);

  if (eventsError) {
    console.error("Failed to fetch pixel events:", eventsError);
  }

  // 3. Map count in memory
  const eventCounts: Record<string, number> = {};
  if (events) {
    events.forEach((evt) => {
      eventCounts[evt.pixelId] = (eventCounts[evt.pixelId] || 0) + 1;
    });
  }

  const formattedPixels = pixels.map((p) => ({
    ...p,
    eventsCount: eventCounts[p.id] || 0,
  }));

  return NextResponse.json(formattedPixels);
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

    const { data: pixel, error } = await supabase
      .from("Pixel")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        name: parsed.data.name,
        websiteUrl: parsed.data.websiteUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(pixel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
