import type { ReactNode } from "react";

/**
 * Badge status gaya OpenCode (DESIGN.MD §6 "Badge status").
 * Border 1px, latar transparan, radius 4px, 12px, diawali titik berwarna.
 * Teks selalu disertakan agar status tidak hanya bergantung pada warna (§8).
 */
export function StatusBadge({
  tone,
  children,
}: {
  tone: "neutral" | "success" | "warning" | "danger" | "brand";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    brand: "text-brand",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-current bg-transparent px-2 py-0.5 text-xs ${tones[tone]}`}
    >
      <span aria-hidden="true" className="text-[10px] leading-none">
        ●
      </span>
      {children}
    </span>
  );
}