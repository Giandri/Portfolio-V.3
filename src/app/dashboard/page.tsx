import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/panel";
import { StatFigure, StatRow } from "@/components/dashboard/stat";
import { db } from "@/lib/db";

type Counts = {
  projects: number;
  publishedProjects: number;
  skills: number;
  experiences: number;
};

async function getCounts(): Promise<Counts | null> {
  try {
    const [projects, publishedProjects, skills, experiences] = await Promise.all([
      db.project.count(),
      db.project.count({ where: { status: "PUBLISHED" } }),
      db.skill.count(),
      db.experience.count(),
    ]);

    return { projects, publishedProjects, skills, experiences };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const counts = await getCounts();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan konten portfolio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/projects">
              <ExternalLink className="size-4" />
              Kelola project
            </Link>
          </Button>
        </div>
      </div>

      {counts === null ? (
        <Panel
          title="Database tidak terjangkau"
          description="Periksa DATABASE_URL lalu muat ulang halaman ini."
        >
          <p className="text-sm text-muted-foreground">
            Isi DATABASE_URL di .env lalu jalankan migrasi.
          </p>
        </Panel>
      ) : (
        <>
          <div className="rounded-md border border-border bg-card p-6">
            <StatRow>
              <StatFigure
                index={1}
                value={counts.publishedProjects}
                label="Project tayang"
              />
              <StatFigure index={2} value={counts.projects} label="Project total" />
              <StatFigure index={3} value={counts.skills} label="Skill" />
              <StatFigure index={4} value={counts.experiences} label="Experience" />
            </StatRow>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Project"
              description={`${counts.publishedProjects} dari ${counts.projects} project sudah tayang di halaman publik.`}
              className="lg:col-span-2"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/projects">Kelola</Link>
                </Button>
              }
            >
              <ul className="flex flex-col gap-3">
                <Feature
                  title="Slug & status"
                  desc="Slug dibuat otomatis dari judul. Hanya status published yang tampil di halaman publik."
                />
                <Feature
                  title="Featured"
                  desc="Tandai project unggulan agar mudah ditemukan saat menambah konten baru."
                />
                <Feature
                  title="Tech stack"
                  desc="Relasi ke Skill, urutan mengikuti urutan pilihan di form."
                />
              </ul>
            </Panel>

            <Panel title="Pintasan cepat">
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/">Lihat portfolio</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/dashboard/profile">Kelola profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/dashboard/skills">Kelola skills</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  disabled
                >
                  Experience (Fase 4)
                </Button>
              </div>
            </Panel>
          </div>
        </>
      )}
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex flex-col gap-1">
      <span className="flex items-start gap-2 text-sm font-medium">
        <span aria-hidden="true" className="text-faint">
          [*]
        </span>
        {title}
      </span>
      <span className="pl-6 text-xs leading-relaxed text-muted-foreground">
        {desc}
      </span>
    </li>
  );
}