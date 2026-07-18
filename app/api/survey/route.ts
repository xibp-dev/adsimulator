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

// DELETE: Hapus survei (untuk reset)
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const responseId = searchParams.get("id");
  const all = searchParams.get("all");

  if (all === "true") {
    // Hapus semua data survei
    const { error } = await supabaseAdmin.from("SurveyResponse").delete().neq("id", "none");
    if (error) {
      console.error("Survey reset all error:", error);
      return NextResponse.json({ error: "Gagal mereset semua survei" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (!responseId) {
    return NextResponse.json({ error: "ID respon wajib diisi" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("SurveyResponse")
    .delete()
    .eq("id", responseId);

  if (error) {
    console.error("Survey delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus survei" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

