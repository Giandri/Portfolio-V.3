"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { localizedSchema, localizedListSchema } from "@/lib/validations/localized";

const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Design",
  "Tools",
  "Lainnya",
] as const;

const skillInput = z.object({
  id: z.string().min(1, "ID skill wajib diisi").max(80),
  name: z.string().min(1, "Nama skill wajib diisi").max(80),
  category: z.enum(SKILL_CATEGORIES),
  order: z.number().int().min(0),
});

const projectInput = z.object({
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  title: localizedSchema,
  summary: localizedSchema,
  thumbnail: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  demoUrl: z.string().trim().optional(),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int().min(0),
  skillIds: z.array(z.string()),
});

const profileInput = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(120),
  headline: localizedSchema,
  roles: z.object({ id: z.array(z.string()), en: z.array(z.string()) }),
  location: localizedSchema,
  longBio: localizedSchema,
  publicEmail: z.string().trim().email("Email tidak valid").optional().or(z.literal("")),
  resumeUrl: z.string().trim().optional(),
  resumeFileName: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  greetingOpening: localizedSchema,
  greetingClosing: localizedSchema,
  ctaLabel: localizedSchema,
});

const experienceInput = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi").max(120),
  role: localizedSchema,
  period: localizedSchema,
  bullets: localizedListSchema,
  order: z.number().int().min(0),
});

const siteSettingInput = z.object({
  siteTitle: z.string().min(1, "Judul situs wajib diisi").max(120),
  description: localizedSchema,
  ogImage: z.string().trim().optional(),
  favicon: z.string().trim().optional(),
  siteUrl: z.string().trim().optional(),
});

export type ActionState = { ok: boolean; message: string };

function fail(message: string): ActionState {
  return { ok: false, message };
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/skills");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/experience");
  revalidatePath("/dashboard/settings");
}

function firstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid.";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createSkill(input: z.input<typeof skillInput>): Promise<ActionState> {
  await requireAdmin();
  const parsed = skillInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const { id, name, category, order } = parsed.data;
  const existing = await db.skill.findFirst({
    where: { OR: [{ name }, { id }] },
    select: { name: true },
  });
  if (existing) return fail(`Skill "${name}" sudah ada.`);

  await db.skill.create({ data: { id, name, category, order } });
  revalidatePublic();
  return { ok: true, message: `Skill "${name}" ditambahkan.` };
}

export async function updateSkill(
  originalId: string,
  input: z.input<typeof skillInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = skillInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const { id, name, category, order } = parsed.data;
  const clash = await db.skill.findFirst({
    where: { name, NOT: { id: originalId } },
    select: { id: true },
  });
  if (clash) return fail(`Skill "${name}" sudah dipakai skill lain.`);

  await db.skill.update({
    where: { id: originalId },
    data: { id, name, category, order },
  });
  revalidatePublic();
  return { ok: true, message: `Skill "${name}" diperbarui.` };
}

export async function deleteSkill(id: string): Promise<ActionState> {
  await requireAdmin();
  await db.skill.delete({ where: { id } });
  revalidatePublic();
  return { ok: true, message: "Skill dihapus." };
}

export async function reorderSkills(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  await db.$transaction(
    ids.map((id, index) => db.skill.update({ where: { id }, data: { order: index } })),
  );
  revalidatePublic();
  return { ok: true, message: "Urutan skill disimpan." };
}

export async function createProject(
  input: z.input<typeof projectInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const data = parsed.data;
  const slug = data.slug || slugify(data.title.en || data.title.id);
  const clash = await db.project.findUnique({ where: { slug }, select: { id: true } });
  if (clash) return fail(`Slug "${slug}" sudah dipakai project lain.`);

  await db.project.create({
    data: {
      slug,
      title: data.title,
      summary: data.summary,
      thumbnail: data.thumbnail || null,
      videoUrl: data.videoUrl || null,
      demoUrl: data.demoUrl || null,
      featured: data.featured,
      status: data.status,
      order: data.order,
      skills: {
        create: data.skillIds.map((skillId, order) => ({ skillId, order })),
      },
    },
  });

  revalidatePublic();
  return { ok: true, message: `Project "${slug}" dibuat.` };
}

export async function updateProject(
  id: string,
  input: z.input<typeof projectInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const data = parsed.data;
  const slug = data.slug || slugify(data.title.en || data.title.id);
  const clash = await db.project.findUnique({ where: { slug }, select: { id: true } });
  if (clash && clash.id !== id) return fail(`Slug "${slug}" sudah dipakai project lain.`);

  await db.project.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      summary: data.summary,
      thumbnail: data.thumbnail || null,
      videoUrl: data.videoUrl || null,
      demoUrl: data.demoUrl || null,
      featured: data.featured,
      status: data.status,
      order: data.order,
    },
  });

  await db.projectSkill.deleteMany({ where: { projectId: id } });
  if (data.skillIds.length) {
    await db.projectSkill.createMany({
      data: data.skillIds.map((skillId, order) => ({ projectId: id, skillId, order })),
    });
  }

  revalidatePublic();
  return { ok: true, message: `Project "${slug}" diperbarui.` };
}

export async function deleteProject(id: string): Promise<ActionState> {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  revalidatePublic();
  return { ok: true, message: "Project dihapus." };
}

export async function reorderProjects(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  await db.$transaction(
    ids.map((id, index) => db.project.update({ where: { id }, data: { order: index } })),
  );
  revalidatePublic();
  return { ok: true, message: "Urutan project disimpan." };
}

export async function updateProfile(
  input: z.input<typeof profileInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = profileInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const data = parsed.data;
  await db.profile.update({
    where: { id: "singleton" },
    data: {
      name: data.name,
      headline: data.headline,
      roles: data.roles,
      location: data.location,
      longBio: data.longBio,
      publicEmail: data.publicEmail || null,
      resumeUrl: data.resumeUrl || null,
      resumeFileName: data.resumeFileName || null,
      avatarUrl: data.avatarUrl || null,
      greetingOpening: data.greetingOpening,
      greetingClosing: data.greetingClosing,
      ctaLabel: data.ctaLabel,
    },
  });

  revalidatePublic();
  return { ok: true, message: "Profil diperbarui." };
}

export async function createExperience(
  input: z.input<typeof experienceInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = experienceInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const { company, role, period, bullets, order } = parsed.data;
  await db.experience.create({ data: { company, role, period, bullets, order } });

  revalidatePublic();
  return { ok: true, message: `Experience di ${company} ditambahkan.` };
}

export async function updateExperience(
  id: string,
  input: z.input<typeof experienceInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = experienceInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const { company, role, period, bullets, order } = parsed.data;
  await db.experience.update({
    where: { id },
    data: { company, role, period, bullets, order },
  });

  revalidatePublic();
  return { ok: true, message: `Experience di ${company} diperbarui.` };
}

export async function deleteExperience(id: string): Promise<ActionState> {
  await requireAdmin();
  await db.experience.delete({ where: { id } });
  revalidatePublic();
  return { ok: true, message: "Experience dihapus." };
}

export async function reorderExperiences(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  await db.$transaction(
    ids.map((id, index) => db.experience.update({ where: { id }, data: { order: index } })),
  );
  revalidatePublic();
  return { ok: true, message: "Urutan experience disimpan." };
}

export async function updateSiteSetting(
  input: z.input<typeof siteSettingInput>,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = siteSettingInput.safeParse(input);
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const data = parsed.data;
  const payload = {
    siteTitle: data.siteTitle,
    description: data.description,
    ogImage: data.ogImage || null,
    favicon: data.favicon || null,
    siteUrl: data.siteUrl || null,
  };

  // Upsert supaya dashboard tetap jalan walau seed belum pernah dijalankan.
  await db.siteSetting.upsert({
    where: { id: "singleton" },
    update: payload,
    create: { id: "singleton", ...payload },
  });

  revalidatePublic();
  return { ok: true, message: "Pengaturan situs disimpan." };
}