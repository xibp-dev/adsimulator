-- ============================================================
-- Fitur Afiliasi & Komisi 20%
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- ============================================================

-- Tambah kolom referredById di tabel User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "referredById" text REFERENCES "User"("id") ON DELETE SET NULL;

-- Tambah kolom referralCode (kode pendek unik, contoh: X4K9MN)
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "referralCode" text UNIQUE;

-- Buat index referralCode agar pencarian cepat
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User" ("referralCode");

-- Generate referralCode untuk semua user yang belum punya
DO $$
DECLARE
  u RECORD;
  new_code TEXT;
BEGIN
  FOR u IN SELECT id FROM "User" WHERE "referralCode" IS NULL LOOP
    LOOP
      -- Generate 6-karakter alfanumerik acak (huruf kapital + angka)
      new_code := upper(substring(replace(encode(gen_random_bytes(6), 'base64'), '/', ''), 1, 6));
      -- Pastikan unik
      EXIT WHEN NOT EXISTS (SELECT 1 FROM "User" WHERE "referralCode" = new_code);
    END LOOP;
    UPDATE "User" SET "referralCode" = new_code WHERE id = u.id;
  END LOOP;
END $$;

-- Buat tabel AffiliateCommission
CREATE TABLE IF NOT EXISTS "AffiliateCommission" (
  "id"             text PRIMARY KEY,
  "referrerId"     text NOT NULL,
  "referredUserId" text NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "subscriptionId" text NOT NULL,
  "amount"         double precision NOT NULL,
  "status"         text NOT NULL DEFAULT 'APPROVED',
  "createdAt"      timestamptz NOT NULL DEFAULT now(),
  "updatedAt"      timestamptz NOT NULL DEFAULT now()
);

-- Buat index
CREATE INDEX IF NOT EXISTS "AffiliateCommission_referrerId_idx" ON "AffiliateCommission" ("referrerId");
CREATE INDEX IF NOT EXISTS "AffiliateCommission_referredUserId_idx" ON "AffiliateCommission" ("referredUserId");

-- Disable RLS dan Grant
ALTER TABLE "AffiliateCommission" DISABLE ROW LEVEL SECURITY;
GRANT ALL ON "AffiliateCommission" TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

