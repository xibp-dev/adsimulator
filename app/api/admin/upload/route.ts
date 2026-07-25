import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

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
    const safeExt = ALLOWED_EXTENSIONS[file.type] || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${safeExt}`;
    const filePath = `settings/${fileName}`;

    // 1. Coba upload ke Cloudflare R2 jika Binding UPLOADS tersedia
    // @ts-ignore
    const r2Bucket = process.env.UPLOADS || (globalThis as any).UPLOADS;
    if (r2Bucket && typeof r2Bucket.put === "function") {
      await r2Bucket.put(filePath, buffer, {
        httpMetadata: { contentType: file.type },
      });
      const publicUrl = `/api/uploads/${filePath}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // 2. Fallback ke Supabase Storage jika R2 belum disetup
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "site-assets");
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket("site-assets", { public: true });
    }

    const { error } = await supabaseAdmin.storage
      .from("site-assets")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: `Gagal mengunggah: ${error.message}` }, { status: 500 });
    }

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
