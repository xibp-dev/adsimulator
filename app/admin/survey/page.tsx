import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SurveyResponsesClient from "./SurveyResponsesClient";

export const metadata = { title: "Data Survei Pengguna" };

export default async function AdminSurveyPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  // Ambil semua survey responses
  const { data: responses } = await supabase
    .from("SurveyResponse")
    .select("*")
    .order("createdAt", { ascending: false });

  // Ambil data user (nama & email) untuk semua userId
  const userIds = (responses || []).map((r: any) => r.userId);
  const { data: users } = userIds.length
    ? await supabase.from("User").select("id, name, email").in("id", userIds)
    : { data: [] };

  const userMap: Record<string, { name: string; email: string }> = {};
  (users || []).forEach((u: any) => { userMap[u.id] = u; });

  const enriched = (responses || []).map((r: any) => ({
    ...r,
    userName: userMap[r.userId]?.name ?? "Unknown",
    userEmail: userMap[r.userId]?.email ?? "-",
  }));

  return <SurveyResponsesClient responses={enriched} />;
}
