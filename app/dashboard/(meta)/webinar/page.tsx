import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Video, Calendar, User, LayoutGrid, CheckCircle2, Award, UserPlus, UserCheck, Sparkles, AlertCircle, ClipboardCheck
} from "lucide-react";
import type { Webinar } from "@/types";

export const metadata = { title: "Webinar Digital Marketing & Ads" };

export default async function UserWebinarListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Ambil webinar yang terbit, soal webinar, attempt user, dan registrasi user
  const [{ data: webinarsRaw }, { data: questionsRaw }, { data: attemptsRaw }, { data: registrationsRaw }] = await Promise.all([
    supabase.from("Webinar").select("*").eq("published", true).order("schedule", { ascending: false }),
    supabase.from("WebinarQuestion").select("webinarId"),
    supabase.from("WebinarAttempt").select("webinarId, score, passed").eq("userId", session.user.id),
    supabase.from("WebinarRegistration").select("webinarId").eq("userId", session.user.id),
  ]);

  const webinars = (webinarsRaw || []) as Webinar[];

  // Hitung jumlah soal per webinar
  const qCounts: Record<string, number> = {};
  (questionsRaw || []).forEach((q: any) => {
    qCounts[q.webinarId] = (qCounts[q.webinarId] || 0) + 1;
  });

  // Ambil skor terbaik untuk tiap webinar
  const bestAttempts: Record<string, { score: number; passed: boolean }> = {};
  (attemptsRaw || []).forEach((a: any) => {
    const cur = bestAttempts[a.webinarId];
    if (!cur || a.score > cur.score) {
      bestAttempts[a.webinarId] = { score: a.score, passed: a.passed };
    }
  });

  // Webinar mana saja yang sudah didaftarkan user
  const registeredSet = new Set<string>((registrationsRaw || []).map((r: any) => r.webinarId));

  // Dapatkan waktu saat ini untuk membandingkan jadwal
  const now = new Date();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/hub" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
            <LayoutGrid className="w-3.5 h-3.5" /> AdSimulator
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-[#0866FF] font-semibold">Webinar</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1c2b33] tracking-tight flex items-center gap-2">
          <Video className="w-6 h-6 text-[#0866FF]" /> Webinar & Workshop
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Tingkatkan skill digital marketing Anda melalui webinar interaktif secara gratis khusus anggota terdaftar.
        </p>
      </div>

      {/* Info Card */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-blue-900">
        <Sparkles className="w-5 h-5 text-[#0866FF] flex-shrink-0" />
        <p className="text-sm">
          <b>Program Webinar Gratis</b> — Ikuti sesi, kerjakan ujian singkat (10 pertanyaan) setelah acara, dan klaim sertifikat jika nilai Anda mencapai 80% atau lebih!
        </p>
      </div>

      {/* Grid Webinar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {webinars.map((w) => {
          const qCount = qCounts[w.id] || 0;
          const best = bestAttempts[w.id];
          const isUserRegistered = registeredSet.has(w.id);
          const scheduleDate = new Date(w.schedule);
          
          // Tentukan status webinar
          let statusText = "Segera Hadir";
          let statusColor = "bg-amber-50 text-amber-600 border border-amber-100";

          // Selisih waktu dalam milidetik
          const diffMs = scheduleDate.getTime() - now.getTime();
          if (diffMs < 0) {
            if (Math.abs(diffMs) > 2 * 60 * 60 * 1000) {
              statusText = "Sudah Selesai";
              statusColor = "bg-gray-100 text-gray-500 border border-gray-200";
            } else {
              statusText = "Sedang Berlangsung";
              statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold";
            }
          } else {
            if (diffMs <= 30 * 60 * 1000) {
              statusText = "Segera Mulai";
              statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse font-bold";
            } else {
              statusText = "Segera Hadir";
              statusColor = "bg-amber-50 text-amber-600 border border-amber-100";
            }
          }

          const formattedDate = scheduleDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div key={w.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#e7f0ff] text-[#0866FF] flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor}`}>
                  {statusText === "Sedang Berlangsung" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />}
                  {statusText}
                </span>
                {/* Badge registrasi */}
                {isUserRegistered && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <UserCheck className="w-3 h-3" /> Terdaftar
                  </span>
                )}
              </div>

              <h3 className="font-bold text-[#1c2b33] leading-snug text-base flex-1">
                {w.title}
              </h3>
              
              <div className="space-y-1.5 my-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0866FF] flex-shrink-0" />
                  <span className="truncate">Pemateri: <b>{w.speaker}</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0866FF] flex-shrink-0" />
                  <span>{formattedDate} WIB</span>
                </div>
                {qCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>Ujian Tersedia ({qCount} Soal)</span>
                  </div>
                )}
              </div>

              {/* Status Ujian User */}
              {best ? (
                <div className="mb-4 p-2.5 rounded-xl border flex items-center gap-2 text-xs bg-gray-50/50">
                  {best.passed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-emerald-700 font-bold">Lulus (Skor: {best.score}%)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-amber-700 font-bold">Belum Lulus (Skor: {best.score}%)</span>
                    </>
                  )}
                </div>
              ) : null}

              {/* Tombol Aksi */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2">
                <Link
                  href={`/dashboard/webinar/${w.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors"
                >
                  {isUserRegistered ? (
                    <><ClipboardCheck className="w-3.5 h-3.5" /> Buka Webinar & Ujian</>
                  ) : (
                    <><UserPlus className="w-3.5 h-3.5" /> Lihat & Daftar Webinar</>
                  )}
                </Link>
              </div>
            </div>
          );
        })}

        {webinars.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            Belum ada jadwal webinar yang diterbitkan.
          </div>
        )}
      </div>
    </div>
  );
}
