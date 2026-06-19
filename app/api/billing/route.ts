import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const topUpSchema = z.object({
  amount: z.number().min(10000, "Minimal top up Rp 10.000"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = topUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { data: adAccount, error: findError } = await supabase
      .from("AdAccount")
      .select("*")
      .eq("userId", session.user.id)
      .single();

    if (findError || !adAccount) {
      return NextResponse.json({ error: "Ad Account tidak ditemukan" }, { status: 404 });
    }

    const newBalance = adAccount.balance + parsed.data.amount;

    const { data: updatedAccount, error: updateError } = await supabase
      .from("AdAccount")
      .update({ balance: newBalance })
      .eq("id", adAccount.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedAccount);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
