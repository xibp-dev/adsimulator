// 1) Hapus 800 user dummy hasil seed sebelumnya (email @dummy.adsimulator.web.id)
// 2) Pasang langganan bulanan/tahunan ke USER ASLI yang belum punya langganan.
// Jalankan: node --env-file=.env seed-subs-existing.mjs
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import ws from "ws";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: ws } });

const N_MONTHLY = 200;
const N_YEARLY = 120;
const N_EXPIRED = 40;
const N_PENDING = 20;
const TOTAL_SUBS = N_MONTHLY + N_YEARLY + N_EXPIRED + N_PENDING;

const DUMMY_SUFFIX = "@dummy.adsimulator.web.id";
const rand = (n) => Math.floor(Math.random() * n);
const daysAgo = (d) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

async function cleanupDummyUsers() {
  const { data: dummies, error } = await supabase
    .from("User")
    .select("id")
    .like("email", `%${DUMMY_SUFFIX}`);
  if (error) throw new Error("Gagal ambil user dummy: " + error.message);
  const ids = (dummies ?? []).map((u) => u.id);
  if (ids.length === 0) {
    console.log("Tidak ada user dummy untuk dihapus.");
    return;
  }
  console.log(`Menghapus ${ids.length} user dummy…`);
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    let r = await supabase.from("Subscription").delete().in("userId", chunk);
    if (r.error) throw new Error("Hapus Subscription: " + r.error.message);
    r = await supabase.from("AdAccount").delete().in("userId", chunk);
    if (r.error) throw new Error("Hapus AdAccount: " + r.error.message);
    r = await supabase.from("User").delete().in("id", chunk);
    if (r.error) throw new Error("Hapus User: " + r.error.message);
    console.log(`  dihapus ${Math.min(i + 200, ids.length)}/${ids.length}`);
  }
}

async function seedSubsForExisting() {
  // User asli (bukan admin, bukan dummy) yang BELUM punya langganan
  const [{ data: users, error: uErr }, { data: existing, error: sErr }] = await Promise.all([
    supabase.from("User").select("id, createdAt").eq("role", "USER").not("email", "like", `%${DUMMY_SUFFIX}`),
    supabase.from("Subscription").select("userId"),
  ]);
  if (uErr) throw new Error("Gagal ambil user: " + uErr.message);
  if (sErr) throw new Error("Gagal ambil langganan: " + sErr.message);

  const hasSub = new Set((existing ?? []).map((s) => s.userId));
  const candidates = (users ?? []).filter((u) => !hasSub.has(u.id));
  // Acak urutan agar langganan tersebar merata
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const targets = candidates.slice(0, TOTAL_SUBS);
  if (targets.length < TOTAL_SUBS) {
    console.warn(`Hanya ${targets.length} user tersedia tanpa langganan (target ${TOTAL_SUBS}).`);
  }

  const now = new Date().toISOString();
  const subs = targets.map((u, i) => {
    let plan, status;
    if (i < N_MONTHLY) { plan = "MONTHLY"; status = "ACTIVE"; }
    else if (i < N_MONTHLY + N_YEARLY) { plan = "YEARLY"; status = "ACTIVE"; }
    else if (i < N_MONTHLY + N_YEARLY + N_EXPIRED) { plan = rand(2) ? "MONTHLY" : "YEARLY"; status = "EXPIRED"; }
    else { plan = rand(2) ? "MONTHLY" : "YEARLY"; status = "PENDING"; }

    const monthly = plan === "MONTHLY";
    const durationDays = monthly ? 30 : 365;
    // Jangan mulai sebelum user terdaftar
    const signupAgeDays = Math.max(1, Math.floor((Date.now() - new Date(u.createdAt).getTime()) / 864e5));

    let startedAt = null, expiresAt = null;
    if (status === "ACTIVE") {
      const started = daysAgo(rand(Math.min(durationDays - 1, signupAgeDays)));
      startedAt = started.toISOString();
      expiresAt = new Date(started.getTime() + durationDays * 864e5).toISOString();
    } else if (status === "EXPIRED") {
      const maxBack = Math.max(durationDays + 1, Math.min(durationDays + 180, signupAgeDays));
      const started = daysAgo(maxBack);
      startedAt = started.toISOString();
      expiresAt = new Date(started.getTime() + durationDays * 864e5).toISOString();
    }

    return {
      id: randomUUID(),
      userId: u.id,
      planSlug: monthly ? "bulanan" : "tahunan",
      planName: monthly ? "Kelas Premium — Bulanan" : "Kelas Premium — Tahunan",
      amount: monthly ? 49000 : 399000,
      period: plan,
      durationDays,
      status,
      qrisString: "",
      note: "seed demo",
      startedAt,
      expiresAt,
      approvedBy: status === "PENDING" ? null : "admin",
      approvedAt: status === "PENDING" ? null : startedAt,
      createdAt: startedAt ?? now,
      updatedAt: now,
    };
  });

  console.log(`Menyisipkan ${subs.length} langganan untuk user yang sudah ada…`);
  for (let i = 0; i < subs.length; i += 200) {
    const { error } = await supabase.from("Subscription").insert(subs.slice(i, i + 200));
    if (error) throw new Error("Insert Subscription: " + error.message);
    console.log(`  Subscription: ${Math.min(i + 200, subs.length)}/${subs.length}`);
  }
  return subs.length;
}

try {
  await cleanupDummyUsers();
  const n = await seedSubsForExisting();
  console.log(`\n✅ Selesai: ${n} langganan dipasang ke user yang sudah ada`);
  console.log(`   ${N_MONTHLY} bulanan aktif, ${N_YEARLY} tahunan aktif, ${N_EXPIRED} expired, ${N_PENDING} pending`);
} catch (e) {
  console.error("❌", e.message);
  process.exit(1);
}
