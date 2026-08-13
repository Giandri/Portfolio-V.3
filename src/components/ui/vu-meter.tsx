"use client";

import { useEffect, useState } from "react";
import { Matrix } from "@/components/unlumen-ui/matrix";

const COLS = 16;

function randomLevels(): number[] {
  return Array.from({ length: COLS }, () => Math.random());
}

export function VuMeter({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [levels, setLevels] = useState<number[]>(randomLevels);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      setLevels((prev) =>
        prev.map((v) => {
          const next = v + (Math.random() - 0.5) * 0.35;
          return Math.max(0, Math.min(1, next));
        }),
      );
    }, 120);
    return () => clearInterval(id);
  }, [mounted]);

  if (!mounted) {
    return <div style={{ width: 172, height: 73 }} />;
  }

  return (
    <Matrix
      mode="vu"
      levels={levels}
      rows={7}
      cols={COLS}
      size={7}
      gap={4}
      className="text-black dark:text-white"
      ariaLabel="VU meter"
    />
  );
}
