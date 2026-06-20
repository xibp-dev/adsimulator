import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";
import { generateDynamicQris, isValidQris } from "@/lib/qris";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount < 1000) {
      return NextResponse.json(
        { error: "Nominal minimal Rp 1.000" },
        { status: 400 }
      );
    }

    if (amount > 50_000_000) {
      return NextResponse.json(
        { error: "Nominal maksimal Rp 50.000.000" },
        { status: 400 }
      );
    }

    const settings = await getSiteSettings();

    if (!settings.qrisString || settings.qrisString.trim() === "") {
      return NextResponse.json(
        { error: "QRIS belum dikonfigurasi oleh admin" },
        { status: 503 }
      );
    }

    if (!isValidQris(settings.qrisString)) {
      return NextResponse.json(
        { error: "Format QRIS di sistem tidak valid" },
        { status: 500 }
      );
    }

    const dynamicQris = generateDynamicQris(settings.qrisString, amount);

    return NextResponse.json({ qris: dynamicQris, amount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
