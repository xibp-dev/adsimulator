import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/siteSettings";
import Certificate from "@/components/lms/Certificate";
import type { Course, ExamAttempt, Lesson } from "@/types";
import { ArrowLeft, ClipboardCheck, Award } from "lucide-react";

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  const { data: course } = await supabase.from("Course").select("*").eq("slug", slug).single();
  if (!course) notFound();
  const c = course as Course;

  // Cari semua course IDs yang satu program (kelas) dengan course ini
  let courseIds = [c.id];
  let programTitle = c.title;
  let programLevel = c.level;

  if (c.programId) {
    const [{ data: siblingCourses }, { data: programRaw }] = await Promise.all([
      supabase.from("Course").select("id").eq("programId", c.programId).eq("published", true),
      supabase.from("Program").select("title").eq("id", c.programId).single(),
    ]);
    if (siblingCourses && siblingCourses.length > 0) {
      courseIds = siblingCourses.map((sc: any) => sc.id);
    }
    if (programRaw) {
      programTitle = (programRaw as any).title;
    }
  }

  // Ambil percobaan LULUS terbaik (nilai tertinggi) dari semua course di program ini
  const { data: attempts } = await supabase
    .from("ExamAttempt")
    .select("*")
    .eq("userId", session.user.id)
    .in("courseId", courseIds)
    .eq("passed", true)
    .order("score", { ascending: false })
    .order("createdAt", { ascending: true })
    .limit(1);

  const attempt = (attempts && attempts.length > 0 ? attempts[0] : null) as ExamAttempt | null;

  // Belum lulus → arahkan ke ujian
  if (!attempt) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Link href="/dashboard/sertifikasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-6">
          <ArrowLeft className="w-4 h-4" /> Sertifikasi
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500"><Award className="w-8 h-8" /></div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#1c2b33]">Sertifikat belum tersedia</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Kamu belum lulus ujian kelas ini. Selesaikan ujian dengan nilai di atas 85 untuk mendapatkan sertifikat.</p>
          </div>
          <Link href={`/dashboard/sertifikasi/${c.slug}`} className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl">
            <ClipboardCheck className="w-4 h-4" /> Ikuti Ujian
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(attempt.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // Ambil semua lessons dari semua course di program ini untuk daftar kompetensi
  const [settings, { data: lessonsRaw }] = await Promise.all([
    getSiteSettings(),
    supabase.from("Lesson").select("title, section, sortOrder").in("courseId", courseIds).order("sortOrder", { ascending: true }),
  ]);

  const lessons = (lessonsRaw || []) as Pick<Lesson, "title" | "section" | "sortOrder">[];
  const competencies = lessons.map((l) => l.title);

  return (
    <div className="p-4 md:p-6">
      <Certificate
        name={session.user.name ?? "Peserta"}
        courseTitle={programTitle}
        level={programLevel}
        category={c.category}
        score={attempt.score}
        certNumber={attempt.certNumber ?? "-"}
        dateStr={dateStr}
        courseSlug={c.slug}
        competencies={competencies}
        lessonCount={lessons.length}
        institution={settings.certInstitution || settings.siteName || "AdSimulator Academy"}
        signatory={settings.certSignatory || settings.siteName || "AdSimulator Academy"}
        signatoryTitle={settings.certSignatoryTitle || "Penyelenggara"}
        logoUrl={settings.certLogoUrl || settings.logoUrl || ""}
        accent={settings.certAccent || "#0866FF"}
      />
    </div>
  );
}
