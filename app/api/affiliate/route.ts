import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    // 0. Fetch user's own referralCode
    const { data: currentUser } = await supabase
      .from("User")
      .select("referralCode")
      .eq("id", userId)
      .single();

    // 1. Fetch referred users
    const { data: referrals, error: refError } = await supabase
      .from("User")
      .select("id, name, email, createdAt")
      .eq("referredById", userId);

    if (refError) throw refError;

    // 2. Fetch commissions
    const { data: commissions, error: commError } = await supabase
      .from("AffiliateCommission")
      .select("id, referredUserId, subscriptionId, amount, status, createdAt")
      .eq("referrerId", userId)
      .order("createdAt", { ascending: false });

    if (commError) throw commError;

    // 3. Fetch active subscriptions for referred users to calculate active referrers
    const referredUserIds = (referrals || []).map(r => r.id);
    let activeReferralsCount = 0;
    
    if (referredUserIds.length > 0) {
      const nowIso = new Date().toISOString();
      const { data: activeSubs } = await supabase
        .from("Subscription")
        .select("userId")
        .in("userId", referredUserIds)
        .eq("status", "ACTIVE")
        .or(`expiresAt.is.null,expiresAt.gt.${nowIso}`);
        
      const activeUserIds = new Set((activeSubs || []).map(s => s.userId));
      activeReferralsCount = activeUserIds.size;
    }

    // Map referred user names to commissions
    const userNamesMap: Record<string, string> = {};
    (referrals || []).forEach(u => {
      userNamesMap[u.id] = u.name;
    });

    const commissionsWithNames = (commissions || []).map(c => ({
      ...c,
      referredUserName: userNamesMap[c.referredUserId] || "Pengguna Terdaftar"
    }));

    const totalReferrals = (referrals || []).length;
    const totalEarnings = (commissions || [])
      .filter(c => c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({
      referralCode: currentUser?.referralCode ?? null,
      referrals: referrals || [],
      commissions: commissionsWithNames,
      stats: {
        totalReferrals,
        totalEarnings,
        activeReferrals: activeReferralsCount
      }
    });
  } catch (error: any) {
    console.error("Affiliate API error:", error);
    return NextResponse.json({ error: "Gagal memuat data afiliasi" }, { status: 500 });
  }
}
