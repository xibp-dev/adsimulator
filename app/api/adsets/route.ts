import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  campaignId: z.string(),
  name: z.string().min(1),
  performanceGoal: z.string().default("MAXIMIZE_LINK_CLICKS"),
  conversionLocation: z.string().default("WEBSITE"),
  pixel: z.string().optional(),
  budgetType: z.enum(["DAILY", "LIFETIME"]).default("DAILY"),
  budgetAmount: z.number().min(0).default(0),
  scheduleStart: z.string(),
  scheduleEnd: z.string().optional().nullable(),
  advantageAudienceOn: z.boolean().default(true),
  locations: z.array(z.string()).default([]),
  ageMin: z.number().default(18),
  ageMax: z.number().default(65),
  genders: z.array(z.string()).default([]),
  detailedTargeting: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  advantagePlacementsOn: z.boolean().default(true),
  manualPlacements: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const { data: adSet, error } = await supabase
    .from("AdSet")
    .insert({
      id: randomUUID(),
      campaignId: d.campaignId,
      name: d.name,
      performanceGoal: d.performanceGoal,
      conversionLocation: d.conversionLocation,
      pixel: d.pixel,
      budgetType: d.budgetType,
      budgetAmount: d.budgetAmount,
      scheduleStart: new Date(d.scheduleStart).toISOString(),
      scheduleEnd: d.scheduleEnd ? new Date(d.scheduleEnd).toISOString() : null,
      advantageAudienceOn: d.advantageAudienceOn,
      locations: JSON.stringify(d.locations),
      ageMin: d.ageMin,
      ageMax: d.ageMax,
      genders: JSON.stringify(d.genders),
      detailedTargeting: JSON.stringify(d.detailedTargeting),
      languages: JSON.stringify(d.languages),
      advantagePlacementsOn: d.advantagePlacementsOn,
      manualPlacements: JSON.stringify(d.manualPlacements),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json(adSet, { status: 201 });
}
