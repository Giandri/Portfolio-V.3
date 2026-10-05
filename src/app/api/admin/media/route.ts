import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

import { getSession } from "@/lib/admin";
import { isAdminEmail } from "@/lib/admin-emails";

export async function GET() {
  const session = await getSession();
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ blobs: [], configured: false });
  }

  try {
    const { blobs } = await list({ prefix: "media/" });
    return NextResponse.json({
      configured: true,
      blobs: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
    });
  } catch {
    return NextResponse.json({ message: "Gagal membaca media." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url");
  if (!url || !url.includes("blob.vercel-storage.com")) {
    return NextResponse.json({ message: "URL tidak valid." }, { status: 400 });
  }

  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Gagal menghapus." }, { status: 500 });
  }
}