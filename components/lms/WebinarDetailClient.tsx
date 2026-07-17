"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video, User, Calendar, Award, ExternalLink, HelpCircle, Check, Loader2, AlertCircle,
  PlayCircle, RotateCcw, UserPlus, UserCheck, Lock, ShieldCheck
} from "lucide-react";
import type { Webinar, WebinarQuestion, WebinarAttempt } from "@/types";

function getYoutubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function WebinarDetailClient({
  webinar,
  questions,
  attempts,
  isRegistered: initialRegistered,
}: {
  webinar: Webinar;
  questions: WebinarQuestion[];
  attempts: WebinarAttempt[];
  isRegistered: boolean;
}) {
  const [isRegistered, setIsRegistered] = useState(initialRegistered);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [bestAttempt, setBestAttempt] = useState<WebinarAttempt | null>(() => {
    const passed = attempts.find((a) => a.passed);
    return passed ?? (attempts.length > 0 ? attempts[0] : null);
  });

  const [examPassed, setExamPassed] = useState<boolean>(() => !!attempts.some((a) => a.passed));
  const [lastScore, setLastScore] = useState<number | null>(() => attempts.length > 0 ? attempts[0].score : null);
  const [showExamResult, setShowExamResult] = useState(false);

  // States for exam passcode lock
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");

  const hasPasscode = !!webinar.examPasscode?.trim();
  const isExamLockedByPasscode = hasPasscode && !passcodeVerified && !examPassed;

  const youtubeEmbed = getYoutubeEmbedUrl(webinar.meetingLink);
  const isYoutubeLink = !!youtubeEmbed;

  const formattedDate = new Date(webinar.schedule).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const isExamQuestionsReady = questions.length === 10;

  // ── Daftar Webinar ──
  async function handleRegister() {
    setRegistering(true);
    setRegError("");
    try {
      const res = await fetch(`/api/webinars/${webinar.id}/register`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setRegError(data.error ?? "Gagal mendaftar."); return; }
      setIsRegistered(true);
    } catch {
      setRegError("Gagal terhubung ke server.");
    } finally {
      setRegistering(false);
    }
  }

  // ── Submit Ujian ──
  async function handleSubmitExam(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError("Harap jawab semua pertanyaan sebelum mengirimkan.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/webinars/${webinar.id}/exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Gagal mengirimkan ujian."); return; }

      setLastScore(data.score);
      setExamPassed(data.passed);
      setBestAttempt({
        id: "", userId: "", webinarId: webinar.id,
        score: data.score, correctCount: data.correctCount, totalCount: data.totalCount,
        passed: data.passed, certNumber: data.certNumber,
        answers: JSON.stringify(selectedAnswers), createdAt: new Date().toISOString()
      });
      setShowExamResult(true);
    } catch {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetryExam() {
    setSelectedAnswers({});
    setShowExamResult(false);
    setError("");
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/dashboard/webinar" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0866FF] transition-colors font-medium">
        &larr; Kembali ke Webinar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Kolom Kiri: Stream & Info ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Player / Placeholder */}
            {isRegistered ? (
              isYoutubeLink ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={youtubeEmbed!}
                    title="Webinar Live Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-gradient-to-br from-[#0f1729] to-[#15233f] text-white space-y-4">
                  <PlayCircle className="w-16 h-16 text-[#0866FF] mx-auto animate-pulse" />
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold">Webinar di Platform Eksternal</h3>
                    <p className="text-xs text-white/60 max-w-md mx-auto">Bergabung ke ruang pertemuan virtual via link di bawah ini.</p>
                  </div>
                  {webinar.meetingLink ? (
                    <a
                      href={webinar.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#0866FF]/20 hover:scale-[1.02]"
                    >
                      Masuk Ruang Webinar <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-1.5 bg-white/10 text-white/50 text-sm font-bold px-5 py-2.5 rounded-xl cursor-not-allowed">
                      Tautan Belum Tersedia
                    </button>
                  )}
                </div>
              )
            ) : (
              /* LOCKED — belum daftar */
              <div className="p-8 text-center bg-gradient-to-br from-[#0f1729] to-[#15233f] text-white space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-white/60" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Daftar untuk Mengakses Webinar</h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Pendaftaran gratis. Setelah terdaftar, Anda bisa mengakses link meeting dan mengikuti ujian sertifikasi.
                  </p>
                </div>
                {regError && (
                  <p className="text-xs text-red-400">{regError}</p>
                )}
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#0866FF]/20 hover:scale-[1.02] disabled:opacity-50"
                >
                  {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {registering ? "Mendaftar..." : "Daftar Sekarang — Gratis"}
                </button>
              </div>
            )}

            {/* Info webinar */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl font-extrabold text-[#1c2b33] tracking-tight">{webinar.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#0866FF]" /> Pemateri: <b>{webinar.speaker}</b></span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#0866FF]" /> {formattedDate} WIB</span>
                  </div>
                </div>
                {isRegistered && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
                    <UserCheck className="w-3.5 h-3.5" /> Terdaftar
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Topik Bahasan</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {webinar.description || "Tidak ada deskripsi yang tersedia."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Ujian Sertifikasi ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 h-fit">
            <div>
              <h2 className="text-lg font-bold text-[#1c2b33] flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-500" /> Ujian Sertifikasi
              </h2>
              <p className="text-xs text-gray-400 mt-1">Raih skor ≥ 80 untuk mendapatkan sertifikat kelulusan.</p>
            </div>

            {/* Belum daftar → lock ujian */}
            {!isRegistered ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-600">Ujian Terkunci</p>
                  <p className="text-xs text-gray-400 px-4">Daftar webinar terlebih dahulu untuk mengakses ujian sertifikasi.</p>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {registering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  Daftar Sekarang
                </button>
              </div>
            ) : isExamLockedByPasscode ? (
              <div className="text-center py-6 bg-amber-50/50 border border-dashed border-amber-200 rounded-2xl p-5 space-y-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-amber-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-950">Ujian Memerlukan Kode Akses</p>
                  <p className="text-xs text-amber-800 px-2 leading-relaxed">
                    Masukkan kode akses ujian yang dibagikan oleh pemateri selama sesi webinar berlangsung.
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="KODE AKSES UJIAN"
                    className="w-full text-center rounded-xl border border-amber-200 px-3 py-2.5 text-sm bg-white font-mono font-bold uppercase focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {passcodeError && (
                    <p className="text-[11px] text-red-600 font-semibold">{passcodeError}</p>
                  )}
                  <button
                    onClick={() => {
                      if (passcodeInput.trim().toUpperCase() === webinar.examPasscode.trim().toUpperCase()) {
                        setPasscodeVerified(true);
                        setPasscodeError("");
                      } else {
                        setPasscodeError("Kode akses salah. Silakan periksa kembali.");
                      }
                    }}
                    className="w-full bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Buka Ujian
                  </button>
                </div>
              </div>
            ) : !isExamQuestionsReady ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 px-4">Soal ujian sedang dipersiapkan oleh penyelenggara.</p>
              </div>
            ) : examPassed ? (
              /* LULUS */
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-emerald-950 text-base">Selamat! Anda Lulus</h3>
                  <p className="text-xs text-emerald-800">Skor: <b>{lastScore}%</b></p>
                  {bestAttempt?.certNumber && (
                    <p className="text-[10px] font-mono text-emerald-600 bg-white/60 px-2 py-0.5 rounded border border-emerald-100 w-fit mx-auto">
                      {bestAttempt.certNumber}
                    </p>
                  )}
                </div>
                <Link href={`/dashboard/webinar/${webinar.id}/sertifikat`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4" /> Lihat & Cetak Sertifikat
                </Link>
                <button onClick={handleRetryExam}
                  className="w-full inline-flex items-center justify-center gap-1 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
                  <RotateCcw className="w-3.5 h-3.5" /> Ulangi Ujian (Opsional)
                </button>
              </div>
            ) : showExamResult && lastScore !== null ? (
              /* GAGAL */
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-amber-950 text-base">Belum Lulus</h3>
                  <p className="text-xs text-amber-800">Skor: <b>{lastScore}%</b>. Minimal 80% untuk lulus.</p>
                </div>
                <button onClick={handleRetryExam}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-4 py-2.5 rounded-xl">
                  <RotateCcw className="w-4 h-4" /> Ulangi Ujian
                </button>
              </div>
            ) : (
              /* FORM UJIAN */
              <form onSubmit={handleSubmitExam} className="space-y-6">
                <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    let opts: string[] = [];
                    try { opts = JSON.parse(q.options); } catch {}
                    return (
                      <div key={q.id} className="space-y-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-bold text-gray-800 leading-snug">{idx + 1}. {q.question}</p>
                        <div className="space-y-1.5">
                          {opts.map((opt, optIdx) => {
                            const active = selectedAnswers[q.id] === optIdx;
                            return (
                              <button key={optIdx} type="button"
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all ${active ? "bg-[#e7f0ff] border-[#0866FF] text-[#0866FF]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                              >
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${active ? "border-[#0866FF] bg-[#0866FF] text-white" : "border-gray-300 text-gray-400"}`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1 leading-normal">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirimkan...</> : <><Check className="w-4 h-4" /> Kirim Jawaban</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
