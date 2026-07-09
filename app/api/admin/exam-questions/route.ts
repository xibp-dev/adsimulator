import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

const questionSchema = z.object({
  courseId: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2, "Minimal 2 pilihan").max(6),
  correctIndex: z.number().int().min(0),
  sortOrder: z.number().int().default(0),
});

// Daftar soal per kelas (?courseId=)
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const courseId = req.nextUrl.searchParams.get("courseId");
  let q = supabase.from("ExamQuestion").select("*").order("sortOrder", { ascending: true });
  if (courseId) q = q.eq("courseId", courseId);
  const { data } = await q;
  return NextResponse.json(data || []);
}

// Buat soal baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  if (parsed.data.correctIndex >= parsed.data.options.length) {
    return NextResponse.json({ error: "Jawaban benar di luar jumlah pilihan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ExamQuestion")
    .insert({
      id: randomUUID(),
      courseId: parsed.data.courseId,
      question: parsed.data.question,
      options: JSON.stringify(parsed.data.options),
      correctIndex: parsed.data.correctIndex,
      sortOrder: parsed.data.sortOrder,
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal membuat soal" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
