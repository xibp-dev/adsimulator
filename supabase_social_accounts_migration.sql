-- Migration: Add SocialAccount table
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Terkoneksi',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SocialAccount_userId_idx" ON "SocialAccount"("userId");
