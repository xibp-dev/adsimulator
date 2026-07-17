import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const certNumber = searchParams.get("certNumber")?.trim();

  if (!certNumber) {
    return NextResponse.json({ error: "Nomor sertifikat wajib diisi." }, { status: 400 });
  }

  // 1. Cari di WebinarAttempt
  const { data: webinarAttempt } = await supabase
    .from("WebinarAttempt")
    .select("*, webinar:Webinar(title, speaker)")
    .eq("certNumber", certNumber)
    .eq("passed", true)
    .maybeSingle();

  if (webinarAttempt) {
    // Ambil nama user
    const { data: user } = await supabase
      .from("User")
      .select("name")
      .eq("id", webinarAttempt.userId)
      .maybeSingle();

    return NextResponse.json({
      valid: true,
      recipient: user?.name ?? "Peserta",
      type: "Sertifikat Kelulusan Webinar",
      title: webinarAttempt.webinar?.title ?? "Webinar",
      speaker: webinarAttempt.webinar?.speaker ?? "-",
      score: webinarAttempt.score,
      certNumber: webinarAttempt.certNumber,
      dateIssued: new Date(webinarAttempt.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    });
  }

  // 2. Cari di ExamAttempt (Sertifikasi Kelas)
  const { data: examAttempt } = await supabase
    .from("ExamAttempt")
    .select("*")
    .eq("certNumber", certNumber)
    .eq("passed", true)
    .maybeSingle();

  if (examAttempt) {
    // Ambil nama user & judul kelas
    const [ { data: user }, { data: course } ] = await Promise.all([
      supabase.from("User").select("name").eq("id", examAttempt.userId).maybeSingle(),
      supabase.from("Course").select("title").eq("id", examAttempt.courseId).maybeSingle()
    ]);

    return NextResponse.json({
      valid: true,
      recipient: user?.name ?? "Peserta",
      type: "Sertifikat Kelulusan Kelas",
      title: course?.title ?? "Sertifikasi Kelas",
      speaker: "AdSimulator Academy",
      score: examAttempt.score,
      certNumber: examAttempt.certNumber,
      dateIssued: new Date(examAttempt.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    });
  }

  // 3. Jika tidak ditemukan
  return NextResponse.json({
    valid: false,
    error: "Nomor sertifikat tidak ditemukan atau tidak valid."
  }, { status: 404 });
}
