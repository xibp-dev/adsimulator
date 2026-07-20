import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import type { Course, Lesson } from "@/types";
import {
  ArrowLeft, Lock, PlayCircle, Clock, CheckCircle2, Crown, Sparkles, ChevronRight, ClipboardCheck, Award,
} from "lucide-react";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string; courseSlug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug: programSlug, courseSlug } = await params;

  const { data: course } = await supabase.from("Course").select("*").eq("slug", courseSlug).single();
  if (!course) notFound();
  const c = course as Course;

  const [{ data: lessonsRaw }, activeSub, { count: examCount }, { data: passedAttempts }] = await Promise.all([
    supabase.from("Lesson").select("*").eq("courseId", c.id).order("sortOrder", { ascending: true }),
    getActiveSubscription(session.user.id),
    supabase.from("ExamQuestion").select("*", { count: "exact", head: true }).eq("courseId", c.id),
    supabase.from("ExamAttempt").select("id").eq("userId", session.user.id).eq("courseId", c.id).eq("passed", true).limit(1),
  ]);
  const lessons = (lessonsRaw || []) as Lesson[];
  const hasActive = !!activeSub;
  const hasExam = (examCount ?? 0) > 0;
  const hasCertificate = !!(passedAttempts && passedAttempts.length > 0);
  const courseAccess = hasActive || c.isFree;

  const canAccess = (l: Lesson) => hasActive || c.isFree || l.isPreview;
  const totalMin = lessons.reduce((s, l) => s + (l.durationMin || 0), 0);

  // Kelompokkan per section
  const sections: { name: string; items: Lesson[] }[] = [];
  lessons.forEach((l) => {
    let sec = sections.find((s) => s.name === l.section);
    if (!sec) { sec = { name: l.section, items: [] }; sections.push(sec); }
    sec.items.push(l);
  });

  const firstAccessible = lessons.find((l) => canAccess(l));

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Back to program */}
      <Link href={`/dashboard/kelas/${programSlug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Kurikulum
      </Link>

      {/* Course header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row gap-5 items-start">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl flex-shrink-0">{c.thumbnailEmoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.level}</span>
              {c.isFree
                ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Gratis</span>
                : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-0.5"><Lock className="w-3 h-3" /> Premium</span>
              }
              {hasCertificate && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-0.5"><Award className="w-3 h-3" /> Bersertifikat</span>}
            </div>
            <h1 className="text-xl font-extrabold text-[#1c2b33]">{c.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{c.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {totalMin} menit</span>
              <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> {lessons.length} pelajaran</span>
            </div>
          </div>
          {courseAccess && firstAccessible && (
            <Link
              href={`/dashboard/kelas/${programSlug}/${c.slug}/${firstAccessible.id}`}
              className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#0866FF]/20 flex-shrink-0"
            >
              <PlayCircle className="w-4 h-4" /> Mulai Belajar
            </Link>
          )}
        </div>
      </div>

      {/* Unlock CTA */}
      {!courseAccess && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-4 text-white">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">Kelas ini memerlukan langganan premium</p>
            <p className="text-xs text-white/75">Langganan untuk mengakses semua pelajaran di modul ini.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> Berlangganan
          </Link>
        </div>
      )}

      {/* Exam / certificate CTA */}
      {hasExam && courseAccess && (
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${hasCertificate ? "bg-purple-50 border border-purple-200" : "bg-gray-50 border border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${hasCertificate ? "bg-purple-500" : "bg-gray-200"}`}>
            {hasCertificate ? <Award className="w-5 h-5 text-white" /> : <ClipboardCheck className="w-5 h-5 text-gray-500" />}
          </div>
          <div className="flex-1">
            {hasCertificate
              ? <><p className="text-sm font-bold text-purple-800">Kamu sudah lulus ujian! 🎉</p><p className="text-xs text-purple-600">Sertifikat tersedia di profil kamu.</p></>
              : <><p className="text-sm font-bold text-gray-700">Ujian tersedia</p><p className="text-xs text-gray-500">Selesaikan semua pelajaran lalu ambil ujian untuk mendapatkan sertifikat.</p></>
            }
          </div>
          <Link
            href={`/dashboard/sertifikasi/${c.id}/exam`}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${hasCertificate ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-[#0866FF] text-white hover:bg-[#0757d4]"}`}
          >
            {hasCertificate ? "Lihat Sertifikat" : "Ambil Ujian"}
          </Link>
        </div>
      )}

      {/* Lesson list */}
      <div className="space-y-4">
        {sections.map((sec) => (
          <div key={sec.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{sec.name}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {sec.items.map((l, i) => {
                const accessible = canAccess(l);
                return (
                  <div key={l.id} className={`flex items-center gap-3 px-5 py-3.5 ${accessible ? "hover:bg-[#f5f8ff] cursor-pointer" : "opacity-60"} transition-all group`}>
                    <span className="w-6 h-6 rounded-md bg-[#e7f0ff] text-[#0866FF] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${accessible ? "text-[#1c2b33] group-hover:text-[#0866FF]" : "text-gray-400"} transition-colors`}>{l.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {l.durationMin}m</span>
                        {l.isPreview && <span className="text-emerald-600 font-bold">· Pratinjau</span>}
                      </div>
                    </div>
                    {accessible
                      ? <Link href={`/dashboard/kelas/${programSlug}/${c.slug}/${l.id}`} className="p-1.5 rounded-lg bg-[#e7f0ff] group-hover:bg-[#0866FF] text-[#0866FF] group-hover:text-white transition-all"><PlayCircle className="w-4 h-4" /></Link>
                      : <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    }
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
