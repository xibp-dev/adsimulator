import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import jsQR from "jsqr";
import { Jimp } from "jimp";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau BMP" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Baca gambar dengan Jimp dan ambil pixel data
    const image = await Jimp.read(buffer);
    const { width, height } = image.bitmap;

    // Konversi ke RGBA Uint8ClampedArray untuk jsQR
    const rawData = new Uint8ClampedArray(image.bitmap.data);

    // Decode QR code dari pixel data
    const code = jsQR(rawData, width, height, {
      inversionAttempts: "dontInvert",
    });

    if (!code || !code.data) {
      // Coba dengan inversi jika gagal
      const codeInverted = jsQR(rawData, width, height, {
        inversionAttempts: "onlyInvert",
      });

      if (!codeInverted || !codeInverted.data) {
        return NextResponse.json(
          { error: "QR Code tidak terdeteksi di gambar ini. Pastikan gambar jelas dan QR code terlihat penuh." },
          { status: 422 }
        );
      }

      return NextResponse.json({ success: true, qrisString: codeInverted.data });
    }

    return NextResponse.json({ success: true, qrisString: code.data });
  } catch (error: any) {
    console.error("Decode QR Error:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses gambar" }, { status: 500 });
  }
}
