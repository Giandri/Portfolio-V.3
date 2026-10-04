import { localizedListSchema, localizedSchema, type Language, type Localized, type LocalizedList } from "./validations/localized";

const other = (lang: Language): Language => (lang === "id" ? "en" : "id");

/** Reads a `Localized` JSON column and falls back to the other language when the active one is empty. */
export function pickLocalized(value: unknown, lang: Language): string {
  const parsed = localizedSchema.safeParse(value);
  if (!parsed.success) return "";
  return parsed.data[lang].trim() || parsed.data[other(lang)].trim();
}

/** Same as `pickLocalized` but for list fields (e.g. profile roles, experience bullets). */
export function pickLocalizedList(value: unknown, lang: Language): string[] {
  const parsed = localizedListSchema.safeParse(value);
  if (!parsed.success) return [];
  const primary = parsed.data[lang].filter((item) => item.trim());
  return primary.length ? primary : parsed.data[other(lang)].filter((item) => item.trim());
}

export type { Language, Localized, LocalizedList };