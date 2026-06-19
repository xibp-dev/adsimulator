import { supabase } from "@/lib/supabase";
import UserManagement from "@/components/admin/UserManagement";

export default async function AdminUsersPage() {
  const { data: usersRaw } = await supabase
    .from("User")
    .select(`
      id, name, email, role, status, createdAt, lastLoginAt,
      adAccount:AdAccount(
        balance, currency,
        campaigns:Campaign(count)
      )
    `)
    .order("createdAt", { ascending: false });

  const users = (usersRaw || []).map((user: any) => {
    const adAccountRaw = Array.isArray(user.adAccount) ? user.adAccount[0] : user.adAccount;
    const campaignsCount = adAccountRaw?.campaigns 
      ? (Array.isArray(adAccountRaw.campaigns) ? (adAccountRaw.campaigns[0]?.count ?? 0) : (adAccountRaw.campaigns.count ?? 0))
      : 0;

    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
      adAccount: adAccountRaw
        ? {
            ...adAccountRaw,
            _count: { campaigns: campaignsCount }
          }
        : null
    };
  });

  return <UserManagement initialUsers={users} />;
}
