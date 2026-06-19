import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1, "Nama bisnis wajib diisi"),
  businessEmail: z.string().email("Format email bisnis tidak valid"),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: portfolios, error } = await supabase
    .from("BusinessPortfolio")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

  return NextResponse.json(portfolios || []);
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

    const { data: portfolio, error } = await supabase
      .from("BusinessPortfolio")
      .insert({
        id: randomUUID(),
        userId: session.user.id,
        name: parsed.data.name,
        businessEmail: parsed.data.businessEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
