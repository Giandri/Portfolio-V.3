import type { ReactNode } from "react";

/**
 * Kerangka garis tipis ala OpenCode (DESIGN.MD §12 "Gaya Frame / Grid Lines").
 *
 * `Frame` adalah satu-satunya tempat aturan rail dan pembatas horizontal
 * ditulis, jadi halaman berikutnya cukup memakai komponen ini agar garisnya
 * konsisten. Latar belakang tidak ditetapkan di sini supaya pemanggil bisa
 * memakai `bg-background` polos atau pola garis.
 *
 * Susunan yang dipakai dashboard:
 *
 *   Frame            → container terpusat, rail kiri/kanan
 *   └ FrameRow       → baris: sidebar + konten
 *     └ FrameHeader  → pembatas horizontal di atas konten
 *
 * Di bawah `md` rail dihapus supaya tidak memakan lebar layar 360px.
 */
export function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <div
        className={`flex w-full max-w-[1350px] flex-col border-x border-border/60 max-md:border-x-0 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Baris isi frame: sidebar di kiri, konten di kanan. */
export function FrameRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex min-h-0 flex-1 ${className}`}>{children}</div>;
}

/** Pembatas horizontal 1px untuk header/topbar. */
export function FrameHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`flex min-h-12 shrink-0 items-center gap-3 border-b border-border/60 px-4 ${className}`}
    >
      {children}
    </header>
  );
}
