"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel } from "@/components/dashboard/panel";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { LocalizedInput } from "@/components/dashboard/localized-field";
import {
  createProject,
  deleteProject,
  reorderProjects,
  updateProject,
} from "@/app/dashboard/actions";
import type { Localized } from "@/lib/validations/localized";

export type SkillOption = { id: string; name: string; category: string };
export type ProjectRow = {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  thumbnail: string;
  videoUrl: string;
  demoUrl: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  order: number;
  skillIds: string[];
};

type FormState = {
  slug: string;
  title: Localized;
  summary: Localized;
  thumbnail: string;
  videoUrl: string;
  demoUrl: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  skillIds: string[];
};

const emptyForm: FormState = {
  slug: "",
  title: { id: "", en: "" },
  summary: { id: "", en: "" },
  thumbnail: "",
  videoUrl: "",
  demoUrl: "",
  featured: false,
  status: "DRAFT",
  skillIds: [],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectsManager({
  projects,
  skills,
}: {
  projects: ProjectRow[];
  skills: SkillOption[];
}) {
  const [pending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function openNew() {
    setForm({ ...emptyForm });
    setCreating(true);
    setOpenId(null);
    setMessage(null);
  }

  function openEdit(project: ProjectRow) {
    setForm({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      thumbnail: project.thumbnail,
      videoUrl: project.videoUrl,
      demoUrl: project.demoUrl,
      featured: project.featured,
      status: project.status,
      skillIds: project.skillIds,
    });
    setCreating(false);
    setOpenId(project.id);
    setMessage(null);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Slug mengikuti judul selama belum diketik manual.
      if (key === "title") {
        const typed = (value as Localized).en || (value as Localized).id;
        const auto = slugify(prev.title.en || prev.title.id);
        if (!prev.slug || prev.slug === auto) next.slug = slugify(typed);
      }
      return next;
    });
  }

  function toggleSkill(skillId: string) {
    setForm((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId],
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const payload = {
        slug: form.slug,
        title: form.title,
        summary: form.summary,
        thumbnail: form.thumbnail,
        videoUrl: form.videoUrl,
        demoUrl: form.demoUrl,
        featured: form.featured,
        status: form.status,
        skillIds: form.skillIds,
      };

      const result =
        creating || openId === null
          ? await createProject({ ...payload, order: projects.length })
          : await updateProject(openId, { ...payload, order: projects.length });

      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) {
        setCreating(false);
        setOpenId(null);
      }
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderProjects(next.map((project) => project.id));
    });
  }

  function remove(id: string, slug: string) {
    if (!window.confirm(`Hapus project "${slug}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteProject(id);
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  const editing = creating || openId !== null;

  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <Panel
          title={creating ? "Project baru" : `Edit ${form.slug || "project"}`}
          action={
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => {
                setCreating(false);
                setOpenId(null);
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
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                className="h-8"
                value={form.slug}
                onChange={(event) => set("slug", slugify(event.target.value))}
                placeholder="loggs-maps"
              />
              <p className="text-xs text-muted-foreground">
                Otomatis dari judul, bisa diubah manual.
              </p>
            </div>

            <LocalizedInput
              label="Judul"
              value={form.title}
              onChange={(next) => set("title", next)}
              required
              placeholder="Loggs Maps"
            />

            <LocalizedInput
              label="Ringkasan"
              kind="textarea"
              rows={5}
              value={form.summary}
              onChange={(next) => set("summary", next)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-thumb">URL thumbnail</Label>
                <Input
                  id="project-thumb"
                  className="h-8"
                  value={form.thumbnail}
                  onChange={(event) => set("thumbnail", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-video">URL video</Label>
                <Input
                  id="project-video"
                  className="h-8"
                  value={form.videoUrl}
                  onChange={(event) => set("videoUrl", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-demo">URL demo</Label>
                <Input
                  id="project-demo"
                  className="h-8"
                  value={form.demoUrl}
                  onChange={(event) => set("demoUrl", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    set("status", value as "DRAFT" | "PUBLISHED")
                  }
                >
                  <SelectTrigger id="project-status" className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="project-featured"
                checked={form.featured}
                onCheckedChange={(checked) => set("featured", checked)}
              />
              <Label htmlFor="project-featured">Featured</Label>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tech stack</Label>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => {
                  const active = form.skillIds.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs transition-colors duration-[120ms] ${
                        active
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {active ? <Check className="size-3" /> : null}
                      {skill.name}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Urutan mengikuti urutan klik, dipakai di halaman publik.
              </p>
            </div>

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
        title="Project"
        description={`${projects.length} project. Hanya published yang tampil di halaman publik.`}
        action={
          <Button size="sm" onClick={openNew} disabled={pending || editing}>
            <Plus className="size-4" />
            Tambah
          </Button>
        }
      >
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada project. Klik Tambah untuk membuat.
          </p>
        ) : (
          <ul className="flex flex-col">
            {projects.map((project, index) => (
              <li
                key={project.id}
                className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {project.title.en || project.title.id || project.slug}
                    </span>
                    <StatusBadge
                      tone={project.status === "PUBLISHED" ? "success" : "neutral"}
                    >
                      {project.status === "PUBLISHED" ? "published" : "draft"}
                    </StatusBadge>
                    {project.featured ? (
                      <StatusBadge tone="brand">featured</StatusBadge>
                    ) : null}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    /{project.slug} · {project.skillIds.length} skill
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => move(index, -1)}
                    disabled={pending || index === 0}
                    aria-label={`Naikkan ${project.slug}`}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => move(index, 1)}
                    disabled={pending || index === projects.length - 1}
                    aria-label={`Turunkan ${project.slug}`}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => openEdit(project)}
                    disabled={pending || editing}
                    aria-label={`Edit ${project.slug}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => remove(project.id, project.slug)}
                    disabled={pending || editing}
                    aria-label={`Hapus ${project.slug}`}
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