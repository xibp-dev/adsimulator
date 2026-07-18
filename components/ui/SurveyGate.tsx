"use client";

import { useState, useEffect } from "react";
import SurveyModal from "@/components/ui/SurveyModal";
import type { SurveyConfig } from "@/lib/siteSettings";

export default function SurveyGate({ surveyEnabled }: { surveyEnabled: boolean }) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyConfig, setSurveyConfig] = useState<SurveyConfig | null>(null);

  useEffect(() => {
    if (!surveyEnabled) return;

    // Paralel: cek completion + ambil config
    Promise.all([
      fetch("/api/survey").then(r => r.json()),
      fetch("/api/survey/config").then(r => r.json()),
    ])
      .then(([status, config]) => {
        setSurveyConfig(config);
        if (!status.hasCompleted) {
          setTimeout(() => setShowSurvey(true), 1200);
        }
      })
      .catch(() => {/* silent fail */});
  }, [surveyEnabled]);

  if (!showSurvey || !surveyConfig) return null;

  return <SurveyModal config={surveyConfig} onClose={() => setShowSurvey(false)} />;
}
