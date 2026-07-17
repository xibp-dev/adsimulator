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
  webinarId: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2, "Minimal 2 pilihan").max(6),
  correctIndex: z.number().int().min(0),
  sortOrder: z.number().int().default(0),
});

// GET: Ambil soal per webinar (?webinarId=)
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const webinarId = req.nextUrl.searchParams.get("webinarId");
  let q = supabase.from("WebinarQuestion").select("*").order("sortOrder", { ascending: true });
  if (webinarId) q = q.eq("webinarId", webinarId);
  const { data } = await q;
  return NextResponse.json(data || []);
}

// POST: Buat soal webinar baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  if (parsed.data.correctIndex >= parsed.data.options.length) {
    return NextResponse.json({ error: "Jawaban benar di luar jumlah pilihan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("WebinarQuestion")
    .insert({
      id: randomUUID(),
      webinarId: parsed.data.webinarId,
      question: parsed.data.question,
      options: JSON.stringify(parsed.data.options),
      correctIndex: parsed.data.correctIndex,
      sortOrder: parsed.data.sortOrder,
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating webinar question:", error);
    return NextResponse.json({ error: "Gagal membuat soal" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
