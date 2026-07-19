import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import WithdrawalsClient from "./WithdrawalsClient";

export const metadata = { title: "Pencairan Dana (WD) Afiliasi" };

export default async function AdminWithdrawalsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  // Ambil data penarikan beserta info user
  const { data: withdrawals } = await supabaseAdmin
    .from("Withdrawal")
    .select("*")
    .order("createdAt", { ascending: false });

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

  return <WithdrawalsClient initialWithdrawals={enriched} />;
}
