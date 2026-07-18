import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

const surveySchema = z.object({
  hasAdvertised: z.enum(["Pernah", "Belum Pernah"]),
  profession: z.string().min(1, "Profesi wajib diisi"),
  whatsapp: z.string().min(5, "Nomor WhatsApp wajib diisi"),
  hasWebsite: z.enum(["Punya", "Belum Punya"]),
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
  const { data: existing } = await supabase
    .from("SurveyResponse")
    .select("id")
    .eq("userId", session.user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Survei sudah pernah diisi." }, { status: 409 });
  }

  const { error } = await supabase.from("SurveyResponse").insert({
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
    return NextResponse.json({ error: "Gagal menyimpan survei" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// GET: Cek apakah user sudah mengisi survei
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("SurveyResponse")
    .select("id")
    .eq("userId", session.user.id)
    .maybeSingle();

  return NextResponse.json({ hasCompleted: !!data });
}
