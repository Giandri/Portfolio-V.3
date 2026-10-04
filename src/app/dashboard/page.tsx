import Link from "next/link";
import { ExternalLink, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";

type Counts = {
  projects: number;
  publishedProjects: number;
  skills: number;
  experiences: number;
  profile: number;
};

async function getCounts(): Promise<Counts | null> {
  try {
    const [projects, publishedProjects, skills, experiences, profile] =
      await Promise.all([
        db.project.count(),
        db.project.count({ where: { status: "PUBLISHED" } }),
        db.skill.count(),
        db.experience.count(),
        db.profile.count(),
      ]);

    return { projects, publishedProjects, skills, experiences, profile };
  } catch {
    return null;
  }
}

const MODULES: { title: string; href?: string; count?: (c: Counts) => number; description: string }[] = [
  {
    title: "Profile",
    count: (c) => c.profile,
    description: "Nama, headline, bio, foto, dan link CV.",
  },
  {
    title: "Projects",
    count: (c) => c.projects,
    description: "Project portfolio beserta tech stack.",
  },
  {
    title: "Skills",
    count: (c) => c.skills,
    description: "Daftar teknologi yang dikuasai.",
  },
  {
    title: "Experience",
    count: (c) => c.experiences,
    description: "Riwayat pendidikan dan pengalaman.",
  },
];

export default async function DashboardPage() {
  const counts = await getCounts();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan konten portfolio. Modul CRUD arrive di Fase 3.
        </p>
      </div>

      {counts === null ? (
        <Card>
          <CardHeader>
            <CardTitle>Database tidak terjangkau</CardTitle>
            <CardDescription>
              Cek `DATABASE_URL` lalu muat ulang halaman ini.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((module) => (
            <Card key={module.title}>
              <CardHeader>
                <CardDescription>{module.title}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {module.count?.(counts) ?? 0}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {counts ? (
        <p className="text-sm text-muted-foreground">
          {counts.publishedProjects} dari {counts.projects} project sudah
          tayang di halaman publik.
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lihat Portfolio</CardTitle>
            <CardDescription>
              Buka halaman publik untuk melihat hasil perubahan konten.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button asChild className="rounded-full">
              <Link href="/" target="_blank">
                Buka portfolio
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tambah Project</CardTitle>
            <CardDescription>
              Form project dengan tab ID | EN tersedia di Fase 3.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button disabled className="rounded-full">
              <PlusCircle className="size-4" />
              Segera
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}