import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import { getMediaEmbedInfo } from "@/lib/video";
import LessonVideo from "@/components/lms/LessonVideo";
import type { Course, Lesson } from "@/types";
import {
  ArrowLeft, Lock, PlayCircle, CheckCircle2, ChevronLeft, ChevronRight, Crown, Clock,
} from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string; lessonId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug: programSlug, courseSlug, lessonId } = await params;

  // Load course by courseSlug
  const { data: course } = await supabase.from("Course").select("*").eq("slug", courseSlug).single();
  if (!course) notFound();
  const c = course as Course;

  const [{ data: lessonsRaw }, activeSub] = await Promise.all([
    supabase.from("Lesson").select("*").eq("courseId", c.id).order("sortOrder", { ascending: true }),
    getActiveSubscription(session.user.id),
  ]);
  const lessons = (lessonsRaw || []) as Lesson[];
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) notFound();

  const hasActive = !!activeSub;
  const canAccess = hasActive || c.isFree || lesson.isPreview;

  // Lock screen if no access
  if (!canAccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Link href={`/dashboard/kelas/${programSlug}/${c.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-6">
          <ArrowLeft className="w-4 h-4" /> {c.title}
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900/80 text-white">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#1c2b33]">Pelajaran ini terkunci</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Berlangganan Kelas Premium untuk membuka <b>{lesson.title}</b> dan seluruh materi lainnya. Simulator iklan tetap gratis.
            </p>
          </div>
          <Link href="/dashboard/langganan" className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
            <Crown className="w-4 h-4" /> Lihat Paket Langganan
          </Link>
        </div>
      </div>
    );
  }

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const nextAccessible = next && (hasActive || c.isFree || next.isPreview);

  const mediaInfo = getMediaEmbedInfo(lesson.videoUrl);
  const watermark = session.user.email ?? session.user.name ?? "AdSimulator";

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <Link href={`/dashboard/kelas/${programSlug}/${c.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-4">
        <ArrowLeft className="w-4 h-4" /> {c.title}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {mediaInfo ? (
            <LessonVideo embedUrl={mediaInfo.embedUrl} type={mediaInfo.type} watermark={watermark} />
          ) : (
            <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-[#0f1729] to-[#15233f] flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-3">
                  <PlayCircle className="w-9 h-9 text-white" />
                </div>
                <p className="text-white/70 text-sm">Materi tertulis saja</p>
                <p className="text-white/40 text-xs mt-0.5">{lesson.durationMin} menit · {c.title}</p>
              </div>
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/10 text-white/80">
                {lesson.section}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-[#1c2b33]">{lesson.title}</h1>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.durationMin} menit</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
              {lesson.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Navigation prev/next */}
          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <Link href={`/dashboard/kelas/${programSlug}/${c.slug}/${prev.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#0866FF] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : <span />}
            {next ? (
              nextAccessible ? (
                <Link href={`/dashboard/kelas/${programSlug}/${c.slug}/${next.id}`} className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  Berikutnya <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link href="/dashboard/langganan" className="flex items-center gap-1.5 bg-gray-900/80 hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  <Lock className="w-3.5 h-3.5" /> Buka materi berikutnya
                </Link>
              )
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Kelas selesai!
              </span>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-sm font-bold text-[#1c2b33]">Daftar Pelajaran</p>
              <p className="text-xs text-gray-400">{lessons.length} pelajaran</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {lessons.map((l, i) => {
                const access = hasActive || c.isFree || l.isPreview;
                const current = l.id === lesson.id;
                const inner = (
                  <div className={`flex items-center gap-3 px-5 py-3 transition-colors ${current ? "bg-[#e7f0ff]" : access ? "hover:bg-gray-50/70" : "opacity-60"}`}>
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${current ? "bg-[#0866FF] text-white" : access ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                      {access ? i + 1 : <Lock className="w-3 h-3" />}
                    </span>
                    <span className={`text-xs leading-snug ${current ? "text-[#0866FF] font-semibold" : "text-gray-600"} line-clamp-2`}>{l.title}</span>
                  </div>
                );
                return access ? (
                  <Link key={l.id} href={`/dashboard/kelas/${programSlug}/${c.slug}/${l.id}`}>{inner}</Link>
                ) : (
                  <div key={l.id}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
