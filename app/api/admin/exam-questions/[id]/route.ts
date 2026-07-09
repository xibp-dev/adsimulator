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
  question: z.string().min(1).optional(),
  options: z.array(z.string().min(1)).min(2).max(6).optional(),
  correctIndex: z.number().int().min(0).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (parsed.data.question !== undefined) update.question = parsed.data.question;
  if (parsed.data.options !== undefined) update.options = JSON.stringify(parsed.data.options);
  if (parsed.data.correctIndex !== undefined) update.correctIndex = parsed.data.correctIndex;
  if (parsed.data.sortOrder !== undefined) update.sortOrder = parsed.data.sortOrder;

  const { data, error } = await supabase.from("ExamQuestion").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Gagal memperbarui soal" }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { error } = await supabase.from("ExamQuestion").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menghapus soal" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
