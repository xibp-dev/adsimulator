"use client";

import { useRef, useState, useEffect } from "react";
import { Coffee } from "lucide-react";

interface Props {
  onClick: () => void;
}

const STORAGE_KEY = "traktirPos";
const DRAG_THRESHOLD = 4; // px — di bawah ini dianggap klik, bukan geser

export default function DraggableTraktir({ onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef({ active: false, moved: false, offsetX: 0, offsetY: 0, startX: 0, startY: 0 });

  const clamp = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(8, Math.min(x, window.innerWidth - w - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - h - 8)),
  });

  // Posisi awal: dari localStorage atau default kanan-tengah
  useEffect(() => {
    const el = ref.current;
    const w = el?.offsetWidth ?? 48;
    const h = el?.offsetHeight ?? 120;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setPos(clamp(p.x, p.y, w, h));
        return;
      }
    } catch {}
    setPos({ x: window.innerWidth - w - 8, y: window.innerHeight / 2 - h / 2 });
  }, []);

  // Re-clamp saat ukuran window berubah
  useEffect(() => {
    const onResize = () => {
      const el = ref.current;
      if (!el) return;
      setPos((prev) => (prev ? clamp(prev.x, prev.y, el.offsetWidth, el.offsetHeight) : prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    drag.current = {
      active: true,
      moved: false,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const el = ref.current;
    if (!el) return;
    if (
      Math.abs(e.clientX - drag.current.startX) > DRAG_THRESHOLD ||
      Math.abs(e.clientY - drag.current.startY) > DRAG_THRESHOLD
    ) {
      drag.current.moved = true;
    }
    const next = clamp(
      e.clientX - drag.current.offsetX,
      e.clientY - drag.current.offsetY,
      el.offsetWidth,
      el.offsetHeight
    );
    setPos(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = ref.current;
    if (el) {
      try { el.releasePointerCapture(e.pointerId); } catch {}
    }
    if (drag.current.moved) {
      if (el) {
        const rect = el.getBoundingClientRect();
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: rect.left, y: rect.top })); } catch {}
      }
    } else {
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      title="Tahan & geser untuk pindahkan posisi"
      style={{
        position: "fixed",
        left: pos ? pos.x : undefined,
        top: pos ? pos.y : undefined,
        right: pos ? undefined : 0,
        zIndex: 40,
        touchAction: "none",
        visibility: pos ? "visible" : "hidden",
      }}
      className="select-none"
    >
      <div
        className="flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] text-white px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs tracking-wide cursor-grab active:cursor-grabbing transition-colors"
        style={{ boxShadow: "0 10px 25px -5px rgba(8, 102, 255, 0.4)" }}
      >
        <Coffee className="w-4 h-4 fill-white/10" />
        <span className="writing-mode-vertical">Traktir Kopi ☕</span>
      </div>
    </div>
  );
}
