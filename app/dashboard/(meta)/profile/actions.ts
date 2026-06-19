"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Tidak terautentikasi" };

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!name) return { success: false, error: "Nama wajib diisi" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { success: false, error: "Format email tidak valid" };

  // Pastikan email belum dipakai akun lain
  const { data: existing } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .neq("id", session.user.id)
    .maybeSingle();
  if (existing) return { success: false, error: "Email sudah dipakai akun lain" };

  const { error } = await supabase
    .from("User")
    .update({ name, email })
    .eq("id", session.user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
