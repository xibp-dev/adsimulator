import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import { getSiteSettings } from "@/lib/siteSettings";
import { PASS_SCORE } from "@/lib/exam";
import type { Course } from "@/types";
import {
  LayoutGrid, Lock, Award, ClipboardCheck, Crown, ArrowRight, CheckCircle2, RotateCcw, Sparkles,
} from "lucide-react";

export default async function SertifikasiPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Maintenance gate — bypass untuk admin
  const settings = await getSiteSettings();
  if (settings.lmsMaintenance && session.user.role !== "ADMIN") {
    redirect("/dashboard/pemeliharaan");
  }

  const [{ data: coursesRaw }, { data: questionsRaw }, { data: attemptsRaw }, activeSub] = await Promise.all([
    supabase.from("Course").select("*").eq("published", true).order("sortOrder", { ascending: true }),
    supabase.from("ExamQuestion").select("courseId"),
    supabase.from("ExamAttempt").select("courseId, score, passed").eq("userId", session.user.id),
    getActiveSubscription(session.user.id),
  ]);

  const hasActive = !!activeSub;
  const courses = (coursesRaw || []) as Course[];

  const qCount: Record<string, number> = {};
  (questionsRaw || []).forEach((q: any) => { qCount[q.courseId] = (qCount[q.courseId] || 0) + 1; });

  const best: Record<string, { score: number; passed: boolean }> = {};
  (attemptsRaw || []).forEach((a: any) => {
    const cur = best[a.courseId];
    if (!cur || a.score > cur.score) best[a.courseId] = { score: a.score, passed: a.passed };
  });

  // Hanya kelas yang punya soal ujian
  const certCourses = courses.filter((c) => (qCount[c.id] || 0) > 0);
  const passedCount = certCourses.filter((c) => best[c.id]?.passed).length;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/hub" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
            <LayoutGrid className="w-3.5 h-3.5" /> AdSimulator
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-[#0866FF] font-semibold">Sertifikasi</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" /> Sertifikasi
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Uji pemahamanmu per kelas. Nilai di atas {PASS_SCORE} = lulus dan sertifikat terbit otomatis.
        </p>
      </div>

      {/* Status langganan */}
      {hasActive ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 flex-1">
            <b>Langganan aktif</b> — semua ujian sertifikasi terbuka. {passedCount > 0 && `Kamu sudah lulus ${passedCount} dari ${certCourses.length} sertifikasi.`}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-4 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Sertifikasi khusus pelanggan Kelas Premium</p>
            <p className="text-xs text-white/80">Berlangganan untuk membuka semua ujian & sertifikat kelulusan.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors flex items-center gap-1">
            Lihat Paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid sertifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certCourses.map((c) => {
          const b = best[c.id];
          const n = qCount[c.id] || 0;
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">{c.thumbnailEmoji}</div>
                {b?.passed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Award className="w-3 h-3" /> Lulus · {b.score}
                  </span>
                ) : !hasActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-900/80 text-white">
                    <Lock className="w-3 h-3" /> Terkunci
                  </span>
                ) : b ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Terakhir: {b.score}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#0866FF] border border-blue-100">
                    Belum diuji
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[#1c2b33] leading-snug">{c.title}</h3>
              <p className="text-xs text-gray-400 mt-1 flex-1">Level {c.level} · {n} soal · lulus &gt; {PASS_SCORE}</p>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                {!hasActive ? (
                  <Link href="/dashboard/langganan" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors">
                    <Crown className="w-3.5 h-3.5" /> Berlangganan
                  </Link>
                ) : b?.passed ? (
                  <>
                    <Link href={`/dashboard/sertifikasi/${c.slug}/sertifikat`} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors">
                      <Award className="w-3.5 h-3.5" /> Sertifikat
                    </Link>
                    <Link href={`/dashboard/sertifikasi/${c.slug}`} title="Ulangi ujian" className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-[#0866FF] hover:border-[#0866FF] p-2.5 rounded-xl transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Link>
                  </>
                ) : (
                  <Link href={`/dashboard/sertifikasi/${c.slug}`} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Mulai Ujian
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {certCourses.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
          Belum ada ujian sertifikasi tersedia.
        </div>
      )}
    </div>
  );
}
