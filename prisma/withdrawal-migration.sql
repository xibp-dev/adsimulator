-- ============================================================
-- Tabel Withdrawal: Pencairan Komisi Afiliasi
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run.
-- ============================================================

-- Buat tabel Withdrawal
CREATE TABLE IF NOT EXISTS "Withdrawal" (
  "id"          text PRIMARY KEY,
  "userId"      text NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "amount"      double precision NOT NULL,
  "bankName"    text NOT NULL,
  "accountName" text NOT NULL,
  "accountNo"   text NOT NULL,
  "status"      text NOT NULL DEFAULT 'PENDING',
  "note"        text NOT NULL DEFAULT '',
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz NOT NULL DEFAULT now()
);

-- Index agar query per user cepat
CREATE INDEX IF NOT EXISTS "Withdrawal_userId_idx" ON "Withdrawal" ("userId");
CREATE INDEX IF NOT EXISTS "Withdrawal_status_idx"  ON "Withdrawal" ("status");

-- Nonaktifkan RLS dan beri akses penuh ke service_role
ALTER TABLE "Withdrawal" DISABLE ROW LEVEL SECURITY;
GRANT ALL ON "Withdrawal" TO anon, authenticated, service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
