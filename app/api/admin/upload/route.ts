import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

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

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, GIF, ICO, atau SVG" },
        { status: 400 }
      );
    }

    // Maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const ALLOWED_EXTENSIONS: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/x-icon": "ico",
      "image/vnd.microsoft.icon": "ico",
      "image/svg+xml": "svg",
    };
    const safeExt = ALLOWED_EXTENSIONS[file.type];
    if (!safeExt) {
      return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
    }
    const fileName = `${randomUUID()}.${safeExt}`;
    const filePath = `settings/${fileName}`;

    // Pastikan bucket site-assets ada, buat jika belum ada
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (!listError) {
      const bucketExists = buckets?.some((b) => b.name === "site-assets");
      if (!bucketExists) {
        const { error: createError } = await supabaseAdmin.storage.createBucket("site-assets", {
          public: true,
        });
        if (createError) {
          console.error("Gagal membuat bucket:", createError);
          return NextResponse.json(
            { error: `Gagal membuat storage bucket: ${createError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // Upload ke Supabase Storage (bucket: site-assets)
    const { data, error } = await supabaseAdmin.storage
      .from("site-assets")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: `Gagal mengunggah ke storage: ${error.message}` }, { status: 500 });
    }

    // Dapatkan public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
