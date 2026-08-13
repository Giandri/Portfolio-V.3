"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

function Dock({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center h-13 sm:h-14 pt-3 pb-1 sm:pt-2 sm:pb-1 px-4 sm:px-5 gap-2 sm:gap-3 rounded-xl sm:rounded-2xl",
        "bg-black/20 dark:bg-white/10 backdrop-blur-xl",
        "border border-white/20 dark:border-white/10",
        "shadow-lg shadow-black/10",
        className,
      )}>
      {children}
    </div>
  );
}

function DockCard({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="aspect-square w-7 h-7 sm:w-8 sm:h-8 rounded-sm outline-none">
      {children}
    </button>
  );
}

function DockCardInner({ src }: { src: string }) {
  return <img src={src} alt="" draggable={false} className="w-full h-full object-contain rounded-xs select-none pointer-events-none" />;
}

function DockDivider() {
  return (
    <div className="h-full flex items-center justify-center">
      <span className="w-px h-6 sm:h-8 rounded bg-black/15 dark:bg-white/15"></span>
    </div>
  );
}

export { Dock, DockCard, DockCardInner, DockDivider };
export default Dock;
