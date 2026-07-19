import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// GET: Ambil daftar penarikan milik user yang sedang login
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const { data: withdrawals, error } = await supabaseAdmin
      .from("Withdrawal")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(withdrawals || []);
  } catch (error: any) {
    console.error("Fetch withdrawals error:", error);
    return NextResponse.json({ error: "Gagal memuat riwayat penarikan" }, { status: 500 });
  }
}

// POST: Ajukan penarikan dana baru
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const { bankName, accountName, accountNo } = body;

    if (!amount || amount < 10000) {
      return NextResponse.json({ error: "Minimal penarikan adalah Rp 10.000" }, { status: 400 });
    }
    if (!bankName?.trim() || !accountName?.trim() || !accountNo?.trim()) {
      return NextResponse.json({ error: "Semua informasi rekening wajib diisi" }, { status: 400 });
    }

    // 1. Hitung saldo tersedia (Approved Commissions - (Approved/Pending Withdrawals))
    // A. Ambil total komisi approved
    const { data: commissions } = await supabaseAdmin
      .from("AffiliateCommission")
      .select("amount")
      .eq("referrerId", userId)
      .eq("status", "APPROVED");

    const totalCommissions = (commissions || []).reduce((sum, c) => sum + c.amount, 0);

    // B. Ambil total penarikan pending / approved
    const { data: withdrawals } = await supabaseAdmin
      .from("Withdrawal")
      .select("amount")
      .eq("userId", userId)
      .in("status", ["PENDING", "APPROVED"]);

    const totalWithdrawals = (withdrawals || []).reduce((sum, w) => sum + w.amount, 0);

    const availableBalance = totalCommissions - totalWithdrawals;

    if (amount > availableBalance) {
      return NextResponse.json({ error: `Saldo tidak mencukupi. Saldo tersedia: Rp ${availableBalance.toLocaleString("id-ID")}` }, { status: 400 });
    }

    // 2. Simpan pengajuan penarikan
    const { data, error } = await supabaseAdmin
      .from("Withdrawal")
      .insert({
        id: crypto.randomUUID(),
        userId,
        amount,
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNo: accountNo.trim(),
        status: "PENDING",
        note: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Create withdrawal error:", error);
    return NextResponse.json({ error: "Gagal memproses pengajuan penarikan" }, { status: 500 });
  }
}
