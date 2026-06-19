import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createPresetSchema = z.object({
  type: z.enum(["AUDIENCE", "FANSPAGE", "PIXEL"]),
  name: z.string().min(1),
  data: z.string().min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = createPresetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { data: preset, error } = await supabase
      .from("Preset")
      .insert({
        id: randomUUID(),
        type: parsed.data.type,
        name: parsed.data.name,
        data: parsed.data.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(preset, { status: 201 });
  } catch (error) {
    console.error("Error creating preset:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
