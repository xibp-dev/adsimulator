"use client";

import { useState } from "react";
import {
  X, ChevronRight, Loader2, CheckCircle2, Megaphone, Briefcase,
  Phone, Globe, Share2, ClipboardCheck
} from "lucide-react";
import { type SurveyConfig } from "@/lib/siteSettings";

interface SurveyModalProps {
  onClose: () => void;
  config: SurveyConfig;
}

type Step = 0 | 1 | 2 | 3 | 4;

export default function SurveyModal({ onClose, config }: SurveyModalProps) {
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    hasAdvertised: "",
    profession: "",
    whatsapp: "",
    hasWebsite: "",
    socialMedia: "",
  });

  const totalSteps = 5;
  const progress = Math.round(((step) / totalSteps) * 100);

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan. Silakan coba lagi.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => onClose(), 2500);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1c2b33]">Terima Kasih! 🎉</h2>
            <p className="text-sm text-gray-400 mt-1">Informasi kamu sudah kami terima. Selamat belajar!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0f1729] to-[#1a2d55] px-6 pt-6 pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup survei"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0866FF]/20 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-[#5b9bff]" />
            </div>
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Survei Singkat</span>
          </div>

          <h2 className="text-xl font-extrabold text-white leading-tight">
            Bantu Kami Mengenal Kamu 👋
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Jawab {totalSteps} pertanyaan singkat untuk pengalaman yang lebih personal.
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0866FF] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-white/30 mt-1 text-right">
            {step > 0 ? `${step} dari ${totalSteps}` : "Belum mulai"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 bg-[#e7f0ff] rounded-2xl flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-8 h-8 text-[#0866FF]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1c2b33]">Hei, sebelum memulai…</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Kami ingin mengenal kamu lebih baik agar bisa memberikan konten & pengalaman yang relevan. Hanya butuh <strong>1–2 menit</strong>.
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#0866FF]/20"
              >
                Mulai Survei <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
              >
                Lewati untuk sekarang
              </button>
            </div>
          )}

          {/* Step 1: Pernah beriklan? */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-[#0866FF]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pertanyaan 1</p>
                  <h3 className="text-sm font-bold text-[#1c2b33]">{config.q1Label}</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {config.q1Options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setForm(f => ({ ...f, hasAdvertised: opt.value })); setStep(2); }}
                    className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                      form.hasAdvertised === opt.value
                        ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#0866FF]/30 hover:bg-blue-50/40"
                    }`}
                  >
                    {opt.display}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Profesi */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pertanyaan 2</p>
                  <h3 className="text-sm font-bold text-[#1c2b33]">{config.q2Label}</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                {config.q2Options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setForm(f => ({ ...f, profession: opt })); setStep(3); }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      form.profession === opt
                        ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#0866FF]/30 hover:bg-blue-50/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: WhatsApp + Website */}
          {step === 3 && (
            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pertanyaan 3{!config.q3Required && " (opsional)"}</p>
                    <h3 className="text-sm font-bold text-[#1c2b33]">{config.q3Label}</h3>
                  </div>
                </div>
                <input
                  type="tel"
                  placeholder={config.q3Placeholder}
                  value={form.whatsapp}
                  onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0866FF] transition-all"
                />
              </div>

              {/* Punya Website? */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pertanyaan 4</p>
                    <h3 className="text-sm font-bold text-[#1c2b33]">{config.q4Label}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {config.q4Options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, hasWebsite: opt.value }))}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        form.hasWebsite === opt.value
                          ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#0866FF]/30"
                      }`}
                    >
                      {opt.display}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (config.q3Required && !form.whatsapp.trim()) { setError("Nomor WhatsApp wajib diisi."); return; }
                  if (!form.hasWebsite) { setError("Pilih apakah kamu punya website."); return; }
                  setError("");
                  setStep(4);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            </div>
          )}

          {/* Step 4: Social Media + Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-4 h-4 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pertanyaan 5{!config.q5Required && " (opsional)"}</p>
                    <h3 className="text-sm font-bold text-[#1c2b33]">{config.q5Label}</h3>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder={config.q5Placeholder}
                  value={form.socialMedia}
                  onChange={(e) => setForm(f => ({ ...f, socialMedia: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0866FF] transition-all"
                />
                <p className="text-[10px] text-gray-400">{config.q5Sublabel}</p>
              </div>

              {/* Ringkasan */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ringkasan Jawabanmu</p>
                {[
                  { label: "Pernah beriklan", value: form.hasAdvertised },
                  { label: "Profesi", value: form.profession },
                  { label: "WhatsApp", value: form.whatsapp },
                  { label: "Punya website", value: form.hasWebsite },
                  { label: "Sosial media", value: form.socialMedia || "—" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-[#1c2b33] text-right truncate max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white font-bold text-sm px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#0866FF]/20 disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Kirim Survei</>
                )}
              </button>
            </div>
          )}

          {/* Back button — step 2,3,4 */}
          {step >= 2 && !submitted && (
            <button
              onClick={() => { setStep((step - 1) as Step); setError(""); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              ← Kembali
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
