import { NextResponse } from "next/server";
import { putImage } from "@vercel/blob";

import { getSession } from "@/lib/admin";
import { isAdminEmail } from "@/lib/admin-emails";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: "BLOB_READ_WRITE_TOKEN belum diatur." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File tidak ditemukan." }, { status: 400 });
  }

  const extension = ALLOWED.get(file.type);
  if (!extension) {
    return NextResponse.json(
      { message: "Tipe file harus jpg, png, webp, atau svg." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Ukuran maksimal 5 MB." },
      { status: 400 },
    );
  }

  const pathname = `media/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  try {
    const result = await putImage(pathname, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      optimizeImage: { width: 2000, quality: 85 },
    });
    return NextResponse.json({ url: result.url, pathname: result.pathname });
  } catch {
    return NextResponse.json({ message: "Upload gagal." }, { status: 500 });
  }
}