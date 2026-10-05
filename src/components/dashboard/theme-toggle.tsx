"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const ORDER = ["light", "dark", "system"] as const;
type Choice = (typeof ORDER)[number];

const ICONS: Record<Choice, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NEXT: Record<Choice, Choice> = {
  light: "dark",
  dark: "system",
  system: "light",
};

// `next-themes` baru tahu tema setelah hydration. `useSyncExternalStore`
// memberi nilai server (`"system"`) sebelum mount dan nilai klien sesudahnya
// tanpa perlu setState di dalam effect.
const emptySubscribe = () => () => {};

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const choice: Choice =
    hydrated && ORDER.includes(theme as Choice) ? (theme as Choice) : "system";
  const Icon = ICONS[choice];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => setTheme(NEXT[choice])}
      aria-label={`Tema: ${choice}. Klik untuk ganti.`}
      title={choice}
    >
      <Icon className="size-4" />
    </Button>
  );
}