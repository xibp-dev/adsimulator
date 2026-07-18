import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getSiteSettings } from "@/lib/siteSettings";
import { getAdAccount } from "@/lib/adAccount";
import SurveyGate from "@/components/ui/SurveyGate";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const [settings, adAccount] = await Promise.all([
    getSiteSettings(),
    getAdAccount(session.user.id),
  ]);

  return (
    <DashboardLayout
      userName={session.user.name ?? "User"}
      accountName={adAccount?.name ?? "My Ad Account"}
      balance={adAccount?.balance ?? 0}
      currency={adAccount?.currency ?? "IDR"}
      logoUrl={settings?.logoUrl ?? ""}
      qrisImageUrl={settings?.qrisImageUrl ?? ""}
      traktirEnabled={settings?.traktirEnabled !== false}
    >
      {children}
      <SurveyGate surveyEnabled={settings?.surveyEnabled === true} />
    </DashboardLayout>
  );
}

