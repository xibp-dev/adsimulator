import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { data: adsRaw, error } = await supabase
      .from("Ad")
      .select(`
        id, name, headline, primaryText, status, createdAt,
        adSet:AdSet(
          campaign:Campaign(
            name,
            adAccount:AdAccount(
              user:User(name)
            )
          )
        )
      `)
      .order("createdAt", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ads = (adsRaw || []).map((ad: any) => {
      const adSetRaw = Array.isArray(ad.adSet) ? ad.adSet[0] : ad.adSet;
      const campaignRaw = adSetRaw?.campaign 
        ? (Array.isArray(adSetRaw.campaign) ? adSetRaw.campaign[0] : adSetRaw.campaign)
        : null;
      const adAccountRaw = campaignRaw?.adAccount 
        ? (Array.isArray(campaignRaw.adAccount) ? campaignRaw.adAccount[0] : campaignRaw.adAccount)
        : null;
      const userRaw = adAccountRaw?.user 
        ? (Array.isArray(adAccountRaw.user) ? adAccountRaw.user[0] : adAccountRaw.user)
        : null;

      return {
        ...ad,
        adSet: {
          campaign: {
            name: campaignRaw?.name || "—",
            adAccount: {
              user: userRaw ? { name: userRaw.name } : null
            }
          }
        }
      };
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
