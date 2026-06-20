-- Migration: Add LandingPage table
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pixelCode" TEXT NOT NULL DEFAULT '',
    "template" TEXT NOT NULL DEFAULT 'ecommerce',
    "title" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL DEFAULT '0',
    "ctaText" TEXT NOT NULL,
    "buttonEvent" TEXT NOT NULL DEFAULT 'Purchase',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "trackingRules" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LandingPage_userId_idx" ON "LandingPage"("userId");
