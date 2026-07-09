import * as fs from "fs";
import * as path from "path";

// Load .env manual
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws = require("ws");
(globalThis as any).WebSocket = (globalThis as any).WebSocket || ws;

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TOTAL = 2000;

const firstNames = [
  "Budi", "Sari", "Andi", "Dewi", "Agus", "Rina", "Eko", "Putri", "Bayu", "Wati",
  "Dedi", "Fitri", "Rizky", "Ayu", "Fajar", "Nurul", "Hendra", "Lestari", "Yoga", "Indah",
  "Arif", "Maya", "Doni", "Rani", "Wahyu", "Siti", "Iwan", "Ratna", "Teguh", "Anisa",
  "Rudi", "Dian", "Surya", "Yuni", "Adi", "Mega", "Gilang", "Tika", "Reza", "Vina",
  "Hadi", "Nadia", "Firman", "Lia", "Bagus", "Wulan", "Ilham", "Citra", "Dimas", "Rahma",
  "Andre", "Novi", "Galih", "Intan", "Fauzi", "Devi", "Aldi", "Sinta", "Rangga", "Yulia",
  "Hafiz", "Kartika", "Bima", "Alya", "Fikri", "Melati", "Yusuf", "Salsa", "Danang", "Winda",
  "Rifqi", "Zahra", "Panca", "Diah", "Aziz", "Tari", "Gita", "Bella", "Naufal", "Sekar",
  "Ridho", "Nabila", "Taufik", "Amel", "Iqbal", "Diana", "Hary", "Rara", "Zaki", "Fara",
  "Angga", "Cinta", "Dodi", "Elsa", "Farhan", "Gina", "Heru", "Ika", "Joko", "Karin",
];

const lastNames = [
  "Santoso", "Pratama", "Wijaya", "Kusuma", "Nugroho", "Saputra", "Hidayat", "Wibowo", "Setiawan", "Permana",
  "Halim", "Gunawan", "Firmansyah", "Suryana", "Ramadhan", "Maulana", "Anggraini", "Cahyani", "Puspita", "Handayani",
  "Wardani", "Utami", "Lestari", "Anwar", "Hakim", "Rahayu", "Purnama", "Susanto", "Kurniawan", "Prasetyo",
  "Yulianto", "Hartono", "Wahyudi", "Iskandar", "Hermawan", "Nurdin", "Sudrajat", "Abdullah", "Siregar", "Nasution",
  "Simanjuntak", "Situmorang", "Tanuwijaya", "Salim", "Wijoyo", "Mahendra", "Adiputra", "Baskoro", "Nugraha", "Dharmawan",
  "Susilo", "Widodo", "Ferdian", "Octavian", "Ardiansyah", "Rahmawati", "Fitriani", "Novita", "Damayanti", "Oktaviani",
];

const providers = ["gmail.com", "yahoo.com", "gmail.com", "gmail.com", "outlook.com", "yahoo.co.id", "gmail.com", "icloud.com"];
const cities = ["Jakarta", "Bandung", "Surabaya", "Medan", "Semarang", "Yogyakarta", "Makassar", "Denpasar", "Bekasi", "Depok", "Tangerang", "Malang", "Palembang", "Bogor", "Batam"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function slug(s: string): string { return s.toLowerCase().normalize("NFD").replace(/[^a-z]/g, ""); }

async function main() {
  console.log(`Membuat ${TOTAL} user dummy...`);

  const passwordHash = await bcrypt.hash("password123", 10);
  const usedEmails = new Set<string>();
  const now = Date.now();

  const users: any[] = [];
  const accounts: any[] = [];

  for (let i = 0; i < TOTAL; i++) {
    const first = pick(firstNames).trim();
    const last = pick(lastNames).trim();
    const name = `${first} ${last}`;

    const fs2 = slug(first);
    const ls = slug(last);
    const styles = [
      `${fs2}.${ls}`, `${fs2}${ls}`, `${fs2}_${ls}`,
      `${fs2}${ls}${randInt(1, 99)}`, `${fs2}.${ls}${randInt(80, 99)}`, `${fs2}${ls[0]}`,
    ];
    const local = pick(styles);
    let email = `${local}@${pick(providers)}`;
    let guard = 0;
    while (usedEmails.has(email)) {
      email = `${local}${randInt(1, 9999)}@${pick(providers)}`;
      if (guard++ > 50) { email = `${local}${i}@${pick(providers)}`; break; }
    }
    usedEmails.add(email);

    const daysAgo = randInt(1, 540);
    const createdAt = new Date(now - daysAgo * 86400000 - randInt(0, 86400000));
    const hasLogin = Math.random() < 0.7;
    const lastLoginAt = hasLogin
      ? new Date(createdAt.getTime() + randInt(0, daysAgo) * 86400000 + randInt(0, 86400000))
      : null;
    const status = Math.random() < 0.06 ? "SUSPENDED" : "ACTIVE";
    const id = `usr_${i.toString(36)}_${Math.random().toString(36).slice(2, 11)}`;

    users.push({
      id, name, email, passwordHash, role: "USER", status,
      createdAt: createdAt.toISOString(),
      lastLoginAt: lastLoginAt ? lastLoginAt.toISOString() : null,
    });

    const balance = randInt(0, 200) * 50000;
    accounts.push({
      id: `acc_${i.toString(36)}_${Math.random().toString(36).slice(2, 11)}`,
      userId: id, name: `Akun Iklan ${pick(cities)}`, currency: "IDR", balance,
      createdAt: createdAt.toISOString(),
    });
  }

  const chunk = 500;
  for (let i = 0; i < users.length; i += chunk) {
    const { error } = await supabase.from("User").insert(users.slice(i, i + chunk));
    if (error) { console.error("Gagal insert User:", error); process.exit(1); }
    console.log(`  user ${Math.min(i + chunk, users.length)}/${users.length}`);
  }
  for (let i = 0; i < accounts.length; i += chunk) {
    const { error } = await supabase.from("AdAccount").insert(accounts.slice(i, i + chunk));
    if (error) { console.error("Gagal insert AdAccount:", error); process.exit(1); }
    console.log(`  akun ${Math.min(i + chunk, accounts.length)}/${accounts.length}`);
  }

  const { count } = await supabase.from("User").select("*", { count: "exact", head: true });
  console.log(`✅ Selesai. Total user di database sekarang: ${count}`);
  console.log("Semua user dummy password-nya: password123");
}

main().catch((e) => { console.error(e); process.exit(1); });
