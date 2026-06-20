import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { signOut } from "next-auth/react";
import AdminTopBar from "@/components/layout/AdminTopBar";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const settings = await getSiteSettings();

  return (
    <div className="h-screen flex overflow-hidden bg-[#f7f8fa]">
      <AdminSidebar logoUrl={settings.logoUrl ?? ""} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar userName={session.user.name ?? "Admin"} />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
