import { ProjectsManager } from "@/components/dashboard/projects-manager";
import { listProjects, listSkills } from "@/lib/data/dashboard";
import type { Localized } from "@/lib/validations/localized";

export const metadata = { title: "Projects" };

function asLocalized(value: unknown): Localized {
  if (value && typeof value === "object") {
    const record = value as { id?: unknown; en?: unknown };
    return {
      id: typeof record.id === "string" ? record.id : "",
      en: typeof record.en === "string" ? record.en : "",
    };
  }
  return { id: "", en: "" };
}

export default async function ProjectsPage() {
  const [projects, skills] = await Promise.all([listProjects(), listSkills()]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hanya project berstatus Published yang tampil di halaman publik.
        </p>
      </div>

      <ProjectsManager
        projects={projects.map((project) => ({
          id: project.id,
          slug: project.slug,
          title: asLocalized(project.title),
          summary: asLocalized(project.summary),
          thumbnail: project.thumbnail ?? "",
          videoUrl: project.videoUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          featured: project.featured,
          status: project.status,
          order: project.order,
          skillIds: project.skills.map((entry) => entry.skillId),
        }))}
        skills={skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
        }))}
      />
    </main>
  );
}