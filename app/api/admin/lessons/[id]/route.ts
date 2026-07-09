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
  section: z.string().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  durationMin: z.number().int().min(0).optional(),
  content: z.string().optional(),
  isPreview: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// Ubah pelajaran
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  const { data, error } = await supabase.from("Lesson").update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Gagal memperbarui pelajaran" }, { status: 500 });
  return NextResponse.json(data);
}

// Hapus pelajaran
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const { error } = await supabase.from("Lesson").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menghapus pelajaran" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
