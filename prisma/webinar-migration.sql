-- ============================================================
-- Migrasi Fitur Webinar, Ujian & Sertifikat Webinar
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- ============================================================

-- Tabel Webinar
CREATE TABLE IF NOT EXISTS "Webinar" (
  "id"          text PRIMARY KEY,
  "title"       text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "speaker"     text NOT NULL DEFAULT '',
  "schedule"    timestamptz NOT NULL,
  "meetingLink" text NOT NULL DEFAULT '',
  "examPasscode" text NOT NULL DEFAULT '',
  "published"   boolean NOT NULL DEFAULT true,
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz NOT NULL DEFAULT now()
);

-- Jalankan alter jika tabel Webinar sudah dibuat sebelumnya
ALTER TABLE "Webinar" ADD COLUMN IF NOT EXISTS "examPasscode" text NOT NULL DEFAULT '';


-- Tabel Pertanyaan Ujian Webinar
CREATE TABLE IF NOT EXISTS "WebinarQuestion" (
  "id"           text PRIMARY KEY,
  "webinarId"    text NOT NULL REFERENCES "Webinar"("id") ON DELETE CASCADE,
  "question"     text NOT NULL,
  "options"      text NOT NULL DEFAULT '[]',   -- JSON array pilihan jawaban
  "correctIndex" integer NOT NULL DEFAULT 0,    -- index jawaban benar (0-based)
  "sortOrder"    integer NOT NULL DEFAULT 0,
  "createdAt"    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "WebinarQuestion_webinarId_idx" ON "WebinarQuestion" ("webinarId");

-- Tabel Percobaan Ujian Webinar (dan Klaim Sertifikat)
CREATE TABLE IF NOT EXISTS "WebinarAttempt" (
  "id"           text PRIMARY KEY,
  "userId"       text NOT NULL,
  "webinarId"    text NOT NULL REFERENCES "Webinar"("id") ON DELETE CASCADE,
  "score"        integer NOT NULL DEFAULT 0,    -- nilai 0-100
  "correctCount" integer NOT NULL DEFAULT 0,
  "totalCount"   integer NOT NULL DEFAULT 0,
  "passed"       boolean NOT NULL DEFAULT false,
  "certNumber"   text,                          -- nomor sertifikat (bila lulus)
  "answers"      text NOT NULL DEFAULT '[]',    -- JSON map { questionId: selectedIndex }
  "createdAt"    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "WebinarAttempt_user_webinar_idx" ON "WebinarAttempt" ("userId", "webinarId");

-- Tabel Registrasi Webinar (user mendaftar dulu sebelum bisa lihat link)
CREATE TABLE IF NOT EXISTS "WebinarRegistration" (
  "id"        text PRIMARY KEY,
  "userId"    text NOT NULL,
  "webinarId" text NOT NULL REFERENCES "Webinar"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "WebinarRegistration_user_webinar_unique" UNIQUE ("userId", "webinarId")
);
CREATE INDEX IF NOT EXISTS "WebinarRegistration_webinarId_idx" ON "WebinarRegistration" ("webinarId");
CREATE INDEX IF NOT EXISTS "WebinarRegistration_user_webinar_idx" ON "WebinarRegistration" ("userId", "webinarId");

ALTER TABLE "Webinar"               DISABLE ROW LEVEL SECURITY;
ALTER TABLE "WebinarQuestion"       DISABLE ROW LEVEL SECURITY;
ALTER TABLE "WebinarAttempt"        DISABLE ROW LEVEL SECURITY;
ALTER TABLE "WebinarRegistration"   DISABLE ROW LEVEL SECURITY;

GRANT ALL ON "Webinar", "WebinarQuestion", "WebinarAttempt", "WebinarRegistration" TO anon, authenticated, service_role;

-- Muat ulang schema cache PostgREST agar terdeteksi
NOTIFY pgrst, 'reload schema';
