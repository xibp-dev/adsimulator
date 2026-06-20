import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const [settings, { data: adAccount }] = await Promise.all([
    getSiteSettings(),
    supabase
      .from("AdAccount")
      .select("*")
      .eq("userId", session.user.id)
      .single(),
  ]);

  return (
    <DashboardLayout
      userName={session.user.name ?? "User"}
      accountName={adAccount?.name ?? "My Ad Account"}
      balance={adAccount?.balance ?? 0}
      currency={adAccount?.currency ?? "IDR"}
      logoUrl={settings?.logoUrl ?? ""}
    >
      {children}
    </DashboardLayout>
  );
}
