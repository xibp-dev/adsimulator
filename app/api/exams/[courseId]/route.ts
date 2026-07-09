import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import { computeScore, isPassed, makeCertNumber } from "@/lib/exam";
import { randomUUID } from "crypto";
import { z } from "zod";

const submitSchema = z.object({
  // map: { [questionId]: selectedOptionIndex }
  answers: z.record(z.string(), z.number().int().min(0)),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { courseId } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Jawaban tidak valid" }, { status: 400 });

  const { data: course } = await supabase.from("Course").select("*").eq("id", courseId).single();
  if (!course) return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });

  // Gating: sertifikasi hanya untuk pelanggan aktif (termasuk kelas gratis)
  const hasActive = !!(await getActiveSubscription(session.user.id));
  if (!hasActive) {
    return NextResponse.json({ error: "Sertifikasi hanya tersedia untuk pelanggan aktif." }, { status: 403 });
  }

  // Ambil soal + kunci jawaban (server-side saja)
  const { data: questions } = await supabase
    .from("ExamQuestion")
    .select("id, correctIndex")
    .eq("courseId", courseId);

  const qList = questions || [];
  if (qList.length === 0) return NextResponse.json({ error: "Belum ada soal ujian untuk kelas ini." }, { status: 400 });

  const answers = parsed.data.answers;
  let correctCount = 0;
  for (const q of qList) {
    if (answers[q.id] === q.correctIndex) correctCount++;
  }
  const totalCount = qList.length;
  const score = computeScore(correctCount, totalCount);
  const passed = isPassed(score);

  const attemptId = randomUUID();
  const certNumber = passed ? makeCertNumber(course.slug, attemptId, new Date().getFullYear()) : null;

  const { error } = await supabase.from("ExamAttempt").insert({
    id: attemptId,
    userId: session.user.id,
    courseId,
    score,
    correctCount,
    totalCount,
    passed,
    certNumber,
    answers: JSON.stringify(answers),
    createdAt: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: "Gagal menyimpan hasil ujian" }, { status: 500 });

  return NextResponse.json({ score, correctCount, totalCount, passed, certNumber, courseSlug: course.slug });
}
