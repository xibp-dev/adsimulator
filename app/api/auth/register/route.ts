import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  // ref menerima referralCode (kode pendek 6 karakter) bukan UUID langsung
  // gunakan nullish() agar menerima null, undefined, maupun string
  referredById: z.string().nullish(),
});

/** Generate kode referral pendek 6 karakter (huruf kapital + angka) */
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // hindari karakter ambigu: 0/O, I/1
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Generate kode referral unik yang belum dipakai user lain */
async function getUniqueReferralCode(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateReferralCode();
    const { data } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("referralCode", code)
      .maybeSingle();
    if (!data) return code;
    attempts++;
  }
  // Fallback ke 8 karakter jika gagal 10 kali
  return generateReferralCode() + generateReferralCode().slice(0, 2);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, referredById: refCodeRaw } = parsed.data;
    // Buang null/undefined — perlakukan keduanya sebagai "tidak ada referrer"
    const refCode = refCodeRaw || null;

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const userId = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    // Lookup referrer by referralCode (kode pendek), bukan UUID
    let validReferrerId: string | null = null;
    if (refCode && typeof refCode === "string" && refCode.trim().length > 0) {
      const code = refCode.trim().toUpperCase();
      const { data: referrer } = await supabaseAdmin
        .from("User")
        .select("id")
        .eq("referralCode", code)
        .maybeSingle();
      if (referrer) {
        validReferrerId = referrer.id;
      }
    }

    // Generate kode referral unik untuk user baru ini
    // Jika kolom belum ada di database, newReferralCode akan null dan tidak dikirim ke DB
    let newReferralCode: string | null = null;
    try {
      newReferralCode = await getUniqueReferralCode();
    } catch {
      // kolom referralCode belum ada di database — skip
    }

    // Bangun payload secara dinamis:
    // Hanya sertakan kolom afiliasi jika nilainya non-null
    // agar PostgREST tidak menolak request karena kolom belum ada
    const insertPayload: Record<string, any> = {
      id: userId,
      name,
      email,
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };
    if (newReferralCode) insertPayload.referralCode = newReferralCode;
    if (validReferrerId) insertPayload.referredById = validReferrerId;

    const { data: newUser, error: userError } = await supabaseAdmin
      .from("User")
      .insert(insertPayload)
      .select()
      .single();

    if (userError) throw userError;


    // Create Initial Ad Account for the user
    const { error: accountError } = await supabaseAdmin
      .from("AdAccount")
      .insert({
        id: randomUUID(),
        userId: userId,
        name: `Ad Account - ${name}`,
        currency: "IDR",
        balance: 0,
        createdAt: new Date().toISOString()
      });

    if (accountError) throw accountError;

    return NextResponse.json(
      { message: "Pendaftaran berhasil", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
