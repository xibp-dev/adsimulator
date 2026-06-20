import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export async function GET(req: NextRequest) {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      qrisImageUrl: settings.qrisImageUrl || "",
    });
  } catch (err: any) {
    return NextResponse.json({ qrisImageUrl: "" });
  }
}
