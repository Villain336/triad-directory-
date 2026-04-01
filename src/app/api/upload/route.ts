import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const STORAGE_BUCKET = "photos";

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Request must be multipart/form-data." },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    const businessId = formData.get("businessId");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "A file field is required." },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File must be under 5 MB." },
        { status: 400 }
      );
    }

    // Build a unique storage path: photos/<businessId>/<timestamp>-<filename>
    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.name);
    const folder = businessId ? `${businessId}` : "general";
    const storagePath = `${folder}/${timestamp}-${safeName}`;

    const supabase = createServerClient();

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file. Please try again." },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const url = publicUrlData?.publicUrl ?? null;

    return NextResponse.json({ url, path: storagePath }, { status: 201 });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
