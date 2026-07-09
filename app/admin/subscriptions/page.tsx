import { supabase } from "@/lib/supabase";
import { PLANS } from "@/lib/subscription";
import SubscriptionManagement from "@/components/admin/SubscriptionManagement";

export default async function AdminSubscriptionsPage() {
  const { data: subs } = await supabase
    .from("Subscription")
    .select("*")
    .order("createdAt", { ascending: false });

  const rows = subs || [];
  const userIds = Array.from(new Set(rows.map((s: any) => s.userId)));

  const usersById: Record<string, { name: string; email: string }> = {};
  if (userIds.length > 0) {
    const { data: users } = await supabase.from("User").select("id, name, email").in("id", userIds);
    (users || []).forEach((u: any) => { usersById[u.id] = { name: u.name, email: u.email }; });
  }

  const enriched = rows.map((s: any) => ({
    ...s,
    userName: usersById[s.userId]?.name ?? "(pengguna dihapus)",
    userEmail: usersById[s.userId]?.email ?? "-",
  }));

  const plans = PLANS.map((p) => ({
    slug: p.slug, name: p.name, price: p.price, period: p.period, perLabel: p.perLabel,
  }));

  return <SubscriptionManagement initialSubs={enriched} plans={plans} />;
}
