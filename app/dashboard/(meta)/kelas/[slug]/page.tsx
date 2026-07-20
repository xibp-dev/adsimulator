import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import type { Course, Lesson, Program } from "@/types";
import {
  ArrowLeft, Lock, PlayCircle, Clock, BookOpen, Crown, Sparkles,
  ArrowRight, ChevronRight, Layers, CheckCircle2,
} from "lucide-react";

const LEVEL_ORDER = ["Pemula", "Menengah", "Lanjutan"];
const LEVEL_EMOJI: Record<string, string> = { Pemula: "🟢", Menengah: "🟡", Lanjutan: "🔴" };

export default async function ProgramCurriculumPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  // Load program
  const { data: programRaw } = await supabase.from("Program").select("*").eq("slug", slug).eq("published", true).single();
  if (!programRaw) notFound();
  const program = programRaw as Program;

  const [{ data: coursesRaw }, { data: lessonsRaw }, activeSub] = await Promise.all([
    supabase.from("Course").select("*").eq("programId", program.id).eq("published", true).order("sortOrder", { ascending: true }),
    supabase.from("Lesson").select("courseId, id, durationMin, isPreview"),
    getActiveSubscription(session.user.id),
  ]);

  const courses = (coursesRaw || []) as Course[];
  const lessons = (lessonsRaw || []) as Pick<Lesson, "id" | "courseId" | "durationMin" | "isPreview">[];
  const hasActive = !!activeSub;

  // Stats per course
  const lessonStatByCourse: Record<string, { count: number; minutes: number; firstId: string | null }> = {};
  lessons.forEach((l) => {
    const s = (lessonStatByCourse[l.courseId] ??= { count: 0, minutes: 0, firstId: null });
    s.count += 1;
    s.minutes += l.durationMin || 0;
    if (!s.firstId || l.isPreview) s.firstId = l.id;
  });

  const totalLessons = courses.reduce((s, c) => s + (lessonStatByCourse[c.id]?.count || 0), 0);
  const totalMinutes = courses.reduce((s, c) => s + (lessonStatByCourse[c.id]?.minutes || 0), 0);

  // Group by level
  const grouped = LEVEL_ORDER.map((lvl) => ({
    level: lvl,
    courses: courses.filter((c) => c.level === lvl),
  })).filter((g) => g.courses.length > 0);

  const unlocked = hasActive || program.isFree;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <Link href="/dashboard/kelas" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Semua Kelas
      </Link>

      {/* Program hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex gap-5 items-start">
        <div className="text-5xl flex-shrink-0">{program.thumbnailEmoji}</div>
        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="text-xl font-extrabold tracking-tight">{program.title}</h1>
          <p className="text-sm text-slate-400 leading-relaxed">{program.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
            <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {courses.length} modul</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons} pelajaran</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.floor(totalMinutes / 60)}j {totalMinutes % 60}m</span>
          </div>
        </div>
      </div>

      {/* Subscription status */}
      {!unlocked && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-3.5 text-white">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">Buka semua modul premium</p>
            <p className="text-xs text-white/75">Langganan untuk mengakses seluruh kurikulum ini.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors flex items-center gap-1">
            Berlangganan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
      {unlocked && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
          <Crown className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Semua modul terbuka — selamat belajar!</p>
        </div>
      )}

      {/* Curriculum grouped by level */}
      <div className="space-y-4">
        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm bg-white border border-dashed border-gray-200 rounded-2xl">
            Belum ada modul di program ini.
          </div>
        )}

        {grouped.map(({ level, courses: lvlCourses }, gi) => (
          <div key={level} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Level header */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span>{LEVEL_EMOJI[level] ?? "⚪"}</span>
              <span className="text-sm font-bold text-gray-700">Level {level}</span>
              <span className="ml-auto text-xs text-gray-400">{lvlCourses.length} modul</span>
            </div>

            <div className="divide-y divide-gray-50">
              {lvlCourses.map((c, idx) => {
                const stat = lessonStatByCourse[c.id] ?? { count: 0, minutes: 0, firstId: null };
                const moduleUnlocked = unlocked || c.isFree;
                const globalIdx = grouped.slice(0, gi).reduce((s, g) => s + g.courses.length, 0) + idx + 1;

                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/kelas/${slug}/${c.slug}`}
                    className={`flex items-center gap-4 px-5 py-4 transition-all group ${moduleUnlocked ? "hover:bg-[#f5f8ff]" : "hover:bg-gray-50/60"}`}
                  >
                    {/* Number */}
                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {globalIdx}
                    </div>

                    {/* Emoji */}
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                      {c.thumbnailEmoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold truncate ${moduleUnlocked ? "text-[#1c2b33] group-hover:text-[#0866FF]" : "text-gray-400"} transition-colors`}>
                          {c.title}
                        </p>
                        {c.isFree && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-0.5 flex-shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Gratis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{c.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {stat.count} pelajaran</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stat.minutes} menit</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {!moduleUnlocked ? (
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#e7f0ff] group-hover:bg-[#0866FF] flex items-center justify-center transition-colors">
                          <PlayCircle className="w-4 h-4 text-[#0866FF] group-hover:text-white transition-colors" />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
