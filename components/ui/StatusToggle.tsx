"use client";

import { useState, useTransition } from "react";

interface Props {
  entityId: string;
  entityType: "campaign" | "adset" | "ad";
  isActive: boolean;
}

export default function StatusToggle({ entityId, entityType, isActive }: Props) {
  const [active, setActive] = useState(isActive);
  const [, startTransition] = useTransition();

  const toggle = () => {
    const next = !active;
    setActive(next);
    startTransition(async () => {
      try {
        await fetch(`/api/${entityType}s/${entityId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next ? "ACTIVE" : "PAUSED" }),
        });
      } catch {
        setActive(!next);
      }
    });
  };

  return (
    <button
      onClick={toggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        active ? "bg-[#0866FF]" : "bg-gray-300"
      }`}
      title={active ? "Pause" : "Activate"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-4.5" : "translate-x-1"
        }`}
        style={{ transform: active ? "translateX(18px)" : "translateX(3px)" }}
      />
    </button>
  );
}
