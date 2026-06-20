import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query = supabase.from("Preset").select("*");
    if (type) {
      query = query.eq("type", type);
    }
    
    const { data: presets, error } = await query.order("createdAt", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(presets || []);
  } catch (error) {
    console.error("Error fetching presets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
