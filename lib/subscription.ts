import { supabase } from "@/lib/supabase";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED";
export type PlanPeriod = "MONTHLY" | "YEARLY";

export interface Plan {
  slug: string;
  name: string;
  price: number;
  period: PlanPeriod;
  durationDays: number;
  tagline: string;
  perLabel: string; // "/bulan" | "/tahun"
  badge?: string;
  highlight?: boolean;
  features: string[];
}

// ── Sumber kebenaran paket langganan LMS ──
// Ubah harga/fitur di sini; semua halaman & API mengikuti.
export const PLANS: Plan[] = [
  {
    slug: "bulanan",
    name: "Kelas Premium — Bulanan",
    price: 49000,
    period: "MONTHLY",
    durationDays: 30,
    tagline: "Cocok untuk mulai belajar tanpa komitmen panjang.",
    perLabel: "/bulan",
    features: [
      "Akses SEMUA kelas & modul premium",
      "Video pembelajaran + materi lengkap",
      "Update materi baru selama berlangganan",
      "Sertifikat penyelesaian kelas",
      "Simulator iklan tetap gratis selamanya",
    ],
  },
  {
    slug: "tahunan",
    name: "Kelas Premium — Tahunan",
    price: 399000,
    period: "YEARLY",
    durationDays: 365,
    tagline: "Hemat 32% dibanding bulanan. Belajar setahun penuh.",
    perLabel: "/tahun",
    badge: "Paling Hemat",
    highlight: true,
    features: [
      "Semua yang ada di paket Bulanan",
      "Hemat setara ~4 bulan gratis",
      "Prioritas akses kelas & fitur baru",
      "Grup diskusi & tanya-jawab eksklusif",
      "Harga terkunci selama 1 tahun penuh",
    ],
  },
];

export function getPlan(slug: string): Plan | undefined {
  return PLANS.find((p) => p.slug === slug);
}

export function formatRupiah(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export interface SubscriptionRow {
  id: string;
  userId: string;
  planSlug: string;
  planName: string;
  amount: number;
  period: PlanPeriod;
  durationDays: number;
  status: SubscriptionStatus;
  qrisString: string;
  note: string;
  startedAt: string | null;
  expiresAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mengembalikan langganan AKTIF (status ACTIVE & belum kedaluwarsa) milik user,
 * atau null bila tidak ada. Dipakai untuk menggerbangi konten premium.
 */
export async function getActiveSubscription(userId: string): Promise<SubscriptionRow | null> {
  if (!userId) return null;
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("Subscription")
    .select("*")
    .eq("userId", userId)
    .eq("status", "ACTIVE")
    .or(`expiresAt.is.null,expiresAt.gt.${nowIso}`)
    .order("expiresAt", { ascending: false })
    .limit(1);

  return (data && data.length > 0 ? (data[0] as SubscriptionRow) : null);
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  return (await getActiveSubscription(userId)) !== null;
}
