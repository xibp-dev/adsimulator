"use client";

import { useEffect, useState } from "react";

/**
 * Player video pelajaran (embed YouTube mode privasi) dengan:
 * - watermark email user yang berpindah-pindah (pelacak bocoran / deterrent rekam layar)
 * - klik kanan dinonaktifkan
 * Catatan: rekam layar TIDAK bisa dicegah sepenuhnya di web — watermark membuat bocoran bisa dilacak.
 */
export default function LessonVideo({ embedUrl, watermark }: { embedUrl: string; watermark: string }) {
  // Posisi watermark berpindah tiap beberapa detik agar sulit di-crop/ditutup
  const positions = [
    { top: "12%", left: "8%" },
    { top: "70%", left: "60%" },
    { top: "40%", left: "35%" },
    { top: "18%", left: "62%" },
    { top: "75%", left: "10%" },
  ];
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % positions.length), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative aspect-video rounded-2xl overflow-hidden bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        title="Video pembelajaran"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Watermark berpindah — tidak menghalangi kontrol (pointer-events-none) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute text-white/25 text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-1000 drop-shadow"
          style={{ top: positions[pos].top, left: positions[pos].left, transform: "rotate(-18deg)" }}
        >
          {watermark}
        </span>
        {/* Watermark tetap di pojok sebagai jangkar */}
        <span className="absolute bottom-2 right-3 text-white/20 text-[10px] font-medium">
          {watermark}
        </span>
      </div>
    </div>
  );
}
