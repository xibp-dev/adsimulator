import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET: List semua penarikan (untuk admin)
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { data: withdrawals, error } = await supabaseAdmin
      .from("Withdrawal")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Ambil info user peminta
    const userIds = [...new Set((withdrawals || []).map((w: any) => w.userId))];
    const { data: users } = userIds.length
      ? await supabaseAdmin.from("User").select("id, name, email").in("id", userIds)
      : { data: [] };

    const userMap: Record<string, { name: string; email: string }> = {};
    (users || []).forEach((u: any) => {
      userMap[u.id] = u;
    });

    const enriched = (withdrawals || []).map((w: any) => ({
      ...w,
      userName: userMap[w.userId]?.name ?? "Unknown",
      userEmail: userMap[w.userId]?.email ?? "-",
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error("Admin fetch withdrawals error:", error);
    return NextResponse.json({ error: "Gagal memuat data penarikan" }, { status: 500 });
  }
}

// PATCH: Setujui atau tolak penarikan
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, note } = body;

    if (!id || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("Withdrawal")
      .update({
        status,
        note: note || "",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin patch withdrawal error:", error);
    return NextResponse.json({ error: "Gagal memperbarui status penarikan" }, { status: 500 });
  }
}
