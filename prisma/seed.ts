import { Prisma, PrismaClient, Status } from "@prisma/client";
import { en } from "../src/locales/en";
import { id } from "../src/locales/id";

const db = new PrismaClient();

const local = (idText: string, enText: string) => ({ id: idText, en: enText });
const localList = (idList: string[], enList: string[]) => ({ id: idList, en: enList });

// Metadata project lives in WorksScreen.tsx (titles, video, tech stack, links);
// descriptions come from locales. Kept as literals here so the seed is self-contained.
const projectMeta = [
  {
    key: "loggsMaps",
    title: "Loggs Maps",
    videoUrl: "https://assets.giandri.my.id/loggs-map.mp4",
    demoUrl: "https://maps.loggsvisual.com",
    techStack: ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL", "Prisma", "Leaflet"],
  },
  {
    key: "loggsVisual",
    title: "Loggs Visual Profile",
    videoUrl: "https://assets.giandri.my.id/loggs.mp4",
    demoUrl: "https://www.loggsvisual.com",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"],
  },
  {
    key: "bwsPortal",
    title: "Service Public Portal BWS Babel",
    videoUrl: "https://assets.giandri.my.id/portal-bwsbabel.mp4",
    demoUrl: "https://portal-pelayanan-publik.vercel.app",
    techStack: ["Next.js", "TailwindCSS", "Node.js", "Axios", "Typescript", "PostgreSQL", "Prisma"],
  },
  {
    key: "absenBws",
    title: "Attendance Management BWS Babel",
    videoUrl: "https://assets.giandri.my.id/absen-bws.mp4",
    demoUrl: null,
    techStack: ["Next.js", "TailwindCSS", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI", "Leaflet"],
  },
  {
    key: "ptBsm",
    title: "PT.BSM",
    videoUrl: "https://assets.giandri.my.id/ptbsm1.mp4",
    demoUrl: "https://bsmbabel.vercel.app",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "Shadcn UI", "Framer Motion"],
  },
] as const;

// techStack di locales dan techStack per project memakai ejaan berbeda untuk tools yang sama.
const SKILL_ALIASES: Record<string, string> = {
  React: "React.js",
  TailwindCSS: "Tailwind CSS",
  Typescript: "TypeScript",
};

const canon = (name: string) => SKILL_ALIASES[name] ?? name;

async function seed() {
  await db.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitle: "Giandri | Portfolio",
      description: Prisma.DbNull,
    },
  });

  await db.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Giandri Aditio",
      headline: local(id.roleSubtitle, en.roleSubtitle),
      roles: localList(id.roles, en.roles),
      location: local(
        id.fromLocation.replace(/^\(dari\s|\)$/g, ""),
        en.fromLocation.replace(/^\(from\s|\)$/g, ""),
      ),
      longBio: local(id.bioP1, en.bioP1),
      publicEmail: "halo@giandri.my.id",
      resumeUrl: "/resume.pdf",
      resumeFileName: "Giandri-Aditio-CV.pdf",
      avatarUrl: "/images/fotocv.jpg",
      greetingOpening: local(id.dearVisitor, en.dearVisitor),
      greetingClosing: local(id.warmly, en.warmly),
      ctaLabel: local(id.getInTouch, en.getInTouch),
    },
  });

  const names = [
  ...new Set([...en.techStack, ...projectMeta.flatMap((p) => [...p.techStack])].map(canon)),
].sort((a, b) => a.localeCompare(b));

  await db.skill.deleteMany();
  for (const [order, name] of names.entries()) {
    await db.skill.create({ data: { name, order } });
  }

  await db.project.deleteMany();
  for (const [order, meta] of projectMeta.entries()) {
    await db.project.create({
      data: {
        title: local(meta.title, meta.title),
        summary: local(id.projects[meta.key as keyof typeof id.projects], en.projects[meta.key as keyof typeof en.projects]),
        videoUrl: meta.videoUrl,
        demoUrl: meta.demoUrl,
        status: Status.PUBLISHED,
        order,
        skills: { connect: [...new Set(meta.techStack.map(canon))].map((name) => ({ name })) },
      },
    });
  }

  await db.experience.deleteMany();
  for (const [order, item] of en.experience.entries()) {
    const idItem = id.experience[order];
    await db.experience.create({
      data: {
        company: item.org,
        role: local(idItem.title, item.title),
        period: local(idItem.period, item.period),
        bullets: localList(idItem.bullets, item.bullets),
        order,
      },
    });
  }

  const [profile, projects, skillsCount, experiences] = await Promise.all([
    db.profile.count(),
    db.project.count(),
    db.skill.count(),
    db.experience.count(),
  ]);
  console.log(`Seeded: profile=${profile} projects=${projects} skills=${skillsCount} experience=${experiences}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());