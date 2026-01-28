"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

interface UseThemeToggleOptions {
  variant?: "rectangle" | "circle";
  start?: "top-down" | "bottom-up" | "left-right" | "right-left";
}

export function useThemeToggle(options: UseThemeToggleOptions = {}) {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update isDark state when theme changes
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  // Crazy animation effect
  const triggerCrazyAnimation = useCallback(() => {
    setIsAnimating(true);

    // Create multiple rapid toggles for "crazy" effect
    const toggles = [];
    for (let i = 0; i < 8; i++) {
      toggles.push(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            setTheme(theme === "dark" ? "light" : "dark");
            resolve();
          }, i * 50);
        })
      );
    }

    // Final toggle to target theme
    Promise.all(toggles).then(() => {
      setTimeout(() => {
        setTheme(theme === "dark" ? "light" : "dark");
        setIsAnimating(false);
      }, 400);
    });
  }, [theme, setTheme]);

  const setCrazyDarkTheme = useCallback(() => {
    if (!isDark) {
      triggerCrazyAnimation();
    }
  }, [isDark, triggerCrazyAnimation]);

  const setCrazyLightTheme = useCallback(() => {
    if (isDark) {
      triggerCrazyAnimation();
    }
  }, [isDark, triggerCrazyAnimation]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return {
    theme,
    isDark,
    isAnimating,
    toggleTheme,
    setCrazyDarkTheme,
    setCrazyLightTheme,
    setTheme,
  };
}
