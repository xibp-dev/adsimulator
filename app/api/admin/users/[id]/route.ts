import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { name, email, role, balance, password } = await req.json();

  const ALLOWED_ROLES = ["USER", "ADMIN"];
  const safeRole = ALLOWED_ROLES.includes(role) ? role : undefined;

  // Cek email unik bila diubah
  if (email !== undefined) {
    const { data: dupe } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .neq("id", id)
      .maybeSingle();
    if (dupe) return NextResponse.json({ error: "Email sudah dipakai pengguna lain" }, { status: 409 });
  }

  // Validasi & hash password baru bila di-reset
  if (password !== undefined && password !== "") {
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Kata sandi minimal 6 karakter" }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (safeRole !== undefined) updateData.role = safeRole;
  if (password !== undefined && password !== "") {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  // Ambil/perbarui data user
  let user;
  if (Object.keys(updateData).length > 0) {
    const { data, error: userError } = await supabase
      .from("User").update(updateData).eq("id", id).select().single();
    if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });
    user = data;
  } else {
    const { data } = await supabase.from("User").select().eq("id", id).single();
    user = data;
  }

  if (balance !== undefined) {
    const { error: accountError } = await supabase
      .from("AdAccount")
      .update({ balance })
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
