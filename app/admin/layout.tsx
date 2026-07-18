import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/layout/AdminLayoutClient";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const settings = await getSiteSettings();

  return (
    <AdminLayoutClient
      userName={session.user.name ?? "Admin"}
      logoUrl={settings.logoUrl ?? ""}
    >
      {children}
    </AdminLayoutClient>
  );
}
