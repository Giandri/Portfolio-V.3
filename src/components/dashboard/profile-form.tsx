"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/dashboard/panel";
import {
  LocalizedInput,
  LocalizedListInput,
} from "@/components/dashboard/localized-field";
import { updateProfile } from "@/app/dashboard/actions";
import type { Localized, LocalizedList } from "@/lib/validations/localized";

export type ProfileFormValues = {
  name: string;
  headline: Localized;
  roles: LocalizedList;
  location: Localized;
  longBio: Localized;
  publicEmail: string;
  resumeUrl: string;
  resumeFileName: string;
  avatarUrl: string;
  greetingOpening: Localized;
  greetingClosing: Localized;
  ctaLabel: Localized;
};

const emptyLocalized: Localized = { id: "", en: "" };

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProfile(values);
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={submit}>
      
        <Panel title="Identitas">
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name">Nama</Label>
            <Input
              id="profile-name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              required
            />
          </div>

          <LocalizedInput
            label="Headline"
            value={values.headline}
            onChange={(next) => set("headline", next)}
            placeholder="Full-Stack Developer"
          />

          <LocalizedListInput
            label="Roles"
            value={values.roles}
            onChange={(next) => set("roles", next)}
            placeholder="Web Developer"
          />

          <LocalizedInput
            label="Lokasi"
            value={values.location}
            onChange={(next) => set("location", next)}
            placeholder="Palembang"
          />
        </Panel>

      
        <Panel title="Bio">
          <LocalizedInput
            label="Bio panjang"
            kind="textarea"
            rows={8}
            value={values.longBio}
            onChange={(next) => set("longBio", next)}
          />

          <LocalizedInput
            label="Pembuka sapaan"
            value={values.greetingOpening}
            onChange={(next) => set("greetingOpening", next)}
            placeholder="dear visitor,"
          />

          <LocalizedInput
            label="Penutup sapaan"
            value={values.greetingClosing}
            onChange={(next) => set("greetingClosing", next)}
            placeholder="warmly,"
          />

          <LocalizedInput
            label="Label tombol CTA"
            value={values.ctaLabel}
            onChange={(next) => set("ctaLabel", next)}
            placeholder="Get in touch"
          />
        </Panel>

      
        <Panel title="Kontak & Media">
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-email">Email publik</Label>
            <Input
              id="profile-email"
              type="email"
              value={values.publicEmail}
              onChange={(event) => set("publicEmail", event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-avatar">URL foto</Label>
            <Input
              id="profile-avatar"
              value={values.avatarUrl}
              onChange={(event) => set("avatarUrl", event.target.value)}
              placeholder="/images/fotocv.jpg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-resume">URL CV</Label>
            <Input
              id="profile-resume"
              value={values.resumeUrl}
              onChange={(event) => set("resumeUrl", event.target.value)}
              placeholder="/resume.pdf"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-resume-name">Nama file CV</Label>
            <Input
              id="profile-resume-name"
              value={values.resumeFileName}
              onChange={(event) => set("resumeFileName", event.target.value)}
              placeholder="Giandri-Aditio-CV.pdf"
            />
          </div>
        </Panel>

      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan profil"}
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