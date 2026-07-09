import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

// Cari user (admin) untuk pemilihan cepat — dipakai di modal "Buat Langganan Manual"
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json([]);

  const { data } = await supabase
    .from("User")
    .select("id, name, email")
    .eq("role", "USER")
    .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
    .limit(8);

  return NextResponse.json(data || []);
}
