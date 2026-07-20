"use client";

import { useEffect, useState } from "react";
import { FileText, MonitorPlay, Presentation } from "lucide-react";

interface LessonVideoProps {
  embedUrl: string;
  type: "youtube" | "slides" | "pdf" | "office" | "generic";
  watermark: string;
}

export default function LessonVideo({ embedUrl, type, watermark }: LessonVideoProps) {
  const isVideo = type === "youtube";
  const [pos, setPos] = useState(0);

  const positions = [
    { top: "12%", left: "8%" },
    { top: "70%", left: "60%" },
    { top: "40%", left: "35%" },
    { top: "18%", left: "62%" },
    { top: "75%", left: "10%" },
  ];

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % positions.length), 4500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-gray-800 shadow-xl select-none ${
        isVideo ? "aspect-video" : "h-[450px] md:h-[560px] w-full"
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Title bar / Badge depending on content type */}
      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 pointer-events-none">
        {type === "youtube" && (
          <>
            <MonitorPlay className="w-3.5 h-3.5 text-blue-400" />
            <span>Video Pembelajaran</span>
          </>
        )}
        {type === "slides" && (
          <>
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>Slide Presentasi</span>
          </>
        )}
        {(type === "pdf" || type === "office") && (
          <>
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modul Materi</span>
          </>
        )}
        {type === "generic" && (
          <>
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Materi Tambahan</span>
          </>
        )}
      </div>

      <iframe
        src={embedUrl}
        className="w-full h-full border-none"
        title="Materi pembelajaran"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Floating Watermark Pelacak */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute text-white/15 text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-1000 drop-shadow"
          style={{ top: positions[pos].top, left: positions[pos].left, transform: "rotate(-18deg)" }}
        >
          {watermark}
        </span>
        {/* Fixed corner watermark as anchor */}
        <span className="absolute bottom-3 right-3 text-white/10 text-[9px] font-mono tracking-wider">
          AdSimulator · {watermark}
        </span>
      </div>
    </div>
  );
}
