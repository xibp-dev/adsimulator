import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import crypto from "crypto";

const patchSchema = z.object({
  action: z.enum(["approve", "reject"]),
  note: z.string().optional(),
});

// Setujui / tolak pengajuan langganan (admin)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });

  const { data: sub } = await supabase.from("Subscription").select("*").eq("id", id).single();
  if (!sub) return NextResponse.json({ error: "Langganan tidak ditemukan" }, { status: 404 });

  const nowIso = new Date().toISOString();
  const approver = session.user.name ?? session.user.email ?? "Admin";

  let update: Record<string, any>;
  if (parsed.data.action === "approve") {
    const started = new Date();
    const expires = new Date(started.getTime() + (sub.durationDays || 30) * 86400000);
    update = {
      status: "ACTIVE",
      startedAt: started.toISOString(),
      expiresAt: expires.toISOString(),
      approvedBy: approver,
      approvedAt: nowIso,
      note: parsed.data.note ?? sub.note ?? "",
      updatedAt: nowIso,
    };

    // Affiliate Commission Logic (20% of amount)
    try {
      const { data: userRecord } = await supabase
        .from("User")
        .select("referredById")
        .eq("id", sub.userId)
        .single();

      if (userRecord?.referredById && sub.amount > 0) {
        // Check duplication
        const { data: existingComm } = await supabase
          .from("AffiliateCommission")
          .select("id")
          .eq("subscriptionId", id)
          .maybeSingle();

        if (!existingComm) {
          const commAmount = Math.round(sub.amount * 0.20);
          await supabase.from("AffiliateCommission").insert({
            id: crypto.randomUUID(),
            referrerId: userRecord.referredById,
            referredUserId: sub.userId,
            subscriptionId: id,
            amount: commAmount,
            status: "APPROVED",
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        }
      }
    } catch (err) {
      console.error("Affiliate commission creation error:", err);
    }
  } else {
    update = {
      status: "REJECTED",
      approvedBy: approver,
      approvedAt: nowIso,
      note: parsed.data.note ?? "Pembayaran tidak terverifikasi",
      updatedAt: nowIso,
    };
  }

  const { data, error } = await supabase
    .from("Subscription")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal memperbarui langganan" }, { status: 500 });
  return NextResponse.json(data);
}
