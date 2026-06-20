import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import EditAdSetClient from "./EditAdSetClient";

export default async function EditAdSetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  // Get user's ad account
  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) notFound();

  // Fetch adset with campaign ownership verification
  const { data: adSet } = await supabase
    .from("AdSet")
    .select("id, name, budgetType, budgetAmount, scheduleStart, scheduleEnd, status, campaign:Campaign(adAccountId)")
    .eq("id", id)
    .single();

  if (!adSet || (adSet as any).campaign?.adAccountId !== adAccount.id) notFound();

  return <EditAdSetClient adSet={adSet as any} />;
}
