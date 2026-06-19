import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pixelId, eventName, url } = body;

    if (!pixelId || !eventName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify Pixel exists
    const { data: pixel } = await supabase
      .from("Pixel")
      .select("id")
      .eq("id", pixelId)
      .single();

    if (!pixel) {
      return NextResponse.json({ error: "Invalid Pixel ID" }, { status: 404 });
    }

    // Save Event
    const { error: insertError } = await supabase
      .from("PixelEvent")
      .insert({
        pixelId,
        eventName,
        url: url || "Unknown URL",
        createdAt: new Date().toISOString()
      });

    if (insertError) {
      console.error("Pixel Event Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
    }

    // Since this is a pixel tracker, we could respond with a 1x1 transparent GIF in a real scenario
    // but a standard JSON 200 OK is fine for our simulator
    return NextResponse.json({ success: true, message: `Event ${eventName} tracked` });
  } catch (error) {
    console.error("Tracker error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
