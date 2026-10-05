"use server";

import { translateList, translateText } from "@/lib/translate";
import { requireAdmin } from "@/lib/admin";
import type { Language } from "@/lib/validations/localized";

export type TranslateState = { ok: boolean; message: string };

export async function translateFieldAction(
  text: string,
  to: Language,
): Promise<TranslateState> {
  await requireAdmin();

  const result = await translateText(text, to);
  return result.ok
    ? { ok: true, message: result.text }
    : { ok: false, message: result.message };
}

export async function translateListAction(
  items: string[],
  to: Language,
): Promise<TranslateState> {
  await requireAdmin();

  const result = await translateList(items, to);
  return result.ok
    ? { ok: true, message: result.text }
    : { ok: false, message: result.message };
}