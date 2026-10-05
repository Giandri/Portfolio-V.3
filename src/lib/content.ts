import { db } from "./db";

/**
 * Semua konten editable untuk situs publik, diambil satu kali di server lalu
 * diteruskan ke client lewat `LanguageProvider`.
 *
 * Kedua varian bahasa ikut diambil sekaligus, jadi client cukup memilih dengan
 * `pickLocalized`/`pickLocalizedList` — ganti bahasa tetap instan tanpa query ulang.
 */
export async function getSiteContent() {
  const [profile, projects, skills, experiences, siteSetting] = await Promise.all([
    db.profile.findUnique({ where: { id: "singleton" } }),
    db.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: { order: "asc" },
          select: { order: true, skill: true },
        },
      },
    }),
    db.skill.findMany({ orderBy: { order: "asc" } }),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.siteSetting.findUnique({ where: { id: "singleton" } }),
  ]);

  return { profile, projects, skills, experiences, siteSetting };
}

export type SiteContent = Awaited<ReturnType<typeof getSiteContent>>;