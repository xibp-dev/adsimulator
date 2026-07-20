-- ============================================================
-- Program Level: Tambah tabel Program & hubungkan ke Course
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- ============================================================

-- 1. Buat tabel Program
CREATE TABLE IF NOT EXISTS "Program" (
  "id"             text PRIMARY KEY,
  "slug"           text NOT NULL UNIQUE,
  "title"          text NOT NULL,
  "description"    text NOT NULL DEFAULT '',
  "thumbnailEmoji" text NOT NULL DEFAULT '📊',
  "accent"         text NOT NULL DEFAULT 'blue',
  "isFree"         boolean NOT NULL DEFAULT false,
  "published"      boolean NOT NULL DEFAULT true,
  "sortOrder"      int NOT NULL DEFAULT 0,
  "createdAt"      timestamptz NOT NULL DEFAULT now(),
  "updatedAt"      timestamptz NOT NULL DEFAULT now()
);

-- 2. Tambah kolom programId ke Course
ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "programId" text REFERENCES "Program"("id") ON DELETE SET NULL;

-- 3. Insert program default: Meta Ads Premium
INSERT INTO "Program" ("id", "slug", "title", "description", "thumbnailEmoji", "accent", "isFree", "published", "sortOrder", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'meta-ads-premium',
  'Meta Ads Premium',
  'Belajar Meta Ads dari pemula hingga mahir — kurikulum lengkap mulai dari dasar hingga strategi lanjutan untuk menjalankan iklan Facebook & Instagram yang efektif.',
  '📊',
  'blue',
  false,
  true,
  1,
  now(),
  now()
)
ON CONFLICT ("slug") DO NOTHING;

-- 4. Assign semua Course yang ada ke program Meta Ads Premium
UPDATE "Course"
SET "programId" = (SELECT "id" FROM "Program" WHERE "slug" = 'meta-ads-premium' LIMIT 1)
WHERE "programId" IS NULL;

-- 5. Index
CREATE INDEX IF NOT EXISTS "Program_slug_idx" ON "Program" ("slug");
CREATE INDEX IF NOT EXISTS "Course_programId_idx" ON "Course" ("programId");

-- 6. Disable RLS & grant
ALTER TABLE "Program" DISABLE ROW LEVEL SECURITY;
GRANT ALL ON "Program" TO anon, authenticated, service_role;

-- Reload schema
NOTIFY pgrst, 'reload schema';
