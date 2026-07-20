import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

const programSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  description: z.string().default(""),
  thumbnailEmoji: z.string().default("📊"),
  accent: z.enum(["blue", "violet", "pink", "emerald", "amber", "indigo"]).default("blue"),
  isFree: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// GET: Semua program + jumlah modul
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ data: programs }, { data: courses }] = await Promise.all([
    supabaseAdmin.from("Program").select("*").order("sortOrder", { ascending: true }),
    supabaseAdmin.from("Course").select("id, programId"),
  ]);

  const counts: Record<string, number> = {};
  (courses || []).forEach((c: any) => {
    if (c.programId) counts[c.programId] = (counts[c.programId] || 0) + 1;
  });

  const rows = (programs || []).map((p: any) => ({ ...p, courseCount: counts[p.id] || 0 }));
  return NextResponse.json(rows);
}

// POST: Buat program baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = programSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });

  const { data: dupe } = await supabaseAdmin.from("Program").select("id").eq("slug", parsed.data.slug).limit(1);
  if (dupe && dupe.length > 0) return NextResponse.json({ error: "Slug sudah digunakan program lain." }, { status: 409 });

  const { data, error } = await supabaseAdmin
    .from("Program")
    .insert({ id: randomUUID(), ...parsed.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal membuat program" }, { status: 500 });
  return NextResponse.json({ ...data, courseCount: 0 }, { status: 201 });
}
