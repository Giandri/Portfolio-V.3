import { SiteSettingForm } from "@/components/dashboard/site-setting-form";
import { db } from "@/lib/db";
import type { Localized } from "@/lib/validations/localized";

export const metadata = { title: "Settings" };

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

export default async function SettingsPage() {
  const settings = await db.siteSetting.findUnique({ where: { id: "singleton" } });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Metadata situs untuk SEO dan preview link.
        </p>
      </div>

      <SiteSettingForm
        initial={{
          siteTitle: settings?.siteTitle ?? "",
          description: asLocalized(settings?.description),
          ogImage: settings?.ogImage ?? "",
          favicon: settings?.favicon ?? "",
          siteUrl: settings?.siteUrl ?? "",
        }}
      />
    </main>
  );
}