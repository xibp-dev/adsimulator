import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import CreateCampaignFlow from "@/components/create/CreateCampaignFlow";
import type { CampaignObjective } from "@/types";

function dateOnly(v: string | null | undefined): string {
  if (!v) return "";
  try { return new Date(v).toISOString().split("T")[0]; } catch { return ""; }
}

function parseArr(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  try { return JSON.parse((v as string) ?? "[]"); } catch { return []; }
}

export default async function EditAdSetPage({
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

  const { data: adSet } = await supabase
    .from("AdSet")
    .select("*, campaign:Campaign(name, objective, adAccountId)")
    .eq("id", id)
    .single();

  if (!adSet || (adSet as any).campaign?.adAccountId !== adAccount.id) notFound();

  const a = adSet as any;
  const campaign = a.campaign;

  return (
    <CreateCampaignFlow
      mode="edit"
      editLevel="adset"
      entityId={a.id}
      entityLabels={{ campaign: campaign?.name, adset: a.name }}
      initialData={{
        objective: campaign?.objective as CampaignObjective,
        adSetName: a.name,
        conversionLocation: a.conversionLocation,
        datasetPixel: a.pixel ?? "",
        performanceGoal: a.performanceGoal,
        adSetBudgetType: a.budgetType,
        adSetBudgetAmount: a.budgetAmount,
        scheduleStart: dateOnly(a.scheduleStart),
        scheduleEnd: dateOnly(a.scheduleEnd),
        advantageAudienceOn: a.advantageAudienceOn,
        locations: parseArr(a.locations),
        ageMin: a.ageMin,
        ageMax: a.ageMax,
        genders: parseArr(a.genders),
        detailedTargeting: parseArr(a.detailedTargeting),
        languages: parseArr(a.languages),
        advantagePlacementsOn: a.advantagePlacementsOn,
        manualPlacements: parseArr(a.manualPlacements),
      }}
    />
  );
}
