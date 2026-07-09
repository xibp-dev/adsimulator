import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveSubscription } from "@/lib/subscription";
import type { Course, Lesson } from "@/types";
import {
  ArrowLeft, Lock, PlayCircle, Clock, CheckCircle2, Crown, Sparkles, ChevronRight, ClipboardCheck, Award,
} from "lucide-react";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  const { data: course } = await supabase.from("Course").select("*").eq("slug", slug).single();
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
      <Link href="/dashboard/kelas" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Semua Kelas
      </Link>

      {/* Header kelas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl flex-shrink-0">
          {c.thumbnailEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{c.level}</span>
            {c.isFree ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">Gratis</span>
            ) : hasActive ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0866FF] text-white">Terbuka</span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-900/80 text-white flex items-center gap-1"><Lock className="w-3 h-3" /> Premium</span>
            )}
          </div>
          <h1 className="text-xl font-bold text-[#1c2b33] leading-snug">{c.title}</h1>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{c.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span>{lessons.length} pelajaran</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {totalMin} menit</span>
          </div>
        </div>
      </div>

      {/* CTA langganan bila terkunci */}
      {!hasActive && !c.isFree && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0866FF] to-blue-600 rounded-2xl px-5 py-4 text-white">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Kelas ini premium. Berlangganan untuk membuka semua pelajaran.</p>
            <p className="text-xs text-white/80">Pelajaran bertanda “Pratinjau” bisa kamu coba gratis dulu.</p>
          </div>
          <Link href={`/dashboard/langganan`} className="bg-white text-[#0866FF] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-blue-50 transition-colors">
            Berlangganan
          </Link>
        </div>
      )}

      {/* Tombol aksi: mulai belajar, ujian, sertifikat */}
      <div className="flex flex-wrap items-center gap-2.5">
        {firstAccessible && (
          <Link
            href={`/dashboard/kelas/${c.slug}/${firstAccessible.id}`}
            className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <PlayCircle className="w-4 h-4" /> Mulai Belajar
          </Link>
        )}
        {hasExam && hasActive && (
          <Link
            href={`/dashboard/sertifikasi/${c.slug}`}
            className="inline-flex items-center gap-2 bg-white border border-[#0866FF] text-[#0866FF] hover:bg-blue-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" /> Ikuti Ujian Sertifikasi
          </Link>
        )}
        {hasCertificate && (
          <Link
            href={`/dashboard/sertifikasi/${c.slug}/sertifikat`}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Award className="w-4 h-4" /> Lihat Sertifikat
          </Link>
        )}
      </div>
      {hasExam && hasActive && !hasCertificate && (
        <p className="text-xs text-gray-400 -mt-2">Ujian sertifikasi tersedia di menu Sertifikasi — nilai di atas 85 = lulus & sertifikat terbit.</p>
      )}

      {/* Daftar pelajaran */}
      <div className="space-y-5">
        {sections.map((sec) => (
          <div key={sec.name}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">{sec.name}</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {sec.items.map((l, i) => {
                const access = canAccess(l);
                const inner = (
                  <div className={`flex items-center gap-3 px-5 py-3.5 ${access ? "hover:bg-gray-50/70" : "opacity-70"} transition-colors`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${access ? "bg-[#e7f0ff] text-[#0866FF]" : "bg-gray-100 text-gray-400"}`}>
                      {access ? <PlayCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1c2b33] truncate">{l.title}</p>
                      <p className="text-xs text-gray-400 truncate">{l.description}</p>
                    </div>
                    {l.isPreview && !c.isFree && !hasActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">Pratinjau</span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" /> {l.durationMin}m</span>
                    {access && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                  </div>
                );
                return access ? (
                  <Link key={l.id} href={`/dashboard/kelas/${c.slug}/${l.id}`}>{inner}</Link>
                ) : (
                  <div key={l.id} title="Berlangganan untuk membuka">{inner}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
