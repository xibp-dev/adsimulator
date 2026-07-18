import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

const surveySchema = z.object({
  hasAdvertised: z.string().min(1, "Pilih pengalaman beriklan"),
  profession: z.string().min(1, "Profesi wajib diisi"),
  whatsapp: z.string().default(""),
  hasWebsite: z.string().min(1, "Pilih apakah punya website"),
  socialMedia: z.string().default(""),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = surveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }

  // Cek apakah sudah pernah mengisi
  const { data: existing, error: checkError } = await supabaseAdmin
    .from("SurveyResponse")
    .select("id")
    .eq("userId", session.user.id)
    .maybeSingle();

  if (checkError) {
    console.error("Survey check error:", checkError);
    return NextResponse.json({ error: `DB Error: ${checkError.message}` }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ error: "Survei sudah pernah diisi." }, { status: 409 });
  }

  const { error } = await supabaseAdmin.from("SurveyResponse").insert({
    id: randomUUID(),
    userId: session.user.id,
    hasAdvertised: parsed.data.hasAdvertised,
    profession: parsed.data.profession,
    whatsapp: parsed.data.whatsapp,
    hasWebsite: parsed.data.hasWebsite,
    socialMedia: parsed.data.socialMedia,
    createdAt: new Date().toISOString(),
  });

  if (error) {
    console.error("Survey submit error:", error);
    return NextResponse.json({ error: `Gagal menyimpan: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


// GET: Cek apakah user sudah mengisi survei
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("SurveyResponse")
    .select("id")
    .eq("userId", session.user.id)
    .maybeSingle();

  return NextResponse.json({ hasCompleted: !!data });
}
