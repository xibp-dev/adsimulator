import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import type { Course, Lesson } from "@/types";
import {
  GraduationCap, LayoutGrid, Lock, PlayCircle, Sparkles, CheckCircle2,
  Clock, BookOpen, Crown, ArrowRight,
} from "lucide-react";

const ACCENT: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", ring: "from-blue-500 to-blue-400" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", ring: "from-violet-500 to-violet-400" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", ring: "from-pink-500 to-pink-400" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", ring: "from-emerald-500 to-emerald-400" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", ring: "from-amber-500 to-amber-400" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", ring: "from-indigo-500 to-indigo-400" },
};

export default async function KelasPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [{ data: coursesRaw }, { data: lessonsRaw }, activeSub] = await Promise.all([
    supabase.from("Course").select("*").eq("published", true).order("sortOrder", { ascending: true }),
    supabase.from("Lesson").select("courseId, durationMin"),
    getActiveSubscription(session.user.id),
  ]);

  const courses = (coursesRaw || []) as Course[];
  const lessons = (lessonsRaw || []) as Pick<Lesson, "courseId" | "durationMin">[];
  const hasActive = !!activeSub;

  const statByCourse: Record<string, { count: number; minutes: number }> = {};
  lessons.forEach((l) => {
    const s = (statByCourse[l.courseId] ??= { count: 0, minutes: 0 });
    s.count += 1;
    s.minutes += l.durationMin || 0;
  });

  const totalCourses = courses.length;
  const premiumCount = courses.filter((c) => !c.isFree).length;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/hub" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
            <LayoutGrid className="w-3.5 h-3.5" /> AdSimulator
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-[#0866FF] font-semibold">Kelas Premium</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#0866FF]" /> Kelas Premium Meta Ads
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {totalCourses} kelas terstruktur · {premiumCount} kelas premium. Simulator iklan tetap <b className="text-emerald-600">gratis</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Status langganan */}
      {hasActive ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">Langganan aktif — semua kelas terbuka 🎉</p>
            <p className="text-xs text-emerald-600">
              {activeSub?.planName} · berlaku sampai {activeSub?.expiresAt ? new Date(activeSub.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
            </p>
          </div>
          <Link href="/dashboard/langganan" className="text-xs font-semibold text-emerald-700 hover:underline whitespace-nowrap">Kelola →</Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-4 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Buka semua kelas premium mulai Rp49.000/bulan</p>
            <p className="text-xs text-white/80">Belajar Meta Ads terstruktur dari pemula sampai mahir. Batalkan kapan saja.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors flex items-center gap-1">
            Lihat Paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => {
          const a = ACCENT[c.accent] ?? ACCENT.blue;
          const stat = statByCourse[c.id] ?? { count: 0, minutes: 0 };
          const unlocked = hasActive || c.isFree;
          return (
            <Link
              key={c.id}
              href={`/dashboard/kelas/${c.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div className={`h-28 ${a.bg} flex items-center justify-center relative`}>
                <span className="text-5xl">{c.thumbnailEmoji}</span>
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/80 text-gray-600">
                  {c.level}
                </span>
                {c.isFree ? (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Gratis
                  </span>
                ) : unlocked ? (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-[#0866FF] text-white flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> Terbuka
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-gray-900/70 text-white flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-[11px] font-semibold ${a.text} mb-1`}>{c.category}</span>
                <h3 className="font-bold text-[#1c2b33] leading-snug group-hover:text-[#0866FF] transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mt-1.5 flex-1">{c.description}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {stat.count} pelajaran</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {stat.minutes} menit</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Belum ada kelas. Jalankan seed konten LMS terlebih dahulu.
        </div>
      )}
    </div>
  );
}
