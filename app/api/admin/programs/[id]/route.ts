import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  thumbnailEmoji: z.string().optional(),
  accent: z.enum(["blue", "violet", "pink", "emerald", "amber", "indigo"]).optional(),
  isFree: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// PATCH: Update program
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  // Check slug uniqueness if changing slug
  if (parsed.data.slug) {
    const { data: dupe } = await supabaseAdmin.from("Program").select("id").eq("slug", parsed.data.slug).neq("id", id).limit(1);
    if (dupe && dupe.length > 0) return NextResponse.json({ error: "Slug sudah digunakan program lain." }, { status: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("Program")
    .update({ ...parsed.data, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal memperbarui program" }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE: Hapus program (courses tidak ikut terhapus, programId jadi null)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await supabaseAdmin.from("Program").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menghapus program" }, { status: 500 });
  return NextResponse.json({ success: true });
}
