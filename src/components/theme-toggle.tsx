"use client";

import { useThemeToggle } from "@/hooks/use-theme-toggle";

// Dark or Light mode only
const CustomToggle2 = () => {
  const { setCrazyDarkTheme, setCrazyLightTheme, isDark } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });

  return (
    <div className="flex gap-2">
      {isDark ? (
        <button
          onClick={setCrazyDarkTheme}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Dark Mode
        </button>
      ) : (
        <button
          onClick={setCrazyLightTheme}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Light Mode
        </button>
      )}
    </div>
  );
};

export { CustomToggle2 };
