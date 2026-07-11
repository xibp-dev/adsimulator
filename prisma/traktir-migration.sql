-- ============================================================
-- Tambah toggle tampil/sembunyi fitur Traktir Kopi
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- ============================================================

ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "traktirEnabled" boolean NOT NULL DEFAULT true;

NOTIFY pgrst, 'reload schema';
