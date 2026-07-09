-- ============================================================
-- Tambah kolom Pengaturan Desain Sertifikat ke SiteSettings
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- Aman diulang (IF NOT EXISTS).
-- ============================================================

ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "certInstitution"    text NOT NULL DEFAULT 'AdSimulator Academy',
  ADD COLUMN IF NOT EXISTS "certSignatory"      text NOT NULL DEFAULT 'AdSimulator Academy',
  ADD COLUMN IF NOT EXISTS "certSignatoryTitle" text NOT NULL DEFAULT 'Penyelenggara',
  ADD COLUMN IF NOT EXISTS "certLogoUrl"        text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "certAccent"         text NOT NULL DEFAULT '#0866FF';

NOTIFY pgrst, 'reload schema';
