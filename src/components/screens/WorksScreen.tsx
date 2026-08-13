"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Skiper67 } from "../ui/skiper-ui/skiper67";
import { useLanguage } from "@/context/language-provider";

const projectsBase = [
  {
    videoSrc: "https://assets.giandri.my.id/loggs-map.mp4",
    title: "Loggs Maps",
    techStack: ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL", "Prisma", "Leaflet"],
    id: "loggsMaps",
    link: "https://maps.loggsvisual.com",
  },
  {
    videoSrc: "https://assets.giandri.my.id/loggs.mp4",
    title: "Loggs Visual Profile",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"],
    id: "loggsVisual",
    link: "https://www.loggsvisual.com",
  },
  {
    videoSrc: "https://assets.giandri.my.id/portal-bwsbabel.mp4",
    title: "Service Public Portal BWS Babel",
    techStack: ["Next.js", "TailwindCSS", "Node.js", "Axios", "Typescript", "PostgreSQL", "Prisma"],
    id: "bwsPortal",
    link: "https://portal-pelayanan-publik.vercel.app",
  },
  {
    videoSrc: "https://assets.giandri.my.id/absen-bws.mp4",
    title: " Attendance Management BWS Babel",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI", "Leaflet"],
    id: "absenBws",
  },
  {
    videoSrc: "https://assets.giandri.my.id/ptbsm1.mp4",
    title: "PT.BSM",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "Shadcn UI", "Framer Motion"],
    id: "ptBsm",
    link: "https://bsmbabel.vercel.app",
  },
];

function useVideoAspect(src: string) {
  const [aspect, setAspect] = useState<string | undefined>();

  useEffect(() => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      if (v.videoWidth && v.videoHeight) setAspect(`${v.videoWidth} / ${v.videoHeight}`);
    };
    v.src = src;
  }, [src]);

  return aspect;
}

export function WorksScreen({ onClose, onActivate }: { onClose: () => void; onActivate?: () => void }) {
  const { t } = useLanguage();

  const projects = projectsBase.map((p) => ({
    ...p,
    description: t.projects[p.id as keyof typeof t.projects],
  }));

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-3 sm:p-6">
      {/* Blurred backdrop */}
      <div className="fixed inset-0 z-[90]  " />

      {/* macOS Window */}
      <div className="relative z-[100] w-[97vw] h-[90vh] max-w-[1200px] rounded-[10px] border border-white/25 bg-[#09090b] shadow-[1px_2px_3px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden text-white pointer-events-auto dark:border-black/25 dark:bg-[#EFEBEA] dark:text-black" onPointerDown={onActivate}>
        {/* Top Bar */}
        <nav className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/25 bg-[#09090b] dark:border-black/25 dark:bg-[#EFEBEA]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="group relative w-3 h-3 rounded-full bg-[#E06551] flex items-center justify-center hover:bg-[#d04d3a] outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="w-2 h-2 text-white/60 opacity-0 group-hover:opacity-100" strokeWidth={3} />
            </button>
            <span className="w-3 h-3 rounded-full bg-[#ECB948]" />
            <span className="w-3 h-3 rounded-full bg-[#62BB4B]" />
          </div>
          <h1 className="flex-1 text-[13px] font-medium leading-none tracking-tight text-center text-white/80 dark:text-black/80">Information about: Works</h1>
          <div className="w-3" />
        </nav>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-6 space-y-6">
          {/* Cover & Title */}
          <header className="flex items-center gap-3">
            <img src="/images/dock/works.png" alt="" className="w-12 h-12 object-contain rounded-[4px]" />
            <div className="min-w-0">
              <h2 className="text-[13px] font-bold leading-tight text-white dark:text-black">Works</h2>
              <p className="text-[13px] font-medium leading-tight text-white/60 dark:text-black/60">Recent Works</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p) => (
              <article key={p.id} className="flex flex-col gap-2">
                <div className="relative overflow-hidden aspect-video rounded-[10px] border border-white/10 bg-white/10 dark:border-black/10 dark:bg-black">
                  <Skiper67 {...p} />
                </div>
                <div className="flex items-start justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold leading-tight text-white dark:text-black">{p.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[11px] font-medium text-white/60 dark:text-black/60">
                          {tech}
                        </span>
                      ))}
                      {p.techStack.length > 4 && <span className="text-[11px] font-medium text-white/40 dark:text-black/40">+{p.techStack.length - 4}</span>}
                    </div>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[11px] font-medium text-white/80 underline underline-offset-2 hover:text-white dark:text-black/80 dark:hover:text-black">
                      Visit
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
