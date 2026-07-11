import { cache } from "react";
import { supabase } from "./supabase";

export interface AdAccountLite {
  id: string;
  name: string | null;
  balance: number;
  currency: string | null;
}

// Dedupe per-request: layout dan page memanggil ini di request yang sama
// tanpa mengulang query ke Supabase.
export const getAdAccount = cache(async (userId: string): Promise<AdAccountLite | null> => {
  const { data } = await supabase
    .from("AdAccount")
    .select("id, name, balance, currency")
    .eq("userId", userId)
    .maybeSingle();
  return (data as AdAccountLite) ?? null;
});
