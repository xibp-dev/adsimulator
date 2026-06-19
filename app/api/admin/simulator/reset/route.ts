import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { error } = await supabase.from("SimMetrics").delete().neq("id", "");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "Seluruh data metrik simulasi telah dibersihkan." });
  } catch (error: any) {
    console.error("Reset Simulation Error:", error);
    return NextResponse.json({ error: "Failed to reset simulation", details: error.message }, { status: 550 });
  }
}
