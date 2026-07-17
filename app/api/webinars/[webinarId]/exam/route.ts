import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

const submitSchema = z.object({
  // map: { [questionId]: selectedOptionIndex }
  answers: z.record(z.string(), z.number().int().min(0)),
});

function makeWebinarCertNumber(title: string, seed: string, year: number): string {
  const code = title.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "WEBINAR";
  const rand = seed.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `CERT-WEB-${code}-${year}-${rand}`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ webinarId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { webinarId } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Jawaban tidak valid" }, { status: 400 });
  }

  // Cek apakah webinar ada
  const { data: webinar } = await supabase.from("Webinar").select("*").eq("id", webinarId).single();
  if (!webinar) {
    return NextResponse.json({ error: "Webinar tidak ditemukan" }, { status: 404 });
  }

  // Cek apakah user sudah pernah mengambil ujian ini
  const { data: existingAttempt } = await supabase
    .from("WebinarAttempt")
    .select("id")
    .eq("userId", session.user.id)
    .eq("webinarId", webinarId)
    .maybeSingle();

  if (existingAttempt) {
    return NextResponse.json({ error: "Ujian hanya dapat diikuti 1 kali saja." }, { status: 400 });
  }

  // Ambil soal + kunci jawaban
  const { data: questions } = await supabase
    .from("WebinarQuestion")
    .select("id, correctIndex")
    .eq("webinarId", webinarId);

  const qList = questions || [];
  if (qList.length === 0) {
    return NextResponse.json({ error: "Belum ada soal ujian untuk webinar ini." }, { status: 400 });
  }

  const answers = parsed.data.answers;
  let correctCount = 0;
  for (const q of qList) {
    if (answers[q.id] === q.correctIndex) correctCount++;
  }
  
  const totalCount = qList.length;
  // Hitung score
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  // Lulus jika score lebih dari atau sama dengan 80% (>= 80)
  const passed = score >= 80;

  const attemptId = randomUUID();
  const certNumber = passed ? makeWebinarCertNumber(webinar.title, attemptId, new Date().getFullYear()) : null;

  const { error } = await supabase.from("WebinarAttempt").insert({
    id: attemptId,
    userId: session.user.id,
    webinarId,
    score,
    correctCount,
    totalCount,
    passed,
    certNumber,
    answers: JSON.stringify(answers),
    createdAt: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving webinar exam attempt:", error);
    return NextResponse.json({ error: "Gagal menyimpan hasil ujian" }, { status: 500 });
  }

  return NextResponse.json({
    score,
    correctCount,
    totalCount,
    passed,
    certNumber,
  });
}
