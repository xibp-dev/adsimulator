-- ============================================================
-- Migrasi LMS Berbayar untuk AdSimulator / MetaLabs
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → New query → Run.
-- Aman dijalankan ulang (IF NOT EXISTS). Simulator iklan tidak terpengaruh.
-- ============================================================

-- 1. Langganan (subscription) --------------------------------
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"          text PRIMARY KEY,
  "userId"      text NOT NULL,
  "planSlug"    text NOT NULL,
  "planName"    text NOT NULL,
  "amount"      double precision NOT NULL DEFAULT 0,
  "period"      text NOT NULL DEFAULT 'MONTHLY',      -- MONTHLY | YEARLY
  "durationDays" integer NOT NULL DEFAULT 30,
  "status"      text NOT NULL DEFAULT 'PENDING',      -- PENDING | ACTIVE | EXPIRED | REJECTED
  "qrisString"  text NOT NULL DEFAULT '',
  "note"        text NOT NULL DEFAULT '',
  "startedAt"   timestamptz,
  "expiresAt"   timestamptz,
  "approvedBy"  text,
  "approvedAt"  timestamptz,
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription" ("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription" ("status");

-- 2. Kelas / Kursus (course) ---------------------------------
CREATE TABLE IF NOT EXISTS "Course" (
  "id"            text PRIMARY KEY,
  "slug"          text NOT NULL UNIQUE,
  "title"         text NOT NULL,
  "description"   text NOT NULL DEFAULT '',
  "level"         text NOT NULL DEFAULT 'Pemula',     -- Pemula | Menengah | Lanjutan
  "category"      text NOT NULL DEFAULT 'Meta Ads',
  "thumbnailEmoji" text NOT NULL DEFAULT '📘',
  "accent"        text NOT NULL DEFAULT 'blue',
  "isFree"        boolean NOT NULL DEFAULT false,     -- true = bisa diakses tanpa langganan (teaser)
  "sortOrder"     integer NOT NULL DEFAULT 0,
  "published"     boolean NOT NULL DEFAULT true,
  "createdAt"     timestamptz NOT NULL DEFAULT now()
);

-- 3. Pelajaran (lesson) --------------------------------------
CREATE TABLE IF NOT EXISTS "Lesson" (
  "id"          text PRIMARY KEY,
  "courseId"    text NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "section"     text NOT NULL DEFAULT 'Umum',
  "title"       text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "videoUrl"    text NOT NULL DEFAULT '',
  "durationMin" integer NOT NULL DEFAULT 5,
  "content"     text NOT NULL DEFAULT '',
  "isPreview"   boolean NOT NULL DEFAULT false,       -- true = bisa ditonton tanpa langganan
  "sortOrder"   integer NOT NULL DEFAULT 0,
  "createdAt"   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Lesson_courseId_idx" ON "Lesson" ("courseId");

-- 4. Nonaktifkan RLS + grant (samakan dengan tabel lain di project) ---
ALTER TABLE "Subscription" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Course"       DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson"       DISABLE ROW LEVEL SECURITY;

GRANT ALL ON "Subscription", "Course", "Lesson" TO anon, authenticated, service_role;

-- 5. Muat ulang schema cache PostgREST agar tabel langsung dikenali REST/supabase-js
NOTIFY pgrst, 'reload schema';
