import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import CreateCampaignFlow from "@/components/create/CreateCampaignFlow";
import type { CampaignObjective } from "@/types";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const { data: adAccount } = await supabase
    .from("AdAccount")
    .select("id")
    .eq("userId", session.user.id)
    .single();

  if (!adAccount) notFound();

  const { data: campaign } = await supabase
    .from("Campaign")
    .select("id, name, objective, budgetType, budgetAmount, specialAdCategories, cboEnabled, abTestEnabled, status")
    .eq("id", id)
    .eq("adAccountId", adAccount.id)
    .single();

  if (!campaign) notFound();

  let specialAdCategories: string[] = [];
  try { specialAdCategories = JSON.parse(campaign.specialAdCategories ?? "[]"); } catch {}

  return (
    <CreateCampaignFlow
      mode="edit"
      editLevel="campaign"
      entityId={campaign.id}
      entityLabels={{ campaign: campaign.name }}
      initialData={{
        name: campaign.name,
        objective: campaign.objective as CampaignObjective,
        cboEnabled: campaign.cboEnabled,
        abTestEnabled: campaign.abTestEnabled,
        budgetType: campaign.budgetType,
        budgetAmount: campaign.budgetAmount,
        specialAdCategories,
      }}
    />
  );
}
