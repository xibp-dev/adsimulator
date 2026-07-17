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
  referredById: z.string().optional(),
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

    const { name, email, password, referredById: refCode } = parsed.data;

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
    // (akan null jika kolom belum ada di database — aman)
    let newReferralCode: string | null = null;
    try {
      newReferralCode = await getUniqueReferralCode();
    } catch {
      // kolom referralCode belum ada — lewati
    }

    // Insert User — coba dengan kolom afiliasi, fallback tanpa jika kolom belum ada
    let newUser: any = null;

    const affiliatePayload = {
      id: userId,
      name,
      email,
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      referredById: validReferrerId,
      referralCode: newReferralCode,
      createdAt: new Date().toISOString()
    };

    const { data: userWithAffiliate, error: userWithAffiliateError } = await supabaseAdmin
      .from("User")
      .insert(affiliatePayload)
      .select()
      .single();

    if (userWithAffiliateError) {
      // Jika error karena kolom belum ada, coba insert tanpa kolom afiliasi
      const isColumnError =
        userWithAffiliateError.message?.includes("referralCode") ||
        userWithAffiliateError.message?.includes("referredById") ||
        userWithAffiliateError.code === "PGRST204" ||
        userWithAffiliateError.code === "42703";

      if (isColumnError) {
        const { data: fallbackUser, error: fallbackError } = await supabaseAdmin
          .from("User")
          .insert({
            id: userId,
            name,
            email,
            passwordHash,
            role: "USER",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          })
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        newUser = fallbackUser;
      } else {
        throw userWithAffiliateError;
      }
    } else {
      newUser = userWithAffiliate;
    }

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
