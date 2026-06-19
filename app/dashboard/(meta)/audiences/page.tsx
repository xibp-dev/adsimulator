import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AudiencesView from "@/components/dashboard/AudiencesView";

export default async function AudiencesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AudiencesView />;
}
