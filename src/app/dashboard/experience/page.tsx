import { ExperiencesManager } from "@/components/dashboard/experiences-manager";
import { db } from "@/lib/db";
import type { Localized, LocalizedList } from "@/lib/validations/localized";

export const metadata = { title: "Experience" };

function asLocalized(value: unknown): Localized {
  if (value && typeof value === "object") {
    const record = value as { id?: unknown; en?: unknown };
    return {
      id: typeof record.id === "string" ? record.id : "",
      en: typeof record.en === "string" ? record.en : "",
    };
  }
  return { id: "", en: "" };
}

function asLocalizedList(value: unknown): LocalizedList {
  if (value && typeof value === "object") {
    const record = value as { id?: unknown; en?: unknown };
    return {
      id: Array.isArray(record.id) ? record.id.map(String) : [],
      en: Array.isArray(record.en) ? record.en.map(String) : [],
    };
  }
  return { id: [], en: [] };
}

export default async function ExperiencePage() {
  const experiences = await db.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Riwayat pendidikan dan pengalaman, tampil urut di halaman publik.
        </p>
      </div>

      <ExperiencesManager
        experiences={experiences.map((item) => ({
          id: item.id,
          company: item.company,
          role: asLocalized(item.role),
          period: asLocalized(item.period),
          bullets: asLocalizedList(item.bullets),
          order: item.order,
        }))}
      />
    </main>
  );
}