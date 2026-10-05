"use client";

import { useId, useState, useTransition } from "react";
import { Languages } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateFieldAction, translateListAction } from "@/app/dashboard/translate-actions";
import type { Language, Localized } from "@/lib/validations/localized";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "id", label: "Indonesia" },
  { code: "en", label: "English" },
];

function normalize(value: Localized): Localized {
  return { id: value.id ?? "", en: value.en ?? "" };
}

/**
 * Input untuk satu field yang punya dua varian bahasa.
 *
 * Nilaicontrolled sepenuhnya oleh `value`/`onChange` supaya bisa dipakai di
 * form yang dikontrol (dipakai ulang oleh form Project, Profile, Experience).
 * `kind` memilih textarea untuk deskripsi panjang.
 */
export function LocalizedInput({
  label,
  value,
  onChange,
  kind = "input",
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  kind?: "input" | "textarea";
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const baseId = useId();
  const [language, setLanguage] = useState<Language>("id");
  const [translating, startTranslating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const current = normalize(value);

  const fieldId = `${baseId}-${language}`;

  // Bahasa lain = sumber terjemahan, jadi butuh dua-duanya terisi.
  const source = language === "id" ? current.id : current.en;
  const canAutoTranslate = source.trim().length > 0 && !translating;

  function update(next: string) {
    setError(null);
    onChange({ ...current, [language]: next });
  }

  function autoTranslate() {
    const other: Language = language === "id" ? "en" : "id";
    if (!source.trim()) return;

    startTranslating(async () => {
      setError(null);
      const result = await translateFieldAction(source, other);
      if (result.ok) {
        onChange({ ...current, [other]: result.message });
        setLanguage(other);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={fieldId}>{label}</Label>
        <Tabs value={language} onValueChange={(next) => setLanguage(next as Language)}>
          <TabsList>
            {LANGUAGES.map((lang) => (
              <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {kind === "textarea" ? (
        <Textarea
          id={fieldId}
          value={current[language]}
          onChange={(event) => update(event.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <Input
          id={fieldId}
          value={current[language]}
          onChange={(event) => update(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}

      {!current[language].trim() && canAutoTranslate ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 self-start text-xs"
            onClick={autoTranslate}
          >
            <Languages className="size-3.5" />
            Terjemahkan dari {language === "id" ? "Indonesia" : "English"}
          </Button>
          <span className="text-xs text-muted-foreground">
            hasil mesin, periksa dulu sebelum simpan
          </span>
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

/**
 * Input daftar dua bahasa (satu baris per item, locale dipisah tab).
 * Nilai adalah array untuk setiap bahasa; dipakai untuk `bullets`/`roles`.
 */
export function LocalizedListInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: { id: string[]; en: string[] };
  onChange: (next: { id: string[]; en: string[] }) => void;
  placeholder?: string;
}) {
  const baseId = useId();
  const [language, setLanguage] = useState<Language>("id");
  const [translating, startTranslating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const items = value[language] ?? [];

  const other: Language = language === "id" ? "en" : "id";
  const source = value[other] ?? [];
  const canAutoTranslate =
    source.some((item) => item.trim().length > 0) && !translating;

  function update(next: string[]) {
    setError(null);
    onChange({ ...value, [language]: next });
  }

  function autoTranslate() {
    startTranslating(async () => {
      setError(null);
      const result = await translateListAction(source, language);
      if (result.ok) {
        onChange({ ...value, [language]: result.message.split("\n") });
        setLanguage(language);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Tabs value={language} onValueChange={(next) => setLanguage(next as Language)}>
          <TabsList>
            {LANGUAGES.map((lang) => (
              <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={`${baseId}-${index}`} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                update(next);
              }}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="shrink-0 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
              onClick={() => update(items.filter((_, i) => i !== index))}
            >
              Hapus
            </button>
          </div>
        ))}
        <button
          type="button"
          className="self-start rounded-md border px-3 py-2 text-sm hover:bg-accent"
          onClick={() => update([...items, ""])}
        >
          Tambah
        </button>
      </div>

      {!items.some((item) => item.trim()) && canAutoTranslate ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 self-start text-xs"
            onClick={autoTranslate}
          >
            <Languages className="size-3.5" />
            Terjemahkan dari {other === "id" ? "Indonesia" : "English"}
          </Button>
          <span className="text-xs text-muted-foreground">
            hasil mesin, periksa dulu sebelum simpan
          </span>
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}