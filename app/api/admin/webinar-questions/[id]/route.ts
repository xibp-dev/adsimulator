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

// PATCH: Edit soal webinar
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const payload: any = {};
  if (parsed.data.question !== undefined) payload.question = parsed.data.question;
  if (parsed.data.options !== undefined) payload.options = JSON.stringify(parsed.data.options);
  if (parsed.data.correctIndex !== undefined) payload.correctIndex = parsed.data.correctIndex;
  if (parsed.data.sortOrder !== undefined) payload.sortOrder = parsed.data.sortOrder;

  // Jika update correctIndex & options bareng, validasi kelayakan index
  if (parsed.data.options && parsed.data.correctIndex !== undefined) {
    if (parsed.data.correctIndex >= parsed.data.options.length) {
      return NextResponse.json({ error: "Jawaban benar di luar jumlah pilihan" }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("WebinarQuestion")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating webinar question:", error);
    return NextResponse.json({ error: "Gagal memperbarui soal" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Hapus soal webinar
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const { error } = await supabase.from("WebinarQuestion").delete().eq("id", id);
  if (error) {
    console.error("Error deleting webinar question:", error);
    return NextResponse.json({ error: "Gagal menghapus soal" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
