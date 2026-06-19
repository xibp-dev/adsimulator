import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1, "Nama Halaman wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  bio: z.string().optional().default(""),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pages, error } = await supabase
    .from("Fanspage")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json(pages || []);
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

    const { data: fanspage, error } = await supabase
      .from("Fanspage")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        name: parsed.data.name,
        category: parsed.data.category,
        bio: parsed.data.bio,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(fanspage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
