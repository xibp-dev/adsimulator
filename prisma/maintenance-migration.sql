-- Migration: Tambah kolom lmsMaintenance ke tabel SiteSettings
ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "lmsMaintenance" BOOLEAN NOT NULL DEFAULT false;

-- Reload schema PostgREST
NOTIFY pgrst, 'reload schema';
