import { createSkill } from "@/app/dashboard/actions";
import { SkillsManager } from "@/components/dashboard/skills-manager";
import { listSkills } from "@/lib/data/dashboard";

export const metadata = { title: "Skills" };

export default async function SkillsPage() {
  const skills = await listSkills();

  async function handleCreate(input: { id: string; name: string; category: string }) {
    "use server";
    await createSkill({
      ...input,
      order: skills.length,
      category: input.category as "Frontend" | "Backend" | "Database" | "Design" | "Tools" | "Lainnya",
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Urutan skill dipakai untuk techStack setiap project.
        </p>
      </div>

      <SkillsManager
        skills={skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          order: skill.order,
          projectCount: skill._count.projects,
        }))}
        onCreate={handleCreate}
      />
    </main>
  );
}