-- Migration: Tambah kolom qrisString ke tabel SiteSettings
-- Jalankan query ini di Supabase SQL Editor
-- Dashboard Supabase → SQL Editor → New query → paste → Run

ALTER TABLE "SiteSettings"
ADD COLUMN IF NOT EXISTS "qrisString" TEXT DEFAULT '';
