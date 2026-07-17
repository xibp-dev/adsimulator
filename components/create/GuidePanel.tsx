"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface GuideTip {
  field: string;
  what: string;
  recommendation: string;
}

interface GuidePanelProps {
  title: string;
  summary: string;
  tips: GuideTip[];
  defaultOpen?: boolean;
}

export default function GuidePanel({ title, summary, tips, defaultOpen = false }: GuidePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/40 overflow-hidden mb-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-[#0866FF]">
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          {title}
        </span>
        <span className="text-blue-400">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-blue-100">
          <p className="text-xs text-blue-800 leading-relaxed pt-3">{summary}</p>
          <div className="space-y-2.5">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white/70 border border-blue-100 rounded-xl p-3 space-y-1.5">
                <span className="text-[11px] font-extrabold text-[#0866FF] uppercase tracking-wider block">
                  {tip.field}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-800">Apa ini? </span>{tip.what}
                </p>
                <p className="text-xs text-emerald-700 leading-relaxed flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Saran: </span>{tip.recommendation}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
