import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import { getSiteSettings } from "@/lib/siteSettings";
import type { Course, Lesson, Program } from "@/types";
import {
  GraduationCap, Lock, PlayCircle, Sparkles, CheckCircle2,
  Clock, BookOpen, Crown, ArrowRight, ChevronRight, Layers,
} from "lucide-react";

const ACCENT_STYLES: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    gradient: "from-blue-600 to-blue-500" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  gradient: "from-violet-600 to-violet-500" },
  pink:    { bg: "bg-pink-50",    text: "text-pink-600",    border: "border-pink-100",    gradient: "from-pink-600 to-pink-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", gradient: "from-emerald-600 to-emerald-500" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   gradient: "from-amber-600 to-amber-500" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100",  gradient: "from-indigo-600 to-indigo-500" },
};

export default async function KelasPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Maintenance gate — bypass untuk admin
  const settings = await getSiteSettings();
  if (settings.lmsMaintenance && session.user.role !== "ADMIN") {
    redirect("/dashboard/pemeliharaan");
  }

  const [{ data: programsRaw }, { data: coursesRaw }, { data: lessonsRaw }, activeSub] = await Promise.all([
    supabase.from("Program").select("*").eq("published", true).order("sortOrder", { ascending: true }),
    supabase.from("Course").select("id, programId, isFree, level").eq("published", true),
    supabase.from("Lesson").select("courseId, durationMin"),
    getActiveSubscription(session.user.id),
  ]);

  const programs = (programsRaw || []) as Program[];
  const courses = (coursesRaw || []) as Pick<Course, "id" | "programId" | "isFree" | "level">[];
  const lessons = (lessonsRaw || []) as Pick<Lesson, "courseId" | "durationMin">[];
  const hasActive = !!activeSub;

  // Stat per course
  const lessonStatByCourse: Record<string, { count: number; minutes: number }> = {};
  lessons.forEach((l) => {
    const s = (lessonStatByCourse[l.courseId] ??= { count: 0, minutes: 0 });
    s.count += 1;
    s.minutes += l.durationMin || 0;
  });

  // Stat per program
  const programStats: Record<string, { moduleCount: number; lessonCount: number; minutes: number; levels: Set<string>; hasFreeModule: boolean }> = {};
  courses.forEach((c) => {
    if (!c.programId) return;
    const s = (programStats[c.programId] ??= { moduleCount: 0, lessonCount: 0, minutes: 0, levels: new Set(), hasFreeModule: false });
    const lStat = lessonStatByCourse[c.id] ?? { count: 0, minutes: 0 };
    s.moduleCount += 1;
    s.lessonCount += lStat.count;
    s.minutes += lStat.minutes;
    s.levels.add(c.level);
    if (c.isFree) s.hasFreeModule = true;
  });

  const totalPrograms = programs.length;
  const totalLessons = lessons.length;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <Link href="/dashboard/hub" className="hover:text-[#0866FF] transition-colors font-medium">AdSimulator</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0866FF] font-semibold">Kelas</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-[#0866FF]" /> Kelas Belajar
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {totalPrograms} program tersedia · {totalLessons} total pelajaran. Simulator iklan tetap <b className="text-emerald-600">gratis</b>.
        </p>
      </div>

      {/* Subscription banner */}
      {hasActive ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">Langganan aktif — semua program terbuka 🎉</p>
            <p className="text-xs text-emerald-600">
              {activeSub?.planName} · berlaku sampai {activeSub?.expiresAt ? new Date(activeSub.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
            </p>
          </div>
          <Link href="/dashboard/langganan" className="text-xs font-semibold text-emerald-700 hover:underline whitespace-nowrap">Kelola →</Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-3.5 text-white">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Buka semua program premium mulai Rp49.000/bulan</p>
            <p className="text-xs text-white/75">Akses semua program kelas dari berbagai platform iklan.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors flex items-center gap-1 flex-shrink-0">
            Lihat Paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Program catalog */}
      {programs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
          Belum ada program kelas yang diterbitkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((prog) => {
            const ac = ACCENT_STYLES[prog.accent] ?? ACCENT_STYLES.blue;
            const stat = programStats[prog.id] ?? { moduleCount: 0, lessonCount: 0, minutes: 0, levels: new Set(), hasFreeModule: false };
            const unlocked = hasActive || prog.isFree;
            const levelList = Array.from(stat.levels);

            return (
              <Link
                key={prog.id}
                href={`/dashboard/kelas/${prog.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card header with gradient */}
                <div className={`h-32 bg-gradient-to-br ${ac.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="text-6xl relative z-10 drop-shadow-sm">{prog.thumbnailEmoji}</span>
                  {/* Lock / Open badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {prog.isFree ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-emerald-700 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Gratis
                      </span>
                    ) : unlocked ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-[#0866FF] flex items-center gap-1 shadow-sm">
                        <PlayCircle className="w-3 h-3" /> Terbuka
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/40 text-white flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  {/* Module count badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black/30 text-white flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {stat.moduleCount} Modul
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-[#1c2b33] text-base leading-tight group-hover:text-[#0866FF] transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mt-2 flex-1 line-clamp-2">
                    {prog.description}
                  </p>

                  {/* Level chips */}
                  {levelList.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {levelList.map(lvl => (
                        <span key={lvl} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {lvl === "Pemula" ? "🟢" : lvl === "Menengah" ? "🟡" : "🔴"} {lvl}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-gray-50 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {stat.lessonCount} pelajaran</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {stat.minutes} menit</span>
                    <span className="ml-auto text-[#0866FF] font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {!hasActive && programs.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center space-y-3">
          <p className="text-base font-extrabold">Buka akses semua program</p>
          <p className="text-sm text-slate-400">Langganan sekali, akses semua program kelas selamanya selama aktif.</p>
          <Link
            href="/dashboard/langganan"
            className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#0866FF]/20"
          >
            <Crown className="w-4 h-4" /> Mulai Berlangganan
          </Link>
        </div>
      )}
    </div>
  );
}
