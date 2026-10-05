"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel } from "@/components/dashboard/panel";
import { deleteSkill, reorderSkills, updateSkill } from "@/app/dashboard/actions";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Design",
  "Tools",
  "Lainnya",
] as const;

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  order: number;
  projectCount: number;
};

export function SkillsManager({
  skills,
  onCreate,
}: {
  skills: SkillRow[];
  onCreate: (input: { id: string; name: string; category: string }) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", category: "Lainnya" });
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<string>("Lainnya");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    const next = [...skills];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderSkills(next.map((skill) => skill.id));
    });
  }

  function saveEdit(id: string) {
    startTransition(async () => {
      const result = await updateSkill(id, {
        id,
        name: draft.name,
        category: draft.category as (typeof CATEGORIES)[number],
        order: 0,
      });
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) setEditingId(null);
    });
  }

  function remove(id: string, name: string) {
    if (!window.confirm(`Hapus skill "${name}"? Relasi dari project ikut dilepas.`)) return;
    startTransition(async () => {
      const result = await deleteSkill(id);
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  function add() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      await onCreate({ id: name, name, category: newCategory });
      setNewName("");
      setMessage(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Tambah skill" description="Nama unik, dikelompokkan per kategori.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="new-skill">Nama</Label>
            <Input
              id="new-skill"
              className="h-8"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="React.js"
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-44">
            <Label htmlFor="new-category">Kategori</Label>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger id="new-category" className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={add} disabled={pending || !newName.trim()}>
            <Plus className="size-4" />
            Tambah
          </Button>
        </div>
      </Panel>

      <Panel
        title="Skill"
        description={`${skills.length} skill. Urutan dipakai untuk techStack setiap project.`}
      >
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada skill. Tambahkan di atas.
          </p>
        ) : (
          <ul className="flex flex-col">
            {skills.map((skill, index) => (
              <li
                key={skill.id}
                className="flex flex-col gap-2 border-b border-border py-2 last:border-b-0 sm:flex-row sm:items-center"
              >
                {editingId === skill.id ? (
                  <>
                    <Input
                      className="h-8 flex-1"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                    <Select
                      value={draft.category}
                      onValueChange={(value) =>
                        setDraft((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="h-8 sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => saveEdit(skill.id)} disabled={pending}>
                      Simpan
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => setEditingId(null)}
                      disabled={pending}
                      aria-label="Batal"
                    >
                      <X className="size-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.category} ·{" "}
                        {skill.projectCount > 0
                          ? `dipakai di ${skill.projectCount} project`
                          : "belum dipakai"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => move(index, -1)}
                        disabled={pending || index === 0}
                        aria-label={`Naikkan ${skill.name}`}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => move(index, 1)}
                        disabled={pending || index === skills.length - 1}
                        aria-label={`Turunkan ${skill.name}`}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => {
                          setEditingId(skill.id);
                          setDraft({ name: skill.name, category: skill.category });
                        }}
                        disabled={pending}
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => remove(skill.id, skill.name)}
                        disabled={pending}
                        aria-label={`Hapus ${skill.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {message ? (
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