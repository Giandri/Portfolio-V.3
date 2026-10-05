import { Prisma, PrismaClient, Status } from "@prisma/client";

const db = new PrismaClient();

const local = (idText: string, enText: string) => ({ id: idText, en: enText });
const localList = (idList: string[], enList: string[]) => ({ id: idList, en: enList });

// Semua konten di bawah adalah sumber kebenaran awal. Setelah di-seed, konten dikelola
// lewat Prisma Studio (`npm run db:studio`) atau dashboard admin.

const PROFILE = {
  name: "Giandri Aditio",
  headline: local("Full-Stack Developer", "Full-Stack Developer"),
  roles: localList(
    ["Web Developer", "Desain Grafis", "Penggemar Kopi"],
    ["Web Developer", "Graphic Designer", "Coffeeholic"],
  ),
  location: local("pvnkalpinang", "pvnkalpinang"),
  longBio: local(
    "— Sebagai Junior Full-Stack Developer dengan pengalaman 1 tahun dalam pengembangan aplikasi web, saya bekerja dengan stack modern seperti React.js dan Next.js untuk front end, serta Node.js dan PostgreSQL untuk back end. Saya memanfaatkan Git Version Control dan RESTful API, sambil terus menerapkan standar kode yang bersih, berkolaborasi dalam tim, dan cepat beradaptasi dengan stack pengembangan yang terus berkembang. Selain itu, saya juga mengelola website portofolio pribadi yang menampilkan berbagai proyek untuk menunjukkan kemampuan saya di sisi pengembangan client-side dan server-side.",
    "— As a Junior Full-Stack Developer with 1 year of experience in web application development, I have been working with a modern stack such as React.js and Next.js for the front end, alongside Node.js and PostgreSQL for the back end. I have been utilizing Git Version Control and RESTful API, while continuously applying clean code standards, collaborating within teams, and adapting quickly to evolving development stacks. Additionally, I have been maintaining a personal portfolio website that showcases full range of projects to demonstrate my capabilities in both client-side and server-side development.",
  ),
  publicEmail: "halo@giandri.my.id",
  resumeUrl: "/resume.pdf",
  resumeFileName: "Giandri-Aditio-CV.pdf",
  avatarUrl: "/images/fotocv.jpg",
  greetingOpening: local("pengunjung yang terhormat,", "dear visitor,"),
  greetingClosing: local("dengan hangat,", "warmly,"),
  ctaLabel: local("Hubungi saya", "Get in touch"),
};

const TECH_STACK = [
  "React.js",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "TypeScript",
  "Prisma",
  "Git",
  "Framer Motion",
];

const PROJECTS = [
  {
    title: "Loggs Maps",
    summary: local(
      "Fullstack Web — Loggs Maps adalah aplikasi pemetaan interaktif yang menghubungkan pecinta kopi dengan kafe terbaik di sekitar. Filter berdasarkan lokasi, telusuri ulasan, dan jelajahi — semuanya dalam satu tempat.",
      "Fullstack Web — Loggs Maps is an interactive mapping app that connects coffee lovers with the best cafés nearby. Filter by location, browse reviews, and explore — all in one place.",
    ),
    videoUrl: "https://assets.giandri.my.id/loggs-map.mp4",
    demoUrl: "https://maps.loggsvisual.com",
    techStack: ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL", "Prisma", "Leaflet"],
  },
  {
    title: "Loggs Visual Profile",
    summary: local(
      "Frontend Website — Web profil  Loggs Visual. Animasi halus, tata letak modern, dan penceritaan yang disengaja menghidupkan merek sejak guliran pertama.",
      "Frontend Website — this company profile website was built to make Loggs Visual unforgettable. Smooth animations, a modern layout, and intentional storytelling bring the brand to life from the first scroll.",
    ),
    videoUrl: "https://assets.giandri.my.id/loggs.mp4",
    demoUrl: "https://www.loggsvisual.com",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"],
  },
  {
    title: "Service Public Portal BWS Babel",
    summary: local(
      "Fullstack Web — Portal resmi BWS ini memudahkan akses informasi dan pengajuan layanan publik dengan cara yang cepat, transparan, dan mudah diakses.",
      "A Fullstack Web — this official BWS portal makes it easy to access information and submit public service requests in a fast, transparent, and accessible way.",
    ),
    videoUrl: "https://assets.giandri.my.id/portal-bwsbabel.mp4",
    demoUrl: "https://portal-pelayanan-publik.vercel.app",
    techStack: ["Next.js", "TailwindCSS", "Node.js", "Axios", "Typescript", "PostgreSQL", "Prisma"],
  },
  {
    title: "Attendance Management BWS Babel",
    summary: local(
      "Fullstack Web — Aplikasi Absensi adalah sistem kehadiran berbasis web yang menyederhanakan check-in, menghasilkan laporan real-time, dan menjaga jadwal karyawan tetap terorganisir dalam satu dasbor yang bersih.",
      "A Fullstack Web — aAbsence is a web-based attendance system that simplifies check-ins, generates real-time reports, and keeps employee schedules organized in one clean dashboard.",
    ),
    videoUrl: "https://assets.giandri.my.id/absen-bws.mp4",
    demoUrl: null,
    techStack: ["Next.js", "TailwindCSS", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI", "Leaflet"],
  },
  {
    title: "PT.BSM",
    summary: local(
      "Frontend Website — Web profil perusahaan ini memadukan desain elegan dengan performa halus. Animasi bersih dan konten terstruktur dengan baik membangun kepercayaan klien sejak kunjungan pertama.",
      "A Frontend Website — this company profile site blends elegant design with smooth performance. Clean animations and well-structured content build client trust from the very first visit.",
    ),
    videoUrl: "https://assets.giandri.my.id/ptbsm1.mp4",
    demoUrl: "https://bsmbabel.vercel.app",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "Shadcn UI", "Framer Motion"],
  },
];

const EXPERIENCES = [
  {
    company: "BWS Bangka Belitung (Internship)",
    role: local("IT Specialist", "IT Specialist"),
    period: local("Nov 2025 – Mei 2026", "Nov 2025 – May 2026"),
    bullets: localList(
      [
        "Membangun dan mengoptimalkan aplikasi absensi magang berbasis web serta portal layanan publik menggunakan Next.js dan PostgreSQL.",
        "Mengoptimalkan dasbor HR untuk memperlancar pelacakan mentor dan meningkatkan produktivitas operasional hingga 80%.",
        "Merancang dan mengimplementasikan infrastruktur jaringan Mesh Wi-Fi untuk memperluas cakupan konektivitas kantor hingga 95%.",
      ],
      [
        "Have been building and optimizing a web-based internship attendance app and public service portal using Next.js and PostgreSQL.",
        "Optimized the HR dashboard to streamline mentor tracking and boost operational productivity by up to 80%.",
        "Designed and implemented Mesh Wi-Fi network infrastructure to expand office connectivity coverage up to 95%.",
      ],
    ),
  },
  {
    company: "PT. Mutiara Lab Mandiri (Internship)",
    role: local("Web Developer", "Web Developer"),
    period: local("Nov 2025 – Mei 2026", "Nov 2025 – May 2026"),
    bullets: localList(
      [
        "Merancang dan membangun website profil perusahaan resmi menggunakan Next.js dan pustaka komponen Shadcn/UI.",
        "Menerapkan Algoritma Greedy untuk pemetaan rute optimal guna meningkatkan kunjungan klien ke lokasi lab sebesar 60%.",
      ],
      [
        "Have been designing and constructing the official company profile website utilizing Next.js and the Shadcn/UI component library.",
        "Applied the Greedy Algorithm for optimal route mapping to increase client visits to the lab location by 60%.",
      ],
    ),
  },
  {
    company: "PT. Yunta Mandiri (MSIB batch 6)",
    role: local("Fullstack Web Development", "Fullstack Web Development"),
    period: local("Feb 2024 – Jun 2024", "Feb 2024 – Jun 2024"),
    bullets: localList(
      [
        "Menguasai keterampilan inti pengembangan web full-stack menggunakan HTML, CSS, JavaScript, PHP, dan framework Laravel.",
        "Memanfaatkan Git untuk alur kerja version control dan Vercel untuk deployment aplikasi yang berkelanjutan.",
        "Memimpin tim pengembangan front-end untuk proyek capstone pemesanan lapangan futsal yang dibangun dengan Laravel dan MySQL.",
      ],
      [
        "Have been acquiring and mastering core full-stack web development skills using HTML, CSS, JavaScript, PHP, and the Laravel framework.",
        "Utilized Git for version control workflows and Vercel for continuous application deployment.",
        "Lead the front-end development team for a futsal court booking capstone project built with Laravel and MySQL.",
      ],
    ),
  },
];

// techStack profil dan techStack per project memakai ejaan berbeda untuk tools yang sama.
const SKILL_ALIASES: Record<string, string> = {
  React: "React.js",
  TailwindCSS: "Tailwind CSS",
  Typescript: "TypeScript",
};

const canon = (name: string) => SKILL_ALIASES[name] ?? name;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
    create: { id: "singleton", ...PROFILE },
  });

  const names = [...new Set([...TECH_STACK, ...PROJECTS.flatMap((p) => [...p.techStack])].map(canon))].sort((a, b) =>
    a.localeCompare(b),
  );

  await db.skill.deleteMany();
  for (const [order, name] of names.entries()) {
    await db.skill.create({ data: { name, order } });
  }

  await db.project.deleteMany();
  for (const [order, project] of PROJECTS.entries()) {
    await db.project.create({
      data: {
        slug: slugify(project.title),
        title: local(project.title, project.title),
        summary: project.summary,
        videoUrl: project.videoUrl,
        demoUrl: project.demoUrl,
        status: Status.PUBLISHED,
        order,
        skills: {
          create: [...new Set(project.techStack.map(canon))].map((name, skillOrder) => ({
            order: skillOrder,
            skill: { connect: { name } },
          })),
        },
      },
    });
  }

  await db.experience.deleteMany();
  for (const [order, experience] of EXPERIENCES.entries()) {
    await db.experience.create({ data: { ...experience, order } });
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
