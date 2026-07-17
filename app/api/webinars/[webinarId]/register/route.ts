import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

// GET  /api/webinars/[webinarId]/register → cek apakah sudah terdaftar
// POST /api/webinars/[webinarId]/register → daftar webinar
// DELETE /api/webinars/[webinarId]/register → batalkan pendaftaran

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ registered: false }, { status: 401 });

  const { webinarId } = await params;

  const { data } = await supabase
    .from("WebinarRegistration")
    .select("id, createdAt")
    .eq("userId", session.user.id)
    .eq("webinarId", webinarId)
    .maybeSingle();

  return NextResponse.json({ registered: !!data, registration: data ?? null });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { webinarId } = await params;

  // Cek webinar ada & published
  const { data: webinar } = await supabase
    .from("Webinar")
    .select("id, title, published")
    .eq("id", webinarId)
    .single();

  if (!webinar || !webinar.published) {
    return NextResponse.json({ error: "Webinar tidak ditemukan" }, { status: 404 });
  }

  // Upsert (jika sudah terdaftar, tidak error)
  const { data, error } = await supabase
    .from("WebinarRegistration")
    .upsert(
      { id: randomUUID(), userId: session.user.id, webinarId },
      { onConflict: "userId,webinarId", ignoreDuplicates: true }
    )
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ registered: true, registration: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { webinarId } = await params;

  const { error } = await supabase
    .from("WebinarRegistration")
    .delete()
    .eq("userId", session.user.id)
    .eq("webinarId", webinarId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ registered: false });
}
