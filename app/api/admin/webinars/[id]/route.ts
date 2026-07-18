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
  description: z.string().optional(),
  speaker: z.string().min(1).optional(),
  schedule: z.string().optional(),
  meetingLink: z.string().optional(),
  examPasscode: z.string().optional(),
  published: z.boolean().optional(),
  examDeadline: z.string().nullable().optional(),
});

// PATCH: Edit webinar
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const payload: any = { ...parsed.data };
  if (payload.schedule) {
    payload.schedule = new Date(payload.schedule).toISOString();
  }
  if (payload.examDeadline !== undefined) {
    payload.examDeadline = payload.examDeadline ? new Date(payload.examDeadline).toISOString() : null;
  }
  payload.updatedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("Webinar")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating webinar:", error);
    return NextResponse.json({ error: "Gagal memperbarui webinar" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Hapus webinar
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const { error } = await supabase.from("Webinar").delete().eq("id", id);
  if (error) {
    console.error("Error deleting webinar:", error);
    return NextResponse.json({ error: "Gagal menghapus webinar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
