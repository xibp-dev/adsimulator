// Seed 800 user dummy + AdAccount, sebagian berlangganan bulanan/tahunan.
// Jalankan: node --env-file=.env seed-dummy.mjs
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import ws from "ws";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: ws } });

const TOTAL = 800;
// Distribusi langganan: 200 bulanan aktif, 120 tahunan aktif,
// 40 expired, 20 pending — sisanya user gratis.
const N_MONTHLY = 200;
const N_YEARLY = 120;
const N_EXPIRED = 40;
const N_PENDING = 20;

const FIRST = ["Adi","Agus","Andi","Ayu","Bagus","Bella","Budi","Citra","Dedi","Dewi","Dian","Dimas","Eka","Endah","Fajar","Fitri","Galih","Hana","Hendra","Ika","Indra","Intan","Joko","Kartika","Lestari","Lina","Made","Maya","Mega","Nanda","Nia","Novi","Putra","Putri","Rahmat","Ratna","Reza","Rina","Rizky","Sari","Siti","Sri","Taufik","Tri","Wahyu","Widya","Yoga","Yuli","Yusuf","Zahra"];
const LAST = ["Pratama","Saputra","Wijaya","Kusuma","Santoso","Hidayat","Nugroho","Setiawan","Rahayu","Utami","Permata","Anggraini","Susanto","Maulana","Firmansyah","Ramadhan","Siregar","Nasution","Hakim","Putri","Lestari","Wibowo","Hartono","Gunawan","Purnama","Suryani","Halim","Iskandar","Fauzi","Sihombing"];

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const daysAgo = (d) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

async function insertChunks(table, rows, size = 200) {
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await supabase.from(table).insert(rows.slice(i, i + size));
    if (error) {
      console.error(`Insert ${table} gagal (batch ${i / size + 1}):`, error.message);
      process.exit(1);
    }
    console.log(`  ${table}: ${Math.min(i + size, rows.length)}/${rows.length}`);
  }
}

async function seed() {
  const passwordHash = await bcrypt.hash("dummy12345", 10);
  const stamp = Date.now().toString(36);

  const users = [];
  const accounts = [];
  const subs = [];

  for (let i = 0; i < TOTAL; i++) {
    const first = pick(FIRST);
    const last = pick(LAST);
    const name = `${first} ${last}`;
    const userId = randomUUID();
    const createdDaysAgo = 1 + rand(365);
    const createdAt = daysAgo(createdDaysAgo);
    const lastLoginAt = daysAgo(rand(Math.min(createdDaysAgo, 30)));

    users.push({
      id: userId,
      name,
      email: `${first}.${last}.${stamp}${i}@dummy.adsimulator.web.id`.toLowerCase(),
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      createdAt: createdAt.toISOString(),
      lastLoginAt: lastLoginAt.toISOString(),
    });

    accounts.push({
      id: randomUUID(),
      userId,
      name: `Ad Account ${first}`,
      currency: "IDR",
      balance: (5 + rand(96)) * 50000, // 250rb – 5jt
      createdAt: createdAt.toISOString(),
    });

    // Tentukan langganan berdasarkan urutan indeks
    let plan = null, status = null;
    if (i < N_MONTHLY) {
      plan = "MONTHLY"; status = "ACTIVE";
    } else if (i < N_MONTHLY + N_YEARLY) {
      plan = "YEARLY"; status = "ACTIVE";
    } else if (i < N_MONTHLY + N_YEARLY + N_EXPIRED) {
      plan = rand(2) ? "MONTHLY" : "YEARLY"; status = "EXPIRED";
    } else if (i < N_MONTHLY + N_YEARLY + N_EXPIRED + N_PENDING) {
      plan = rand(2) ? "MONTHLY" : "YEARLY"; status = "PENDING";
    }
    if (!plan) continue;

    const monthly = plan === "MONTHLY";
    const durationDays = monthly ? 30 : 365;
    const now = new Date().toISOString();

    let startedAt = null, expiresAt = null;
    if (status === "ACTIVE") {
      // Mulai acak dalam periode berjalan → masih aktif
      const started = daysAgo(rand(durationDays - 1));
      startedAt = started.toISOString();
      expiresAt = new Date(started.getTime() + durationDays * 864e5).toISOString();
    } else if (status === "EXPIRED") {
      const started = daysAgo(durationDays + 10 + rand(180));
      startedAt = started.toISOString();
      expiresAt = new Date(started.getTime() + durationDays * 864e5).toISOString();
    }

    subs.push({
      id: randomUUID(),
      userId,
      planSlug: monthly ? "bulanan" : "tahunan",
      planName: monthly ? "Kelas Premium — Bulanan" : "Kelas Premium — Tahunan",
      amount: monthly ? 49000 : 399000,
      period: plan,
      durationDays,
      status,
      qrisString: "",
      note: "seed dummy",
      startedAt,
      expiresAt,
      approvedBy: status === "PENDING" ? null : "admin",
      approvedAt: status === "PENDING" ? null : startedAt,
      createdAt: startedAt ?? now,
      updatedAt: now,
    });
  }

  console.log(`Menyisipkan ${users.length} user…`);
  await insertChunks("User", users);
  console.log(`Menyisipkan ${accounts.length} ad account…`);
  await insertChunks("AdAccount", accounts);
  console.log(`Menyisipkan ${subs.length} langganan…`);
  await insertChunks("Subscription", subs);

  console.log("\n✅ Selesai:");
  console.log(`  ${users.length} user dummy (password: dummy12345)`);
  console.log(`  ${N_MONTHLY} langganan bulanan aktif, ${N_YEARLY} tahunan aktif`);
  console.log(`  ${N_EXPIRED} expired, ${N_PENDING} pending`);
}

seed();
