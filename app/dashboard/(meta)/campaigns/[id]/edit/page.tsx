import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import EditCampaignClient from "./EditCampaignClient";

export default async function EditCampaignPage({
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

  // Fetch campaign and verify ownership
  const { data: campaign } = await supabase
    .from("Campaign")
    .select("id, name, objective, budgetType, budgetAmount, specialAdCategories, cboEnabled, abTestEnabled, status")
    .eq("id", id)
    .eq("adAccountId", adAccount.id)
    .single();

  if (!campaign) notFound();

  return <EditCampaignClient campaign={campaign} />;
}
