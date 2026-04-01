"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skiper67 } from '../ui/skiper-ui/skiper67';
import { motion } from "framer-motion";
import { MorphingText } from '../ui/morphing-text';
import { Marquee } from '../ui/marquee';
import { ProgressiveBlur } from '../ui/progressive-blur';

// Dynamic import Spline to avoid async component error in client component
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-pulse font-mono text-muted-foreground">Loading 3D...</div>
    </div>
  ),
});

const projects = [
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/loggs-map.mp4",
    title: "Loggs Maps",
    techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "Prisma"],
    description: "Fullstack Web — Loggs Maps is an interactive mapping app that connects coffee lovers with the best cafés nearby. Filter by location, browse reviews, and explore — all in one place.",
    link: "https://maps.loggsvisual.com"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/loggs.mp4",
    title: "Loggs Visual Profile",
    techStack: ["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"],
    description: "Frontend Website —  this company profile website was built to make Loggs Visual unforgettable. Smooth animations, a modern layout, and intentional storytelling bring the brand to life from the first scroll.",
    link: "https://www.loggsvisual.com"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/portal-bwsbabel.mp4",
    title: "Service Public Portal BWS Babel",
    techStack: ["Next.js", "Typescript", "PostgreSQL", "Prisma"],
    description: "A Fullstack Web — this official BWS portal makes it easy to access information and submit public service requests in a fast, transparent, and accessible way.",
    link: "https://portal-pelayanan-publik.vercel.app"
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/absen-bws.mp4",
    title: " Attendance Management BWS Babel",
    techStack: ["Next.js", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI"],
    description: "A Fullstack Web — aAbsence is a web-based attendance system that simplifies check-ins, generates real-time reports, and keeps employee schedules organized in one clean dashboard."
  },
  {
    videoSrc: "https://pub-434e08d6918245dc807499d029d98049.r2.dev/ptbsm1.mp4",
    title: "PT.BSM",
    techStack: ["Next.js", "Typescript", "Shadcn UI", "Framer Motion"],
    description: "A Frontend Website —  this company profile site blends elegant design with smooth performance. Clean animations and well-structured content build client trust from the very first visit.",
    link: "https://ptbsm.vercel.app"
  }
];

export function WorksScreen() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
      // Exclude devices with touch capability (mobile/tablets) to prevent heavy 3D loading
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
          texts={["Works.", "Projects.",]}
          className="text-7xl sm:text-6xl lg:text-8xl"
        />
      </motion.h1>

      {/* Projects Container: Mobile = flex-col, Desktop = Marquee */}
      <div className="relative z-[500] w-full pt-[30vh] md:pt-0 min-h-screen flex items-center justify-center pointer-events-none pb-40 md:pb-0 px-5 md:px-0">

        {/* MOBILE: 1 Column */}
        {!isDesktop && (
          <div className="flex flex-col items-center gap-10 w-full">
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
              <ProgressiveBlur direction="left" className="w-full h-full" blurIntensity={1} />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-48 z-10 pointer-events-none">
              <ProgressiveBlur direction="right" className="w-full h-full" blurIntensity={1} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
