import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  type: z.enum(["instagram", "whatsapp"]),
  name: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("SocialAccount")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

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

    const { type } = parsed.data;
    let { name } = parsed.data;
    if (type === "instagram" && !name.startsWith("@")) {
      name = "@" + name;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("SocialAccount")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        type,
        name,
        status: "Terkoneksi",
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create social account error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
