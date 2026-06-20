import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { name, email, role, balance } = await req.json();

  const ALLOWED_ROLES = ["USER", "ADMIN"];
  const safeRole = ALLOWED_ROLES.includes(role) ? role : undefined;

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (safeRole !== undefined) updateData.role = safeRole;

  const { data: user, error: userError } = await supabase
    .from("User")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });

  if (balance !== undefined) {
    const { error: accountError } = await supabase
      .from("AdAccount")
      .update({ balance, updatedAt: new Date().toISOString() })
      .eq("userId", id);

    if (accountError) return NextResponse.json({ error: accountError.message }, { status: 500 });
  }

  return NextResponse.json(user);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const session = await auth();
  if (id === session!.user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const { error } = await supabase.from("User").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
