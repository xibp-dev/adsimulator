import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import { PASS_SCORE } from "@/lib/exam";
import ExamClient from "@/components/lms/ExamClient";
import type { Course, ExamQuestion } from "@/types";
import { Lock, Crown, ArrowLeft, ClipboardList } from "lucide-react";

export default async function SertifikasiExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  const { data: course } = await supabase.from("Course").select("*").eq("slug", slug).single();
  if (!course) notFound();
  const c = course as Course;

  const [{ data: questionsRaw }, activeSub] = await Promise.all([
    supabase.from("ExamQuestion").select("*").eq("courseId", c.id).order("sortOrder", { ascending: true }),
    getActiveSubscription(session.user.id),
  ]);

  // Sertifikasi HANYA untuk pelanggan aktif (termasuk kelas gratis)
  if (!activeSub) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Link href="/dashboard/sertifikasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-6">
          <ArrowLeft className="w-4 h-4" /> Sertifikasi
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900/80 text-white"><Lock className="w-8 h-8" /></div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#1c2b33]">Sertifikasi terkunci</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Ujian & sertifikat hanya tersedia untuk pelanggan Kelas Premium aktif.</p>
          </div>
          <Link href="/dashboard/langganan" className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl">
            <Crown className="w-4 h-4" /> Lihat Paket Langganan
          </Link>
        </div>
      </div>
    );
  }

  const questions = ((questionsRaw || []) as ExamQuestion[]).map((q) => {
    let options: string[] = [];
    try { options = JSON.parse(q.options); } catch { options = []; }
    // PENTING: correctIndex TIDAK dikirim ke client
    return { id: q.id, question: q.question, options };
  });

  if (questions.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Link href="/dashboard/sertifikasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-6">
          <ArrowLeft className="w-4 h-4" /> Sertifikasi
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 text-gray-400"><ClipboardList className="w-7 h-7" /></div>
          <h1 className="text-lg font-bold text-[#1c2b33]">Ujian belum tersedia</h1>
          <p className="text-sm text-gray-500">Soal untuk kelas ini belum disiapkan. Cek lagi nanti ya.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ExamClient
        courseId={c.id}
        courseSlug={c.slug}
        courseTitle={c.title}
        questions={questions}
        passScore={PASS_SCORE}
      />
    </div>
  );
}
