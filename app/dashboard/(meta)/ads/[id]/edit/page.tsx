import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import EditAdClient from "./EditAdClient";

export default async function EditAdPage({
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

  // Fetch ad with ownership verification via Ad → AdSet → Campaign → AdAccount
  const { data: ad } = await supabase
    .from("Ad")
    .select(
      "id, name, format, primaryText, headline, description, cta, destinationUrl, mediaUrls, identityPage, identityInstagram, status, adSet:AdSet(id, campaign:Campaign(adAccountId))"
    )
    .eq("id", id)
    .single();

  const adAccountIdFromAd = (ad as any)?.adSet?.campaign?.adAccountId;
  if (!ad || adAccountIdFromAd !== adAccount.id) notFound();

  // Parse mediaUrls if stored as JSON string
  let mediaUrls: string[] = [];
  try {
    const raw = (ad as any).mediaUrls;
    mediaUrls = typeof raw === "string" ? JSON.parse(raw) : (raw ?? []);
  } catch {
    mediaUrls = [];
  }

  return <EditAdClient ad={{ ...(ad as any), mediaUrls }} />;
}
