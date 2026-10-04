"use client";

import React, { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { SiteContent } from "@/lib/content";
import type { Language } from "@/lib/validations/localized";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  content: SiteContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "language";
const CHANGE_EVENT = "portfolio:language-change";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "id";
}

function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().includes("id") ? "id" : "en";
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isLanguage(saved) ? saved : detectLanguage();
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CHANGE_EVENT, onStoreChange);
}

export function LanguageProvider({ children, content }: { children: React.ReactNode; content: SiteContent }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, (): Language => "en");

  const setLanguage = useCallback((lang: Language) => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}