import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import type { Course, Lesson } from "@/types";
import {
  GraduationCap, Lock, PlayCircle, Sparkles, CheckCircle2,
  Clock, BookOpen, Crown, ArrowRight, ChevronRight,
} from "lucide-react";

const LEVEL_ORDER = ["Pemula", "Menengah", "Lanjutan"];

const LEVEL_CONFIG: Record<string, {
  label: string; emoji: string;
  badge: string; dot: string; headerBg: string; barColor: string;
}> = {
  Pemula: {
    label: "Pemula",
    emoji: "🟢",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    headerBg: "bg-emerald-50 border-emerald-100",
    barColor: "bg-emerald-500",
  },
  Menengah: {
    label: "Menengah",
    emoji: "🟡",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    headerBg: "bg-amber-50 border-amber-100",
    barColor: "bg-amber-500",
  },
  Lanjutan: {
    label: "Lanjutan",
    emoji: "🔴",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    headerBg: "bg-red-50 border-red-100",
    barColor: "bg-red-500",
  },
};

const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  pink: "bg-pink-50 text-pink-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
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

  // Group by level in order
  const grouped = LEVEL_ORDER.map((lvl) => ({
    level: lvl,
    courses: courses.filter((c) => c.level === lvl),
  })).filter((g) => g.courses.length > 0);

  // Stats
  const totalModules = courses.length;
  const totalLessons = lessons.length;
  const totalMinutes = lessons.reduce((s, l) => s + (l.durationMin || 0), 0);
  const unlockedCount = courses.filter((c) => hasActive || c.isFree).length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <Link href="/dashboard/hub" className="hover:text-[#0866FF] transition-colors font-medium">AdSimulator</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0866FF] font-semibold">Kelas META ADS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-[#0866FF]" />
          Kurikulum META ADS
        </h1>
        <p className="text-sm text-gray-500">
          Pelajari Meta Ads dari nol sampai mahir — {totalModules} modul · {totalLessons} pelajaran · {totalMinutes} menit total.
        </p>
      </div>

      {/* ── Subscription banner ── */}
      {hasActive ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-4.5 h-4.5 text-white w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">Langganan aktif — semua modul terbuka 🎉</p>
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
            <p className="text-sm font-bold">Buka semua modul premium mulai Rp49.000/bulan</p>
            <p className="text-xs text-white/75">Akses {totalModules} modul terstruktur dari Pemula sampai Lanjutan.</p>
          </div>
          <Link href="/dashboard/langganan" className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors flex items-center gap-1 flex-shrink-0">
            Lihat Paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Progress summary ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Modul", value: totalModules, sub: "materi" },
          { label: "Total Pelajaran", value: totalLessons, sub: "video & bacaan" },
          { label: "Durasi Belajar", value: `${Math.floor(totalMinutes / 60)}j ${totalMinutes % 60}m`, sub: "estimasi" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm text-center">
            <p className="text-xl font-extrabold text-[#1c2b33]">{value}</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Grouped curriculum ── */}
      <div className="space-y-5">
        {grouped.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            Belum ada konten kurikulum. Coba lagi nanti.
          </div>
        )}

        {grouped.map(({ level, courses: lvlCourses }, groupIdx) => {
          const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.Pemula;
          return (
            <div key={level} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Level header */}
              <div className={`px-5 py-3.5 border-b flex items-center gap-3 ${cfg.headerBg}`}>
                <span className="text-base">{cfg.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-800">Level {cfg.label}</p>
                  <p className="text-[11px] text-gray-500">{lvlCourses.length} modul · {lvlCourses.reduce((s, c) => s + (statByCourse[c.id]?.count || 0), 0)} pelajaran</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                  Fase {groupIdx + 1}
                </span>
              </div>

              {/* Course rows */}
              <div className="divide-y divide-gray-50">
                {lvlCourses.map((c, idx) => {
                  const stat = statByCourse[c.id] ?? { count: 0, minutes: 0 };
                  const unlocked = hasActive || c.isFree;
                  const accentCls = ACCENT_BG[c.accent] ?? ACCENT_BG.blue;

                  return (
                    <Link
                      key={c.id}
                      href={`/dashboard/kelas/${c.slug}`}
                      className={`flex items-center gap-4 px-5 py-4 transition-all group ${
                        unlocked
                          ? "hover:bg-[#f5f8ff] cursor-pointer"
                          : "cursor-pointer hover:bg-gray-50/60"
                      }`}
                    >
                      {/* Number */}
                      <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {groupIdx === 0 ? idx + 1 : grouped.slice(0, groupIdx).reduce((s, g) => s + g.courses.length, 0) + idx + 1}
                      </div>

                      {/* Emoji */}
                      <div className={`w-10 h-10 rounded-xl ${accentCls} flex items-center justify-center text-xl flex-shrink-0`}>
                        {c.thumbnailEmoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-bold truncate ${unlocked ? "text-[#1c2b33] group-hover:text-[#0866FF]" : "text-gray-500"} transition-colors`}>
                            {c.title}
                          </p>
                          {c.isFree && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-0.5 flex-shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Gratis
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{c.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {stat.count} pelajaran</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stat.minutes} menit</span>
                        </div>
                      </div>

                      {/* Status / CTA */}
                      <div className="flex-shrink-0">
                        {!unlocked ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Premium</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-9 h-9 rounded-xl bg-[#e7f0ff] group-hover:bg-[#0866FF] flex items-center justify-center transition-colors">
                              <PlayCircle className="w-4 h-4 text-[#0866FF] group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[9px] text-[#0866FF] font-bold uppercase">Mulai</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Upgrade CTA if not subscribed ── */}
      {!hasActive && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center space-y-3">
          <p className="text-base font-extrabold">Buka semua {totalModules} modul sekarang</p>
          <p className="text-sm text-slate-400">Dapatkan akses penuh ke seluruh kurikulum Meta Ads — dari level Pemula hingga Lanjutan.</p>
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
