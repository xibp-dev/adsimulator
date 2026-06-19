import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CreateCampaignFlow from "@/components/create/CreateCampaignFlow";
import PrerequisiteWarning from "@/components/dashboard/PrerequisiteWarning";

export default async function CreatePage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Check prerequisites
  const { count: portfoliosCount } = await supabase
    .from("BusinessPortfolio")
    .select("*", { count: 'exact', head: true })
    .eq("userId", session.user.id);

  const { count: pagesCount } = await supabase
    .from("Fanspage")
    .select("*", { count: 'exact', head: true })
    .eq("userId", session.user.id);

  const hasPortfolio = (portfoliosCount ?? 0) > 0;
  const hasPage = (pagesCount ?? 0) > 0;

  if (!hasPortfolio || !hasPage) {
    return <PrerequisiteWarning hasPortfolio={hasPortfolio} hasPage={hasPage} />;
  }

  return <CreateCampaignFlow />;
}
