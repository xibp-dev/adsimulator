import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/siteSettings";
import WebinarCertificate from "@/components/lms/WebinarCertificate";
import type { Webinar, WebinarAttempt } from "@/types";
import { ArrowLeft, Award, ClipboardCheck } from "lucide-react";

export const metadata = { title: "Sertifikat Webinar" };

export default async function WebinarCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const { data: webinar } = await supabase.from("Webinar").select("*").eq("id", id).single();
  if (!webinar) notFound();
  const w = webinar as Webinar;

  // Ambil percobaan yang lulus (nilai tertinggi)
  const { data: attempts } = await supabase
    .from("WebinarAttempt")
    .select("*")
    .eq("userId", session.user.id)
    .eq("webinarId", id)
    .eq("passed", true)
    .order("score", { ascending: false })
    .order("createdAt", { ascending: true })
    .limit(1);

  const attempt = (attempts && attempts.length > 0 ? attempts[0] : null) as WebinarAttempt | null;

  // Belum lulus → tampilkan pesan
  if (!attempt) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Link href={`/dashboard/webinar/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Webinar
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#1c2b33]">Sertifikat belum tersedia</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Kamu belum lulus ujian webinar ini. Selesaikan ujian dengan nilai minimal 80 untuk mendapatkan sertifikat.
            </p>
          </div>
          <Link
            href={`/dashboard/webinar/${id}`}
            className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
          >
            <ClipboardCheck className="w-4 h-4" /> Ikuti Ujian Webinar
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(attempt.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const settings = await getSiteSettings();

  return (
    <div className="p-4 md:p-6">
      <WebinarCertificate
        name={session.user.name ?? "Peserta"}
        webinarTitle={w.title}
        speaker={w.speaker}
        score={attempt.score}
        certNumber={attempt.certNumber ?? "-"}
        dateStr={dateStr}
        webinarId={id}
        institution={settings.certInstitution || settings.siteName || "AdSimulator Academy"}
        signatory={settings.certSignatory || settings.siteName || "AdSimulator Academy"}
        signatoryTitle={settings.certSignatoryTitle || "Penyelenggara"}
        logoUrl={settings.certLogoUrl || settings.logoUrl || ""}
        accent={settings.certAccent || "#0866FF"}
      />
    </div>
  );
}
