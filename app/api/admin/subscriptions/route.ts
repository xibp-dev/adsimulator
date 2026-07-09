import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { getPlan } from "@/lib/subscription";
import { randomUUID } from "crypto";
import { z } from "zod";

const createSchema = z.object({
  userId: z.string().min(1),
  planSlug: z.string().min(1),
});

// Admin membuat langganan manual untuk user → langsung AKTIF (tanpa checkout/bayar)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  const plan = getPlan(parsed.data.planSlug);
  if (!plan) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });

  const { data: user } = await supabase
    .from("User")
    .select("id, name, email")
    .eq("id", parsed.data.userId)
    .single();
  if (!user) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });

  // Cegah duplikat langganan aktif
  const nowIso = new Date().toISOString();
  const { data: active } = await supabase
    .from("Subscription")
    .select("id")
    .eq("userId", user.id)
    .eq("status", "ACTIVE")
    .or(`expiresAt.is.null,expiresAt.gt.${nowIso}`)
    .limit(1);
  if (active && active.length > 0) {
    return NextResponse.json({ error: "Pengguna ini sudah punya langganan aktif." }, { status: 409 });
  }

  const started = new Date();
  const expires = new Date(started.getTime() + plan.durationDays * 86400000);
  const approver = session.user.name ?? session.user.email ?? "Admin";

  const row = {
    id: randomUUID(),
    userId: user.id,
    planSlug: plan.slug,
    planName: plan.name,
    amount: plan.price,
    period: plan.period,
    durationDays: plan.durationDays,
    status: "ACTIVE",
    qrisString: "",
    note: "Dibuat manual oleh admin",
    startedAt: started.toISOString(),
    expiresAt: expires.toISOString(),
    approvedBy: approver,
    approvedAt: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const { data, error } = await supabase.from("Subscription").insert(row).select().single();
  if (error) return NextResponse.json({ error: "Gagal membuat langganan" }, { status: 500 });

  return NextResponse.json({ ...data, userName: user.name, userEmail: user.email }, { status: 201 });
}

// Daftar semua langganan (admin) + info user
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: subs } = await supabase
    .from("Subscription")
    .select("*")
    .order("createdAt", { ascending: false });

  const rows = subs || [];
  const userIds = Array.from(new Set(rows.map((s: any) => s.userId)));

  let usersById: Record<string, { name: string; email: string }> = {};
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("User")
      .select("id, name, email")
      .in("id", userIds);
    (users || []).forEach((u: any) => { usersById[u.id] = { name: u.name, email: u.email }; });
  }

  const enriched = rows.map((s: any) => ({
    ...s,
    userName: usersById[s.userId]?.name ?? "(pengguna dihapus)",
    userEmail: usersById[s.userId]?.email ?? "-",
  }));

  return NextResponse.json(enriched);
}
