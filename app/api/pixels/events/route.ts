import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const pixelId = searchParams.get("pixelId");

  if (!pixelId) {
    return NextResponse.json({ error: "Missing pixelId" }, { status: 400 });
  }

  // Verify the pixel belongs to the user
  const { data: pixel } = await supabase
    .from("Pixel")
    .select("id")
    .eq("id", pixelId)
    .eq("userId", session.user.id)
    .single();

  if (!pixel) {
    return NextResponse.json({ error: "Pixel not found" }, { status: 404 });
  }

  // Fetch 20 latest events
  const { data: events, error } = await supabase
    .from("PixelEvent")
    .select("*")
    .eq("pixelId", pixelId)
    .order("createdAt", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json(events || []);
}
