-- ============================================================
-- Tambah kolom Google Tag Manager ke SiteSettings
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- Aman diulang (IF NOT EXISTS).
-- ============================================================

ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "gtmContainerId" text NOT NULL DEFAULT '';

-- Muat ulang schema cache PostgREST
NOTIFY pgrst, 'reload schema';
