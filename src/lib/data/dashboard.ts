import { db } from "@/lib/db";

/**
 * Data access layer untuk halaman dashboard (Fase 3).
 *
 * Berbeda dengan `src/lib/content.ts` yang hanya membaca konten PUBLISHED
 * untuk situs publik, modul di sini memakai `include`/`orderBy` yang kaya
 * karena dashboard butuh seluruh field termasuk yang draft.
 */

export async function listProjects() {
  return db.project.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: { order: "asc" },
        select: { order: true, skillId: true, skill: true },
      },
    },
  });
}

export async function getProject(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      skills: {
        orderBy: { order: "asc" },
        select: { order: true, skillId: true, skill: true },
      },
    },
  });
}

export async function listSkills() {
  return db.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { _count: { select: { projects: true } } },
  });
}

export async function getProfile() {
  return db.profile.findUnique({ where: { id: "singleton" } });
}

export type DashboardProject = Awaited<ReturnType<typeof listProjects>>[number];
export type DashboardSkill = Awaited<ReturnType<typeof listSkills>>[number];