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

const lessonSchema = z.object({
  courseId: z.string().min(1),
  section: z.string().default("Umum"),
  title: z.string().min(1),
  description: z.string().default(""),
  videoUrl: z.string().default(""),
  durationMin: z.number().int().min(0).default(5),
  content: z.string().default(""),
  isPreview: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// Buat pelajaran baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = lessonSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });

  const { data: course } = await supabase.from("Course").select("id").eq("id", parsed.data.courseId).single();
  if (!course) return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });

  const { data, error } = await supabase
    .from("Lesson")
    .insert({ id: randomUUID(), ...parsed.data, createdAt: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal membuat pelajaran" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
