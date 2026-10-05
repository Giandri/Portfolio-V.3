"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/dashboard/panel";
import { LocalizedInput } from "@/components/dashboard/localized-field";
import { updateSiteSetting } from "@/app/dashboard/actions";
import type { Localized } from "@/lib/validations/localized";

export type SiteSettingValues = {
  siteTitle: string;
  description: Localized;
  ogImage: string;
  favicon: string;
  siteUrl: string;
};

export function SiteSettingForm({ initial }: { initial: SiteSettingValues }) {
  const [values, setValues] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof SiteSettingValues>(key: K, value: SiteSettingValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateSiteSetting(values);
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <Panel
        title="SEO"
        description="Dipakai untuk <title> dan meta description di halaman publik."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-title">Judul situs</Label>
            <Input
              id="site-title"
              className="h-8"
              value={values.siteTitle}
              onChange={(event) => set("siteTitle", event.target.value)}
              required
            />
          </div>

          <LocalizedInput
            label="Deskripsi"
            kind="textarea"
            rows={3}
            value={values.description}
            onChange={(next) => set("description", next)}
            placeholder="Portofolio seorang full-stack developer."
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="site-url">URL situs</Label>
            <Input
              id="site-url"
              className="h-8"
              value={values.siteUrl}
              onChange={(event) => set("siteUrl", event.target.value)}
              placeholder="https://giandri.my.id"
            />
            <p className="text-xs text-muted-foreground">
              Wajib di production. Dipakai sebagai base URL Open Graph.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Media" description="Gambar untuk preview saat link dibagikan.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="og-image">OG image</Label>
            <Input
              id="og-image"
              className="h-8"
              value={values.ogImage}
              onChange={(event) => set("ogImage", event.target.value)}
              placeholder="/images/og.png"
            />
            <p className="text-xs text-muted-foreground">
              Idealnya 1200x630. Path relatif diprefix URL situs.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="favicon">Favicon</Label>
            <Input
              id="favicon"
              className="h-8"
              value={values.favicon}
              onChange={(event) => set("favicon", event.target.value)}
              placeholder="/icon.png"
            />
            <p className="text-xs text-muted-foreground">
              Kosongkan untuk memakai /icon.png bawaan.
            </p>
          </div>
        </div>

        {values.ogImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.ogImage}
            alt="Pratinjau OG image"
            className="mt-4 max-w-sm rounded-md border border-border"
          />
        ) : null}
      </Panel>

      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan pengaturan"}
        </Button>
        {message ? (
          <p
            role={message.ok ? "status" : "alert"}
            className={message.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}