import { NextResponse } from "next/server";
import { getSiteSettings, DEFAULT_SURVEY_CONFIG } from "@/lib/siteSettings";

export async function GET() {
  const settings = await getSiteSettings();
  const config = settings.surveyConfig ?? DEFAULT_SURVEY_CONFIG;
  return NextResponse.json(config);
}
