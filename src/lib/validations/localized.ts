import { z } from "zod";

export type Language = "id" | "en";

export type Localized = { id: string; en: string };
export type LocalizedList = { id: string[]; en: string[] };

export const localizedSchema = z.object({
  id: z.string().default(""),
  en: z.string().default(""),
});

export const localizedListSchema = z.object({
  id: z.array(z.string()).default([]),
  en: z.array(z.string()).default([]),
});

export function toLocalized(id: string, en: string): Localized {
  return { id, en };
}

export function toLocalizedList(id: string[], en: string[]): LocalizedList {
  return { id, en };
}