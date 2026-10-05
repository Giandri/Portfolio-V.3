"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/dashboard/panel";
import {
  LocalizedInput,
  LocalizedListInput,
} from "@/components/dashboard/localized-field";
import {
  createExperience,
  deleteExperience,
  reorderExperiences,
  updateExperience,
} from "@/app/dashboard/actions";
import type { Localized, LocalizedList } from "@/lib/validations/localized";

export type ExperienceRow = {
  id: string;
  company: string;
  role: Localized;
  period: Localized;
  bullets: LocalizedList;
  order: number;
};

type FormState = {
  company: string;
  role: Localized;
  period: Localized;
  bullets: LocalizedList;
};

const emptyForm: FormState = {
  company: "",
  role: { id: "", en: "" },
  period: { id: "", en: "" },
  bullets: { id: [], en: [] },
};

export function ExperiencesManager({
  experiences,
}: {
  experiences: ExperienceRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function openNew() {
    setForm({ ...emptyForm });
    setCreating(true);
    setEditingId(null);
    setMessage(null);
  }

  function openEdit(item: ExperienceRow) {
    setForm({
      company: item.company,
      role: item.role,
      period: item.period,
      bullets: item.bullets,
    });
    setCreating(false);
    setEditingId(item.id);
    setMessage(null);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const payload = { ...form, order: experiences.length };
      const result =
        creating || editingId === null
          ? await createExperience(payload)
          : await updateExperience(editingId, payload);

      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) {
        setCreating(false);
        setEditingId(null);
      }
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= experiences.length) return;
    const next = [...experiences];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderExperiences(next.map((item) => item.id));
    });
  }

  function remove(id: string, company: string) {
    if (!window.confirm(`Hapus experience di "${company}"?`)) return;
    startTransition(async () => {
      const result = await deleteExperience(id);
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  const editing = creating || editingId !== null;

  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <Panel
          title={creating ? "Experience baru" : `Edit ${form.company || "experience"}`}
          action={
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => {
                setCreating(false);
                setEditingId(null);
              }}
              disabled={pending}
              aria-label="Batal"
            >
              <X className="size-4" />
            </Button>
          }
        >
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="exp-company">Perusahaan / lokasi</Label>
              <Input
                id="exp-company"
                className="h-8"
                value={form.company}
                onChange={(event) => set("company", event.target.value)}
                placeholder="Babel City"
                required
              />
            </div>

            <LocalizedInput
              label="Posisi"
              value={form.role}
              onChange={(next) => set("role", next)}
              placeholder="Web Developer"
            />

            <LocalizedInput
              label="Periode"
              value={form.period}
              onChange={(next) => set("period", next)}
              placeholder="Nov 2025 - Mei 2026"
            />

            <LocalizedListInput
              label="Poin achieves"
              value={form.bullets}
              onChange={(next) => set("bullets", next)}
              placeholder="Membangun fitur ..."
            />

            <div className="flex items-center gap-3">
              <Button size="sm" type="submit" disabled={pending}>
                {pending ? "Menyimpan…" : "Simpan"}
              </Button>
              {message ? (
                <p
                  role={message.ok ? "status" : "alert"}
                  className={
                    message.ok ? "text-xs text-muted-foreground" : "text-xs text-destructive"
                  }
                >
                  {message.text}
                </p>
              ) : null}
            </div>
          </form>
        </Panel>
      ) : null}

      <Panel
        title="Experience"
        description={`${experiences.length} item, tampil urut di halaman publik.`}
        action={
          <Button size="sm" onClick={openNew} disabled={pending || editing}>
            <Plus className="size-4" />
            Tambah
          </Button>
        }
      >
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada experience. Klik Tambah untuk membuat.
          </p>
        ) : (
          <ul className="flex flex-col">
            {experiences.map((item, index) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {item.role.en || item.role.id || "—"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {item.company}
                    {item.period.en || item.period.id
                      ? ` · ${item.period.en || item.period.id}`
                      : ""}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => move(index, -1)}
                    disabled={pending || index === 0}
                    aria-label={`Naikkan ${item.company}`}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => move(index, 1)}
                    disabled={pending || index === experiences.length - 1}
                    aria-label={`Turunkan ${item.company}`}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => openEdit(item)}
                    disabled={pending || editing}
                    aria-label={`Edit ${item.company}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => remove(item.id, item.company)}
                    disabled={pending || editing}
                    aria-label={`Hapus ${item.company}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {!editing && message ? (
        <p
          role={message.ok ? "status" : "alert"}
          className={message.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}