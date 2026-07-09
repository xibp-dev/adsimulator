"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, XCircle, Loader2, Award, RotateCcw, AlertCircle, ClipboardCheck, ArrowLeft,
} from "lucide-react";

interface QuestionLite {
  id: string;
  question: string;
  options: string[];
}
interface Result {
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  certNumber: string | null;
}

export default function ExamClient({
  courseId, courseSlug, courseTitle, questions, passScore,
}: {
  courseId: string; courseSlug: string; courseTitle: string; questions: QuestionLite[]; passScore: number;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  async function submit() {
    if (!allAnswered) { setError("Jawab semua soal dulu ya."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/exams/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Gagal mengirim jawaban"); return; }
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setAnswers({}); setResult(null); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Layar hasil ──
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${result.passed ? "border-emerald-200" : "border-amber-200"}`}>
          <div className={`p-8 text-center ${result.passed ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur mb-4">
              {result.passed ? <Award className="w-10 h-10 text-white" /> : <RotateCcw className="w-10 h-10 text-white" />}
            </div>
            <p className="text-white/80 text-sm font-medium">Nilai kamu</p>
            <p className="text-6xl font-extrabold text-white leading-none my-2">{result.score}</p>
            <p className="text-white/90 text-sm">{result.correctCount} dari {result.totalCount} jawaban benar</p>
          </div>
          <div className="p-6 bg-white text-center space-y-4">
            {result.passed ? (
              <>
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-5 h-5" /> Selamat, kamu LULUS! 🎉
                </div>
                <p className="text-sm text-gray-500">Nilaimu di atas {passScore}. Sertifikat kelulusan sudah terbit.</p>
                <Link href={`/dashboard/sertifikasi/${courseSlug}/sertifikat`} className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors">
                  <Award className="w-4 h-4" /> Lihat & Unduh Sertifikat
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                  <XCircle className="w-5 h-5" /> Belum lulus
                </div>
                <p className="text-sm text-gray-500">Butuh nilai <b>di atas {passScore}</b> untuk mendapat sertifikat. Pelajari lagi materinya, lalu coba ulang.</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={retry} className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors">
                    <RotateCcw className="w-4 h-4" /> Ulangi Ujian
                  </button>
                  <Link href="/dashboard/sertifikasi" className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-3">
                    Kembali ke Sertifikasi
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Layar pengerjaan ──
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link href="/dashboard/sertifikasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Sertifikasi · {courseTitle}
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e7f0ff] flex items-center justify-center flex-shrink-0">
          <ClipboardCheck className="w-5 h-5 text-[#0866FF]" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1c2b33]">Ujian Kelas</h1>
          <p className="text-xs text-gray-400">{questions.length} soal · nilai lulus di atas {passScore} · sertifikat otomatis bila lulus</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[#0866FF]">{answeredCount}/{questions.length}</p>
          <p className="text-[10px] text-gray-400">terjawab</p>
        </div>
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-[#1c2b33] mb-3">
            <span className="text-[#0866FF]">{qi + 1}.</span> {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl border transition-all ${
                    selected ? "border-[#0866FF] bg-blue-50/60 ring-1 ring-[#0866FF]/20" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-[#0866FF] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="text-sm text-gray-700">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Menilai...</> : <><ClipboardCheck className="w-4 h-4" /> Kumpulkan Jawaban</>}
      </button>
    </div>
  );
}
