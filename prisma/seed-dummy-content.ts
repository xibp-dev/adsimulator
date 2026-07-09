import * as fs from "fs";
import * as path from "path";

// Load .env manual
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

const ws = require("ws");
(globalThis as any).WebSocket = (globalThis as any).WebSocket || ws;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Berapa banyak akun (dari user dummy) yang diberi campaign
const ACCOUNTS_WITH_CONTENT = 600;
const METRIC_DAYS = 7;

const objectives = ["AWARENESS", "TRAFFIC", "ENGAGEMENT", "LEADS", "SALES", "APP_PROMOTION"];
const campaignStatuses = ["ACTIVE", "ACTIVE", "ACTIVE", "PAUSED", "DRAFT"];
const adStatuses = ["ACTIVE", "ACTIVE", "ACTIVE", "PAUSED", "IN_REVIEW"];
const budgetTypes = ["DAILY", "LIFETIME"];
const perfGoals = ["MAXIMIZE_REACH", "MAXIMIZE_LINK_CLICKS", "MAXIMIZE_CONVERSIONS", "MAXIMIZE_ENGAGEMENT"];
const ctas = ["SHOP_NOW", "LEARN_MORE", "SIGN_UP", "GET_OFFER", "WHATSAPP_MESSAGE", "BOOK_NOW", "CONTACT_US", "SEND_MESSAGE"];
const formats = ["SINGLE_IMAGE_VIDEO", "CAROUSEL", "COLLECTION"];

const brands = ["Kopi Nusantara", "Batik Lestari", "Skincare Glow", "Hijab Modis", "Toko Gadget", "Fashion Kekinian", "Kue Rumahan", "Herbal Sehat", "Sepatu Lokal", "Furniture Minimalis", "Parfum Aroma", "Snack Pedas", "Madu Asli", "Tas Kulit", "Vitamin Prima"];
const campaignThemes = ["Promo Ramadhan", "Flash Sale 12.12", "Diskon Gajian", "Brand Awareness", "Traffic Toko Online", "Lead Gen Webinar", "Promo Akhir Tahun", "Grand Opening", "Cuci Gudang", "Bundling Hemat", "Giveaway Spesial", "Launching Produk Baru", "Promo Weekend", "Harbolnas", "Back to School"];
const quarters = ["Q1 2026", "Q2 2026", "Q3 2026", "Juni", "Juli", "Agustus", "Lebaran", "2026"];

const cities = ["Indonesia", "Jakarta", "Bandung", "Surabaya", "Medan", "Semarang", "Yogyakarta", "Makassar", "Bali", "Bekasi"];
const interests = ["Online Shopping", "E-commerce", "Fashion", "Kuliner", "Kecantikan", "Teknologi", "Traveling", "Olahraga", "Parenting", "Otomotif", "Gaya Hidup Sehat", "Fotografi"];

const primaryTexts = [
  "Dapatkan penawaran spesial hari ini! Stok terbatas, jangan sampai kehabisan 🔥",
  "Produk terlaris kami kembali dengan harga promo. Buruan checkout sekarang!",
  "Kualitas premium harga bersahabat. Cocok untuk kebutuhan harian Anda.",
  "Gratis ongkir se-Indonesia untuk pembelian hari ini. Yuk belanja sekarang!",
  "Sudah dipercaya ribuan pelanggan. Saatnya Anda merasakan bedanya!",
  "Promo terbatas! Diskon hingga 50% khusus untuk kamu yang beruntung.",
  "Solusi terbaik untuk kebutuhan Anda. Pesan sekarang, kirim hari ini juga.",
  "Bikin harimu lebih mudah dengan produk pilihan kami. Order via WhatsApp!",
];
const headlines = ["Diskon Spesial Hari Ini", "Promo Terbatas", "Kualitas Terjamin", "Gratis Ongkir", "Best Seller 2026", "Penawaran Eksklusif", "Harga Termurah", "Produk Pilihan"];
const descriptions = ["Kualitas terjamin, harga terjangkau", "Terbatas untuk hari ini saja", "Dipercaya ribuan pelanggan", "Pesan sekarang juga", "Gratis ongkir seluruh Indonesia", "Cashback menarik menanti"];

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function cuid(prefix: string): string { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`; }

async function insertChunked(table: string, rows: any[]) {
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await supabase.from(table).insert(rows.slice(i, i + chunk));
    if (error) { console.error(`Gagal insert ${table}:`, error); process.exit(1); }
    console.log(`  ${table} ${Math.min(i + chunk, rows.length)}/${rows.length}`);
  }
}

function makeMetric(entityType: string, entityId: string, date: Date) {
  const reach = randInt(800, 20000);
  const impressions = Math.floor(reach * (1.2 + Math.random() * 0.6));
  const results = Math.floor(reach * (0.015 + Math.random() * 0.04));
  const amountSpent = randInt(50000, 500000);
  return {
    id: cuid("sm"),
    entityType, entityId,
    reach, impressions, results,
    costPerResult: results > 0 ? Math.floor(amountSpent / results) : 0,
    amountSpent,
    ctr: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
    cpm: Math.floor(amountSpent / (impressions / 1000)),
    frequency: parseFloat((impressions / reach).toFixed(2)),
    date: date.toISOString(),
  };
}

async function main() {
  console.log("Mengambil akun iklan user dummy...");
  // Ambil akun milik user dummy (id diawali 'acc_')
  const accounts: { id: string }[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from("AdAccount").select("id").like("id", "acc_%")
      .range(from, from + pageSize - 1);
    if (error) { console.error(error); process.exit(1); }
    if (!data || data.length === 0) break;
    accounts.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  console.log(`Ditemukan ${accounts.length} akun. Memberi konten ke ${Math.min(ACCOUNTS_WITH_CONTENT, accounts.length)} akun.`);

  // Acak & ambil subset
  for (let i = accounts.length - 1; i > 0; i--) { const j = randInt(0, i); [accounts[i], accounts[j]] = [accounts[j], accounts[i]]; }
  const chosen = accounts.slice(0, ACCOUNTS_WITH_CONTENT);

  const campaigns: any[] = [];
  const adSets: any[] = [];
  const ads: any[] = [];
  const metrics: any[] = [];
  const now = Date.now();

  for (const acc of chosen) {
    const nCampaigns = randInt(1, 4);
    for (let c = 0; c < nCampaigns; c++) {
      const createdAt = new Date(now - randInt(1, 120) * 86400000);
      const objective = pick(objectives);
      const cboEnabled = Math.random() < 0.4;
      const budgetType = pick(budgetTypes);
      const status = pick(campaignStatuses);
      const campId = cuid("cmp");
      campaigns.push({
        id: campId, adAccountId: acc.id,
        name: `${pick(campaignThemes)} - ${pick(brands)} ${pick(quarters)}`,
        objective, buyingType: "AUCTION", status,
        specialAdCategories: "[]", cboEnabled,
        budgetType, budgetAmount: budgetType === "DAILY" ? randInt(1, 10) * 50000 : randInt(10, 60) * 100000,
        createdAt: createdAt.toISOString(), updatedAt: createdAt.toISOString(),
      });

      const nAdSets = randInt(1, 2);
      for (let s = 0; s < nAdSets; s++) {
        const setId = cuid("set");
        const ageMin = pick([18, 18, 21, 25]);
        adSets.push({
          id: setId, campaignId: campId,
          name: `${pick(cities)} - ${pick(["Semua Gender", "Wanita", "Pria"])} ${ageMin}-${randInt(40, 60)}`,
          performanceGoal: pick(perfGoals), conversionLocation: "WEBSITE",
          budgetType, budgetAmount: budgetType === "DAILY" ? randInt(1, 6) * 50000 : randInt(5, 30) * 100000,
          scheduleStart: createdAt.toISOString(),
          advantageAudienceOn: Math.random() < 0.6,
          locations: JSON.stringify([pick(cities)]),
          ageMin, ageMax: randInt(40, 60),
          genders: JSON.stringify(Math.random() < 0.5 ? [] : [pick(["MALE", "FEMALE"])]),
          detailedTargeting: JSON.stringify([pick(interests), pick(interests)]),
          languages: "[]",
          advantagePlacementsOn: Math.random() < 0.7,
          manualPlacements: "[]",
          status: pick(["ACTIVE", "ACTIVE", "PAUSED"]),
          createdAt: createdAt.toISOString(), updatedAt: createdAt.toISOString(),
        });

        const nAds = randInt(1, 2);
        for (let a = 0; a < nAds; a++) {
          const adId = cuid("ad");
          const brand = pick(brands);
          ads.push({
            id: adId, adSetId: setId,
            name: `Iklan ${pick(["Feed", "Story", "Reels", "Carousel"])} - ${brand}`,
            identityPage: brand,
            identityInstagram: `@${brand.toLowerCase().replace(/\s+/g, "")}.id`,
            format: pick(formats),
            primaryText: pick(primaryTexts),
            headline: pick(headlines),
            description: pick(descriptions),
            mediaUrls: "[]",
            cta: pick(ctas),
            destinationUrl: `https://${brand.toLowerCase().replace(/\s+/g, "")}.id`,
            status: pick(adStatuses),
            createdAt: createdAt.toISOString(), updatedAt: createdAt.toISOString(),
          });
          // metrik untuk ad
          for (let d = METRIC_DAYS - 1; d >= 0; d--) metrics.push(makeMetric("ad", adId, new Date(now - d * 86400000)));
        }
        // metrik untuk adset
        for (let d = METRIC_DAYS - 1; d >= 0; d--) metrics.push(makeMetric("adset", setId, new Date(now - d * 86400000)));
      }
      // metrik untuk campaign
      for (let d = METRIC_DAYS - 1; d >= 0; d--) metrics.push(makeMetric("campaign", campId, new Date(now - d * 86400000)));
    }
  }

  console.log(`Akan dibuat: ${campaigns.length} campaign, ${adSets.length} ad set, ${ads.length} ad, ${metrics.length} baris metrik.`);
  await insertChunked("Campaign", campaigns);
  await insertChunked("AdSet", adSets);
  await insertChunked("Ad", ads);
  await insertChunked("SimMetrics", metrics);

  console.log("✅ Konten dummy selesai dibuat!");
}

main().catch((e) => { console.error(e); process.exit(1); });
