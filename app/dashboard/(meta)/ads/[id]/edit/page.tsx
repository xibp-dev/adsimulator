import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import CreateCampaignFlow from "@/components/create/CreateCampaignFlow";
import type { CampaignObjective, AdFormat, CTA } from "@/types";

export default async function EditAdPage({
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

  // Ownership via Ad → AdSet → Campaign → AdAccount; juga ambil objective & conversionLocation
  const { data: ad } = await supabase
    .from("Ad")
    .select(
      "id, name, format, primaryText, headline, description, cta, destinationUrl, mediaUrls, identityPage, identityInstagram, status, adSet:AdSet(id, name, conversionLocation, campaign:Campaign(name, objective, adAccountId))"
    )
    .eq("id", id)
    .single();

  const a = ad as any;
  const adSet = a?.adSet;
  const campaign = adSet?.campaign;
  if (!ad || campaign?.adAccountId !== adAccount.id) notFound();

  let mediaUrls: string[] = [];
  try {
    mediaUrls = typeof a.mediaUrls === "string" ? JSON.parse(a.mediaUrls) : (a.mediaUrls ?? []);
  } catch {
    mediaUrls = [];
  }

  return (
    <CreateCampaignFlow
      mode="edit"
      editLevel="ad"
      entityId={a.id}
      entityLabels={{ campaign: campaign?.name, adset: adSet?.name, ad: a.name }}
      initialData={{
        objective: (campaign?.objective ?? "AWARENESS") as CampaignObjective,
        conversionLocation: adSet?.conversionLocation ?? "WEBSITE",
        adName: a.name,
        identityPage: a.identityPage ?? "",
        identityInstagram: a.identityInstagram ?? "",
        format: a.format as AdFormat,
        primaryText: a.primaryText ?? "",
        headline: a.headline ?? "",
        description: a.description ?? "",
        mediaUrls,
        cta: a.cta as CTA,
        destinationUrl: a.destinationUrl ?? "",
      }}
    />
  );
}
