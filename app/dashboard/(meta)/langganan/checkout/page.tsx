import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPlan } from "@/lib/subscription";
import { getSiteSettings } from "@/lib/siteSettings";
import CheckoutClient from "@/components/subscription/CheckoutClient";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { plan: planSlug } = await searchParams;
  const plan = planSlug ? getPlan(planSlug) : undefined;
  if (!plan) redirect("/dashboard/langganan");

  // Resume pengajuan PENDING yang sudah ada untuk paket ini (kalau ada)
  const { data: existingRows } = await supabase
    .from("Subscription")
    .select("id, status, qrisString, planName")
    .eq("userId", session.user.id)
    .eq("planSlug", plan.slug)
    .eq("status", "PENDING")
    .order("createdAt", { ascending: false })
    .limit(1);

  const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

  let qrisImageUrl = "";
  try {
    const settings = await getSiteSettings();
    qrisImageUrl = settings.qrisImageUrl ?? "";
  } catch {}

  return (
    <CheckoutClient
      plan={{
        slug: plan.slug,
        name: plan.name,
        price: plan.price,
        perLabel: plan.perLabel,
        period: plan.period,
        durationDays: plan.durationDays,
        features: plan.features,
      }}
      existing={existing}
      qrisImageUrl={qrisImageUrl}
    />
  );
}
