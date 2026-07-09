import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  balance: z.number().min(0).default(0),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, password, role, balance } = parsed.data;

  // Check if email already exists
  const { data: existing } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const userId = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const { data: user, error: userError } = await supabase
    .from("User")
    .insert({
      id: userId,
      name,
      email,
      passwordHash,
      role,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    })
    .select()
    .single();

  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });

  // Create initial AdAccount
  const { error: accountError } = await supabase
    .from("AdAccount")
    .insert({
      id: randomUUID(),
      userId: userId,
      name: `${name}'s Ad Account`,
      balance,
      currency: "IDR",
      createdAt: new Date().toISOString()
    });

  if (accountError) return NextResponse.json({ error: accountError.message }, { status: 500 });

  // Fetch full user record
  const { data: fullUserRaw } = await supabase
    .from("User")
    .select(`
      id, name, email, role, status, createdAt, lastLoginAt,
      adAccount:AdAccount(
        balance, currency,
        campaigns:Campaign(count)
      )
    `)
    .eq("id", userId)
    .single();

  if (!fullUserRaw) return NextResponse.json({ error: "User fetch failed" }, { status: 500 });

  const adAccountRaw = (Array.isArray(fullUserRaw.adAccount) ? fullUserRaw.adAccount[0] : fullUserRaw.adAccount) as any;
  const campaignsCount = adAccountRaw?.campaigns 
    ? (Array.isArray(adAccountRaw.campaigns) ? (adAccountRaw.campaigns[0]?.count ?? 0) : (adAccountRaw.campaigns.count ?? 0))
    : 0;

  const fullUser = {
    ...fullUserRaw,
    adAccount: adAccountRaw
      ? {
          ...adAccountRaw,
          _count: { campaigns: campaignsCount }
        }
      : null
  };

  return NextResponse.json(fullUser, { status: 201 });
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: usersRaw } = await supabase
    .from("User")
    .select(`
      id, name, email, role, status, createdAt, lastLoginAt,
      adAccount:AdAccount(
        balance, currency,
        campaigns:Campaign(count)
      )
    `)
    .order("createdAt", { ascending: false });

  const users = (usersRaw || []).map((user: any) => {
    const adAccountRaw = Array.isArray(user.adAccount) ? user.adAccount[0] : user.adAccount;
    const campaignsCount = adAccountRaw?.campaigns 
      ? (Array.isArray(adAccountRaw.campaigns) ? (adAccountRaw.campaigns[0]?.count ?? 0) : (adAccountRaw.campaigns.count ?? 0))
      : 0;

    return {
      ...user,
      adAccount: adAccountRaw
        ? {
            ...adAccountRaw,
            _count: { campaigns: campaignsCount }
          }
        : null
    };
  });

  return NextResponse.json(users);
}
