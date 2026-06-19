import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  if (!["ACTIVE", "PAUSED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: campaign } = await supabase
    .from("Campaign")
    .select("*")
    .eq("id", id)
    .eq("adAccountId", adAccount.id)
    .single();

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: updated, error } = await supabase
    .from("Campaign")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(updated);
}
