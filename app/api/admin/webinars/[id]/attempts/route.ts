import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET: Ambil semua attempt ujian webinar + data user
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: webinarId } = await params;

  // Ambil semua attempt untuk webinar ini
  const { data: attempts, error: attemptsError } = await supabase
    .from("WebinarAttempt")
    .select("*")
    .eq("webinarId", webinarId)
    .order("createdAt", { ascending: false });

  if (attemptsError) {
    console.error("Error fetching attempts:", attemptsError);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([]);
  }

  // Ambil data user untuk semua userId yang unik
  const userIds = [...new Set(attempts.map((a: any) => a.userId))];
  const { data: users } = await supabase
    .from("User")
    .select("id, name, email")
    .in("id", userIds);

  const userMap: Record<string, any> = {};
  (users || []).forEach((u: any) => {
    userMap[u.id] = u;
  });

  // Merge data user ke attempt
  const result = attempts.map((a: any) => ({
    ...a,
    user: userMap[a.userId] ?? { id: a.userId, name: "Unknown", email: "-", image: null },
  }));

  return NextResponse.json(result);
}
