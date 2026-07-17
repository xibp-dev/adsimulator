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

const webinarSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().default(""),
  speaker: z.string().min(1, "Nama pemateri wajib diisi"),
  schedule: z.string().min(1, "Jadwal wajib ditentukan"),
  meetingLink: z.string().default(""),
  examPasscode: z.string().default(""),
  published: z.boolean().default(true),
});

// GET: Ambil semua webinar + jumlah pertanyaan + jumlah pendaftar/peserta
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ data: webinars }, { data: questions }] = await Promise.all([
    supabase.from("Webinar").select("*").order("schedule", { ascending: false }),
    supabase.from("WebinarQuestion").select("webinarId"),
  ]);

  const qCounts: Record<string, number> = {};
  (questions || []).forEach((q: any) => {
    qCounts[q.webinarId] = (qCounts[q.webinarId] || 0) + 1;
  });

  const rows = (webinars || []).map((w: any) => ({
    ...w,
    questionCount: qCounts[w.id] || 0,
  }));

  return NextResponse.json(rows);
}

// POST: Buat webinar baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = webinarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }

  const newWebinar = {
    id: randomUUID(),
    title: parsed.data.title,
    description: parsed.data.description,
    speaker: parsed.data.speaker,
    schedule: new Date(parsed.data.schedule).toISOString(),
    meetingLink: parsed.data.meetingLink,
    examPasscode: parsed.data.examPasscode,
    published: parsed.data.published,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("Webinar")
    .insert(newWebinar)
    .select()
    .single();

  if (error) {
    console.error("Error creating webinar:", error);
    return NextResponse.json({ error: "Gagal membuat webinar" }, { status: 500 });
  }

  return NextResponse.json({ ...data, questionCount: 0 }, { status: 201 });
}
