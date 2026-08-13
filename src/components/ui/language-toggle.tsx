"use client";

import { useLanguage } from "@/context/language-provider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn("relative flex h-8 w-16 items-center justify-between rounded-full p-1 transition-colors bg-black/20 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/1", className)}
      aria-label="Toggle language">
      <span className="absolute left-2.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">EN</span>
      <span className="absolute right-2.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">ID</span>

      <motion.div
        className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm dark:bg-black"
        animate={{
          x: language === "id" ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}>
        <span className="text-[10px] font-bold text-black dark:text-white">{language.toUpperCase()}</span>
      </motion.div>
    </button>
  );
}
