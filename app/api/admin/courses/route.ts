import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

const courseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  description: z.string().default(""),
  level: z.enum(["Pemula", "Menengah", "Lanjutan"]).default("Pemula"),
  category: z.string().default("Meta Ads"),
  thumbnailEmoji: z.string().default("📘"),
  accent: z.enum(["blue", "violet", "pink", "emerald", "amber", "indigo"]).default("blue"),
  isFree: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
  programId: z.string().nullable().optional(),
});

// Daftar semua kelas + jumlah pelajaran
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ data: courses }, { data: lessons }] = await Promise.all([
    supabase.from("Course").select("*").order("sortOrder", { ascending: true }),
    supabase.from("Lesson").select("courseId"),
  ]);

  const counts: Record<string, number> = {};
  (lessons || []).forEach((l: any) => { counts[l.courseId] = (counts[l.courseId] || 0) + 1; });

  const rows = (courses || []).map((c: any) => ({ ...c, lessonCount: counts[c.id] || 0 }));
  return NextResponse.json(rows);
}

// Buat kelas baru
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });

  // Cek slug unik
  const { data: dupe } = await supabase.from("Course").select("id").eq("slug", parsed.data.slug).limit(1);
  if (dupe && dupe.length > 0) return NextResponse.json({ error: "Slug sudah dipakai kelas lain." }, { status: 409 });

  const { data, error } = await supabase
    .from("Course")
    .insert({ id: randomUUID(), ...parsed.data, createdAt: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal membuat kelas" }, { status: 500 });
  return NextResponse.json({ ...data, lessonCount: 0 }, { status: 201 });
}
