"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skiper67 } from '../ui/skiper-ui/skiper67';
import { motion } from "framer-motion";
import { MorphingText } from '../ui/morphing-text';
import { Marquee } from '../ui/marquee';
import { ProgressiveBlur } from '../ui/progressive-blur';
import { useLanguage } from '@/context/language-provider';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-pulse font-mono text-muted-foreground">Loading 3D...</div>
    </div>
  ),
});

const projectsBase = [
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/loggs-map.mp4",
    title: "Loggs Maps",
    techStack: ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL", "Prisma", "Leaflet"],
    id: "loggsMaps",
    link: "https://maps.loggsvisual.com"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/loggs.mp4",
    title: "Loggs Visual Profile",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"],
    id: "loggsVisual",
    link: "https://www.loggsvisual.com"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/portal-bwsbabel.mp4",
    title: "Service Public Portal BWS Babel",
    techStack: ["Next.js", "TailwindCSS", "Node.js", "Axios", "Typescript", "PostgreSQL", "Prisma"],
    id: "bwsPortal",
    link: "https://portal-pelayanan-publik.vercel.app"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/absen-bws.mp4",
    title: " Attendance Management BWS Babel",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI", "Leaflet"],
    id: "absenBws"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/ptbsm1.mp4",
    title: "PT.BSM",
    techStack: ["Next.js", "TailwindCSS", "Typescript", "Shadcn UI", "Framer Motion"],
    id: "ptBsm",
    link: "https://bsmbabel.vercel.app"
  }
];

export function WorksScreen() {
  const { t } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(false);

  const projects = projectsBase.map(p => ({
    ...p,
    description: t.projects[p.id as keyof typeof t.projects]
  }));

  useEffect(() => {
    const checkDesktop = () => {
      const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      setIsDesktop(isLargeScreen && !isTouchDevice);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-background text-foreground transition-colors z-400 overflow-x-hidden md:overflow-hidden">

      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {isDesktop && (
          <Spline
            scene="https://prod.spline.design/1PUC3yoNBjKkfudo/scene.splinecode"
            className="w-full h-full pointer-events-auto"
          />
        )}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[12vw] lg:text-[10rem] leading-[0.8] font-bold text-black dark:text-white tracking-tighter fixed top-32 md:top-20  inset-x-0 z-[500] flex pointer-events-none"
      >
        <MorphingText
          texts={t.worksTitle}
          className="text-7xl sm:text-6xl lg:text-8xl"
        />
      </motion.h1>

      {/* Projects Container*/}
      <div className="relative z-[500] w-full pt-[30vh] md:pt-0 min-h-screen flex items-center justify-center pointer-events-none pb-40 md:pb-0 px-5 md:px-0">

        {/* MOBILE: 1 Column */}
        {!isDesktop && (
          <div className="flex flex-col items-center gap-8 w-full">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.5 + i * 0.1, duration: 1, ease: "easeIn" }}
                className="pointer-events-auto overflow-hidden w-[85vw] max-w-[360px] aspect-video shadow-2xl"
              >
                <Skiper67 {...p} />
              </motion.div>
            ))}
          </div>
        )}

        {/* DESKTOP: Marquee */}
        {isDesktop && (
          <div className="hidden md:flex w-full items-center pointer-events-auto overflow-hidden mt-[15vh] lg:mt-0 xl:mt-20 relative">
            <Marquee pauseOnHover className="[--duration:40s]" repeat={2}>
              {projects.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 1, ease: "easeIn" }}
                  className="overflow-hidden aspect-video md:w-[260px] md:h-[146px] lg:w-[320px] lg:h-[180px] mx-4 shrink-0 "
                >
                  <Skiper67 {...p} />
                </motion.div>
              ))}
            </Marquee>

            {/* Left and Right Progressive Blur Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 lg:w-48 z-10 pointer-events-none">
              <ProgressiveBlur direction="left" className="w-full h-full" blurIntensity={1} blurLayers={isDesktop ? 6 : 2} />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-48 z-10 pointer-events-none">
              <ProgressiveBlur direction="right" className="w-full h-full" blurIntensity={1} blurLayers={isDesktop ? 6 : 2} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
