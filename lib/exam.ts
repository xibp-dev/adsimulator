// Logika penilaian ujian & sertifikat.

// Nilai HARUS lebih dari angka ini untuk lulus & mendapat sertifikat.
export const PASS_SCORE = 85;

export function computeScore(correctCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}

// Lulus bila nilai lebih dari 85 (mis. 86, 88, 100).
export function isPassed(score: number): boolean {
  return score > PASS_SCORE;
}

// Buat nomor sertifikat unik & rapi, mis. CERT-DASAR-2026-A1B2C3
export function makeCertNumber(courseSlug: string, seed: string, year: number): string {
  const code = courseSlug.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "KELAS";
  const rand = seed.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `CERT-${code}-${year}-${rand}`;
}

export interface ExamQuestionRow {
  id: string;
  courseId: string;
  question: string;
  options: string; // JSON
  correctIndex: number;
  sortOrder: number;
  createdAt: string;
}

export interface ExamAttemptRow {
  id: string;
  userId: string;
  courseId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  certNumber: string | null;
  answers: string;
  createdAt: string;
}
