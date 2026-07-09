import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getPlan } from "@/lib/subscription";
import { getSiteSettings } from "@/lib/siteSettings";
import { generateDynamicQris, isValidQris } from "@/lib/qris";
import { randomUUID } from "crypto";
import { z } from "zod";

const createSchema = z.object({
  planSlug: z.string().min(1),
});

// Buat pengajuan langganan baru (status PENDING → menunggu konfirmasi admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });

  const plan = getPlan(parsed.data.planSlug);
  if (!plan) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });

  // Kalau sudah ada langganan AKTIF yang belum kedaluwarsa, tolak duplikat
  const nowIso = new Date().toISOString();
  const { data: active } = await supabase
    .from("Subscription")
    .select("id, expiresAt")
    .eq("userId", session.user.id)
    .eq("status", "ACTIVE")
    .or(`expiresAt.is.null,expiresAt.gt.${nowIso}`)
    .limit(1);
  if (active && active.length > 0) {
    return NextResponse.json({ error: "Kamu sudah punya langganan aktif." }, { status: 409 });
  }

  // Generate QRIS dinamis sesuai harga paket (kalau QRIS admin sudah dikonfigurasi)
  let qrisString = "";
  try {
    const settings = await getSiteSettings();
    if (settings.qrisString && isValidQris(settings.qrisString)) {
      qrisString = generateDynamicQris(settings.qrisString, plan.price);
    }
  } catch {
    // biarkan kosong — halaman checkout akan pakai QRIS gambar manual
  }

  const row = {
    id: randomUUID(),
    userId: session.user.id,
    planSlug: plan.slug,
    planName: plan.name,
    amount: plan.price,
    period: plan.period,
    durationDays: plan.durationDays,
    status: "PENDING",
    qrisString,
    note: "",
    startedAt: null,
    expiresAt: null,
    approvedBy: null,
    approvedAt: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const { data, error } = await supabase.from("Subscription").insert(row).select().single();
  if (error) return NextResponse.json({ error: "Gagal membuat langganan" }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}

// Daftar langganan milik user saat ini
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("Subscription")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  return NextResponse.json(data || []);
}
