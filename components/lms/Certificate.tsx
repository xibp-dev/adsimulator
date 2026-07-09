"use client";

import Link from "next/link";
import { Printer, ArrowLeft, Layers, Check, ShieldCheck } from "lucide-react";

const NAVY1 = "#0f1729";
const NAVY2 = "#15233f";
const INK = "#1c2b33";

export default function Certificate({
  name, courseTitle, level, category = "", score, certNumber, dateStr, courseSlug,
  competencies = [], lessonCount = 0,
  institution = "AdSimulator Academy",
  signatory = "AdSimulator Academy",
  signatoryTitle = "Penyelenggara",
  logoUrl = "",
  accent = "#0866FF",
}: {
  name: string; courseTitle: string; level: string; category?: string; score: number;
  certNumber: string; dateStr: string; courseSlug: string;
  competencies?: string[]; lessonCount?: number;
  institution?: string; signatory?: string; signatoryTitle?: string; logoUrl?: string; accent?: string;
}) {
  const predikat = score >= 95 ? "Dengan Pujian" : score >= 90 ? "Sangat Memuaskan" : "Memuaskan";
  const headerBg = `linear-gradient(120deg, ${NAVY1} 0%, ${NAVY2} 55%, ${accent} 140%)`;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 6mm; }
          body * { visibility: hidden !important; }
          #cert-area, #cert-area * { visibility: visible !important; }
          #cert-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        #cert-area, #cert-area * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* Toolbar */}
      <div className="no-print flex items-center justify-between">
        <Link href="/dashboard/sertifikasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0866FF]">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Sertifikasi
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors" style={{ backgroundColor: accent }}>
          <Printer className="w-4 h-4" /> Cetak / Simpan PDF
        </button>
      </div>

      {/* ── Sertifikat ── */}
      <div id="cert-area">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          {/* Garis aksen atas */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${accent}, ${NAVY2})` }} />

          {/* Header brand — gradient navy→biru seperti hero dashboard */}
          <div className="relative px-10 py-8 text-center overflow-hidden" style={{ background: headerBg }}>
            <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full" style={{ backgroundColor: accent, opacity: 0.25, filter: "blur(60px)" }} />
            <div className="absolute -bottom-20 left-1/4 w-56 h-56 rounded-full bg-white opacity-[0.06]" style={{ filter: "blur(50px)" }} />
            <div className="relative flex items-center justify-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={institution} className="h-11 object-contain" />
              ) : (
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
                  <Layers className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="text-left">
                <p className="text-white font-bold text-lg leading-tight tracking-tight">{institution}</p>
                <p className="text-white/55 text-[10px] font-semibold uppercase tracking-[0.25em]">Simulator &amp; Edukasi Meta Ads</p>
              </div>
            </div>
          </div>

          {/* Watermark brand */}
          <div className="absolute left-0 right-0 bottom-0 top-24 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <Layers className="w-72 h-72" style={{ color: accent, opacity: 0.04 }} strokeWidth={1} />
          </div>

          {/* Body */}
          <div className="relative px-8 py-9 md:px-16 md:py-11 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-[0.14em]" style={{ color: INK }}>SERTIFIKAT KELULUSAN</h2>
            <div className="flex items-center justify-center gap-2.5 mt-2.5" aria-hidden="true">
              <span className="block h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(to left, ${accent}, transparent)` }} />
              <span className="block w-2 h-2 rotate-45 rounded-[2px]" style={{ backgroundColor: accent }} />
              <span className="block h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
            </div>

            <p className="mt-6 text-sm text-gray-400">Dengan bangga diberikan kepada</p>
            <h1 className="mt-1.5 text-3xl md:text-4xl font-extrabold" style={{ color: INK }}>{name}</h1>
            <div className="mx-auto mt-2.5 h-1 w-24 rounded-full" style={{ backgroundColor: accent }} />

            <p className="mt-5 text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              telah menyelesaikan seluruh materi pembelajaran dan dinyatakan <b style={{ color: INK }}>LULUS</b> ujian sertifikasi kelas
            </p>
            <p className="mt-2 text-lg md:text-2xl font-bold" style={{ color: accent }}>{courseTitle}</p>

            {/* Pill info */}
            <div className="mt-3.5 flex items-center justify-center gap-2 flex-wrap">
              {[`Level ${level}`, category, lessonCount ? `${lessonCount} Materi` : ""].filter(Boolean).map((t) => (
                <span key={t} className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${accent}12`, color: accent }}>{t}</span>
              ))}
              <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: accent }}>Predikat: {predikat}</span>
            </div>

            {/* Kompetensi */}
            {competencies.length > 0 && (
              <div className="mt-7 mx-auto max-w-2xl text-left rounded-2xl p-5" style={{ backgroundColor: `${accent}08`, border: `1px solid ${accent}20` }}>
                <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] mb-3.5" style={{ color: accent }}>
                  Kompetensi yang Dikuasai
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {competencies.map((k, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-700 leading-snug">
                      <span className="w-4.5 h-4.5 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accent }}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer: tanggal · medali · tanda tangan */}
            <div className="mt-9 grid grid-cols-3 items-end gap-4">
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: INK }}>{dateStr}</p>
                <div className="mx-auto mt-1.5 mb-1 h-px w-36 bg-gray-200" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">Tanggal Terbit</p>
                <p className="mt-2 text-[10px] font-mono text-gray-400">{certNumber}</p>
              </div>

              {/* Segel resmi brand — tanpa menampilkan skor */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${accent}, ${accent}44, ${accent})` }} />
                  <div className="absolute inset-[3px] rounded-full bg-white flex flex-col items-center justify-center shadow-inner gap-0.5">
                    <Layers className="w-6 h-6" style={{ color: accent }} />
                    <span className="text-[10px] font-extrabold tracking-[0.15em]" style={{ color: accent }}>LULUS</span>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-2.5 h-4" style={{ backgroundColor: accent, clipPath: "polygon(0 0,100% 0,100% 100%,50% 68%,0 100%)" }} />
                    <div className="w-2.5 h-4" style={{ backgroundColor: NAVY2, clipPath: "polygon(0 0,100% 0,100% 100%,50% 68%,0 100%)" }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[10px] font-semibold" style={{ color: accent }}>
                  <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                </div>
              </div>

              <div className="text-center">
                <div className="h-6" />
                <div className="mx-auto mb-1 h-px w-36 bg-gray-200" />
                <p className="text-sm font-bold" style={{ color: INK }}>{signatory}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">{signatoryTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
