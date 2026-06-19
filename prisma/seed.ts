import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@AdSimulator.id" },
    update: {},
    create: {
      name: "Admin AdSimulator",
      email: "admin@AdSimulator.id",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      adAccount: { create: { name: "Admin Ad Account", balance: 99999999 } },
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "budi@example.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "budi@example.com",
      passwordHash: await bcrypt.hash("user123", 10),
      adAccount: { create: { name: "Budi's Ad Account", balance: 5000000 } },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "sari@example.com" },
    update: {},
    create: {
      name: "Sari Dewi",
      email: "sari@example.com",
      passwordHash: await bcrypt.hash("user123", 10),
      adAccount: { create: { name: "Sari's Ad Account", balance: 3000000 } },
    },
  });

  await prisma.user.upsert({
    where: { email: "andi@example.com" },
    update: {},
    create: {
      name: "Andi Pratama",
      email: "andi@example.com",
      passwordHash: await bcrypt.hash("user123", 10),
      adAccount: { create: { name: "Andi's Ad Account", balance: 2500000 } },
    },
  });

  const user1Account = await prisma.adAccount.findUnique({ where: { userId: user1.id } });
  const user2Account = await prisma.adAccount.findUnique({ where: { userId: user2.id } });
  if (!user1Account || !user2Account) throw new Error("AdAccount not found");

  const campaign1 = await prisma.campaign.create({
    data: {
      adAccountId: user1Account.id,
      name: "Brand Awareness Q2 2025",
      objective: "AWARENESS",
      status: "ACTIVE",
      cboEnabled: true,
      budgetType: "DAILY",
      budgetAmount: 200000,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      adAccountId: user1Account.id,
      name: "Website Traffic - Promo Lebaran",
      objective: "TRAFFIC",
      status: "ACTIVE",
      cboEnabled: false,
      budgetType: "LIFETIME",
      budgetAmount: 1500000,
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      adAccountId: user1Account.id,
      name: "Lead Gen - Webinar Juni",
      objective: "LEADS",
      status: "PAUSED",
      cboEnabled: false,
      budgetType: "DAILY",
      budgetAmount: 150000,
    },
  });

  const adSet1 = await prisma.adSet.create({
    data: {
      campaignId: campaign1.id,
      name: "Indonesia - All Genders 18-45",
      performanceGoal: "MAXIMIZE_REACH",
      budgetType: "DAILY",
      budgetAmount: 100000,
      ageMin: 18,
      ageMax: 45,
      locations: JSON.stringify(["Indonesia"]),
      status: "ACTIVE",
    },
  });

  const adSet2 = await prisma.adSet.create({
    data: {
      campaignId: campaign1.id,
      name: "Jakarta - Women 25-40",
      performanceGoal: "MAXIMIZE_REACH",
      budgetType: "DAILY",
      budgetAmount: 100000,
      ageMin: 25,
      ageMax: 40,
      locations: JSON.stringify(["Jakarta"]),
      genders: JSON.stringify(["FEMALE"]),
      advantagePlacementsOn: false,
      manualPlacements: JSON.stringify(["facebook_feed", "instagram_feed"]),
      status: "ACTIVE",
    },
  });

  const adSet3 = await prisma.adSet.create({
    data: {
      campaignId: campaign2.id,
      name: "Retargeting Website Visitors",
      performanceGoal: "MAXIMIZE_LINK_CLICKS",
      budgetType: "LIFETIME",
      budgetAmount: 750000,
      ageMin: 22,
      ageMax: 55,
      locations: JSON.stringify(["Indonesia"]),
      detailedTargeting: JSON.stringify(["Online Shopping", "E-commerce"]),
      status: "ACTIVE",
    },
  });

  await prisma.ad.create({
    data: {
      adSetId: adSet1.id,
      name: "Brand Video - Awareness",
      identityPage: "AdSimulator Official",
      identityInstagram: "@AdSimulator.id",
      format: "SINGLE_IMAGE_VIDEO",
      primaryText: "Kenali brand kami dan temukan produk terbaik untuk kebutuhan Anda!",
      headline: "AdSimulator — Inovasi Digital",
      description: "Solusi digital terpercaya untuk bisnis Anda",
      cta: "LEARN_MORE",
      destinationUrl: "https://AdSimulator.id",
      status: "ACTIVE",
    },
  });

  await prisma.ad.create({
    data: {
      adSetId: adSet2.id,
      name: "Instagram Story - Promo",
      identityPage: "AdSimulator Official",
      identityInstagram: "@AdSimulator.id",
      format: "SINGLE_IMAGE_VIDEO",
      primaryText: "Dapatkan penawaran eksklusif hari ini!",
      headline: "Promo Spesial",
      description: "Terbatas untuk hari ini saja",
      cta: "SHOP_NOW",
      destinationUrl: "https://AdSimulator.id/promo",
      status: "ACTIVE",
    },
  });

  await prisma.ad.create({
    data: {
      adSetId: adSet3.id,
      name: "Carousel Product - Traffic",
      identityPage: "AdSimulator Official",
      identityInstagram: "@AdSimulator.id",
      format: "CAROUSEL",
      primaryText: "Lihat koleksi produk terbaru kami!",
      headline: "Produk Pilihan",
      description: "Kualitas terjamin, harga terjangkau",
      cta: "SHOP_NOW",
      destinationUrl: "https://AdSimulator.id/products",
      status: "ACTIVE",
    },
  });

  await prisma.campaign.create({
    data: {
      adAccountId: user2Account.id,
      name: "Engagement - Konten Edukasi",
      objective: "ENGAGEMENT",
      status: "ACTIVE",
      budgetType: "DAILY",
      budgetAmount: 75000,
    },
  });

  // Seed SimMetrics
  const entities = [
    { type: "campaign", id: campaign1.id },
    { type: "campaign", id: campaign2.id },
    { type: "campaign", id: campaign3.id },
    { type: "adset", id: adSet1.id },
    { type: "adset", id: adSet2.id },
    { type: "adset", id: adSet3.id },
  ];

  for (const entity of entities) {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const reach = Math.floor(Math.random() * 5000) + 1000;
      const impressions = Math.floor(reach * (1.2 + Math.random() * 0.5));
      const results = Math.floor(reach * (0.02 + Math.random() * 0.03));
      const amountSpent = Math.floor(Math.random() * 150000) + 50000;
      await prisma.simMetrics.create({
        data: {
          entityType: entity.type,
          entityId: entity.id,
          reach,
          impressions,
          results,
          costPerResult: results > 0 ? Math.floor(amountSpent / results) : 0,
          amountSpent,
          ctr: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
          cpm: Math.floor(amountSpent / (impressions / 1000)),
          frequency: parseFloat((impressions / reach).toFixed(2)),
          date,
        },
      });
    }
  }

  console.log("✅ Seed complete!");
  console.log("Admin: admin@AdSimulator.id / admin123");
  console.log("User1: budi@example.com / user123");
  console.log("User2: sari@example.com / user123");
  console.log("User3: andi@example.com / user123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
