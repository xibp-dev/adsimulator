import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

async function ownsAccount(userId: string, id: string) {
  const { data } = await supabase
    .from("SocialAccount")
    .select("id")
    .eq("id", id)
    .eq("userId", userId)
    .maybeSingle();
  return !!data;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownsAccount(session.user.id, id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("SocialAccount")
    .delete()
    .eq("id", id)
    .eq("userId", session.user.id);

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json({ success: true });
}
