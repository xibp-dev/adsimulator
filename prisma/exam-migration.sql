-- ============================================================
-- Migrasi Fitur Ujian + Sertifikat untuk LMS AdSimulator
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- Aman diulang (IF NOT EXISTS).
-- ============================================================

-- Bank soal ujian per kelas
CREATE TABLE IF NOT EXISTS "ExamQuestion" (
  "id"           text PRIMARY KEY,
  "courseId"     text NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "question"     text NOT NULL,
  "options"      text NOT NULL DEFAULT '[]',   -- JSON array pilihan jawaban
  "correctIndex" integer NOT NULL DEFAULT 0,    -- index jawaban benar (0-based)
  "sortOrder"    integer NOT NULL DEFAULT 0,
  "createdAt"    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "ExamQuestion_courseId_idx" ON "ExamQuestion" ("courseId");

-- Riwayat percobaan ujian (sekaligus sumber data sertifikat)
CREATE TABLE IF NOT EXISTS "ExamAttempt" (
  "id"           text PRIMARY KEY,
  "userId"       text NOT NULL,
  "courseId"     text NOT NULL,
  "score"        integer NOT NULL DEFAULT 0,    -- nilai 0-100
  "correctCount" integer NOT NULL DEFAULT 0,
  "totalCount"   integer NOT NULL DEFAULT 0,
  "passed"       boolean NOT NULL DEFAULT false,
  "certNumber"   text,                          -- nomor sertifikat (bila lulus)
  "answers"      text NOT NULL DEFAULT '[]',    -- JSON array index jawaban user
  "createdAt"    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "ExamAttempt_user_course_idx" ON "ExamAttempt" ("userId", "courseId");

ALTER TABLE "ExamQuestion" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ExamAttempt"  DISABLE ROW LEVEL SECURITY;
GRANT ALL ON "ExamQuestion", "ExamAttempt" TO anon, authenticated, service_role;

-- Muat ulang schema cache PostgREST
NOTIFY pgrst, 'reload schema';
