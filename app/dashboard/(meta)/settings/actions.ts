"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Tidak terautentikasi" };

  const current = formData.get("current") as string;
  const next = formData.get("next") as string;
  const confirm = formData.get("confirm") as string;

  if (!current || !next || !confirm) return { success: false, error: "Lengkapi semua kolom" };
  if (next.length < 6) return { success: false, error: "Kata sandi baru minimal 6 karakter" };
  if (next !== confirm) return { success: false, error: "Konfirmasi kata sandi tidak cocok" };

  const { data: user } = await supabase
    .from("User")
    .select("passwordHash")
    .eq("id", session.user.id)
    .single();
  if (!user) return { success: false, error: "Pengguna tidak ditemukan" };

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) return { success: false, error: "Kata sandi saat ini salah" };

  const hash = await bcrypt.hash(next, 10);
  const { error } = await supabase
    .from("User")
    .update({ passwordHash: hash })
    .eq("id", session.user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
