import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

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

    // Insert User
    const { data: newUser, error: userError } = await supabaseAdmin
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

    return NextResponse.json({ message: "Pendaftaran berhasil", user: { id: newUser.id, email: newUser.email } }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
