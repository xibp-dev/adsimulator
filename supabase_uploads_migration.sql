-- Migration: Tambah kolom logoUrl, faviconUrl, dan qrisImageUrl ke tabel SiteSettings
-- Jalankan query ini di Supabase SQL Editor
-- Dashboard Supabase → SQL Editor → New query → paste → Run

ALTER TABLE "SiteSettings"
ADD COLUMN IF NOT EXISTS "logoUrl" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "qrisImageUrl" TEXT DEFAULT '';
