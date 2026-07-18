"use client";

import { useState, useEffect } from "react";
import SurveyModal from "@/components/ui/SurveyModal";

export default function SurveyGate({ surveyEnabled }: { surveyEnabled: boolean }) {
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    if (!surveyEnabled) return;

    // Cek apakah user sudah mengisi survei
    fetch("/api/survey")
      .then((r) => r.json())
      .then((data) => {
        if (!data.hasCompleted) {
          // Delay sedikit agar tidak langsung muncul saat halaman baru load
          setTimeout(() => setShowSurvey(true), 1200);
        }
      })
      .catch(() => {/* silent fail */});
  }, [surveyEnabled]);

  if (!showSurvey) return null;

  return <SurveyModal onClose={() => setShowSurvey(false)} />;
}
