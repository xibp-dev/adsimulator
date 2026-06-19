import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1, "Nama pemirsa wajib diisi").max(80),
  type: z.enum(["CUSTOM", "LOOKALIKE", "SAVED"]),
  source: z.string().max(160).optional().default(""),
});

// Estimasi ukuran pemirsa (disimulasikan) sesuai tipe
function estimateSize(type: string): number {
  const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));
  switch (type) {
    case "LOOKALIKE": return rand(500_000, 3_000_000);
    case "SAVED": return rand(100_000, 1_200_000);
    default: return rand(5_000, 80_000); // CUSTOM
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("SavedAudience")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("SavedAudience")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        name: parsed.data.name.trim(),
        type: parsed.data.type,
        source: parsed.data.source?.trim() ?? "",
        estimatedSize: estimateSize(parsed.data.type),
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 });

  // Hanya boleh hapus milik sendiri
  const { error } = await supabase
    .from("SavedAudience")
    .delete()
    .eq("id", id)
    .eq("userId", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
