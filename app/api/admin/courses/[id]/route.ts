import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  level: z.enum(["Pemula", "Menengah", "Lanjutan"]).optional(),
  category: z.string().optional(),
  thumbnailEmoji: z.string().optional(),
  accent: z.enum(["blue", "violet", "pink", "emerald", "amber", "indigo"]).optional(),
  isFree: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

// Ubah kelas
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  if (parsed.data.slug) {
    const { data: dupe } = await supabase.from("Course").select("id").eq("slug", parsed.data.slug).neq("id", id).limit(1);
    if (dupe && dupe.length > 0) return NextResponse.json({ error: "Slug sudah dipakai kelas lain." }, { status: 409 });
  }

  const { data, error } = await supabase.from("Course").update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Gagal memperbarui kelas" }, { status: 500 });
  return NextResponse.json(data);
}

// Hapus kelas (pelajaran ikut terhapus via ON DELETE CASCADE)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const { error } = await supabase.from("Course").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menghapus kelas" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
