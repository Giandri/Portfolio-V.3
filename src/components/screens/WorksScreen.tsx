"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skiper67 } from '../ui/skiper-ui/skiper67';
import { motion } from "framer-motion";
import { MorphingText } from '../ui/morphing-text';

// Dynamic import Spline to avoid async component error in client component
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading 3D...</div>
    </div>
  ),
});

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

      {/* Projects Container: Mobile = flex-col, Desktop = 4 corners fixed */}
      <div className="relative z-[500] w-full pt-[30vh] md:pt-0 min-h-screen flex flex-col md:block items-center gap-10 pb-40 md:pb-0 px-5 md:px-0 pointer-events-none">

        {/* TOP LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 1, ease: "easeIn" }}
          className="pointer-events-auto overflow-hidden w-[85vw] max-w-[360px] aspect-video md:fixed md:left-8 md:top-8 lg:left-12 lg:top-12 md:w-[240px] md:h-[135px] lg:w-[280px] lg:h-[157px] shadow-2xl"
        >
          <Skiper67
            videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/loggs%20maps.mp4"
            title="Loggs Maps"
            techStack={["React", "Node.js", "PostgreSQL"]}
            description="Real-time tracking dashboard for fleet monitoring and operational logistics."
            link="https://maps.loggsvisual.com"
          />
        </motion.div>

        {/* TOP RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.6, duration: 1, ease: "easeIn" }}
          className="pointer-events-auto overflow-hidden w-[85vw] max-w-[360px] aspect-video md:fixed md:right-8 md:top-8 lg:right-12 lg:top-12 md:w-[240px] md:h-[135px] lg:w-[280px] lg:h-[157px] shadow-2xl"
        >
          <Skiper67
            videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/loggs%20video.mp4"
            title="Loggs Profile"
            techStack={["Next.js", "TailwindCSS", "Framer Motion", "Shadcn UI"]}
            description="Company profile and promotional system showcase for Loggs."
            link="https://www.loggsvisual.com"
          />
        </motion.div>

        {/* BOTTOM LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.7, duration: 1, ease: "easeIn" }}
          className="pointer-events-auto overflow-hidden w-[85vw] max-w-[360px] aspect-video md:fixed md:left-8 md:bottom-56 lg:left-12 lg:bottom-56 md:w-[240px] md:h-[135px] lg:w-[280px] lg:h-[157px] shadow-2xl"
        >
          <Skiper67
            videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/portal%20bwsbabel.mp4"
            title="Portal Pelayanan Publik BWS Babel"
            techStack={["Next.js", "Typescript", "PostgreSQL", "Prisma"]}
            description="Official web portal application for Balai Wilayah Sungai Bangka Belitung."
            link="https://portal-pelayanan-publik.vercel.app"
          />
        </motion.div>

        {/* BOTTOM RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.8, duration: 1, ease: "easeIn" }}
          className="pointer-events-auto overflow-hidden w-[85vw] max-w-[360px] aspect-video md:fixed md:right-8 md:bottom-56 lg:right-12 lg:bottom-56 md:w-[240px] md:h-[135px] lg:w-[280px] lg:h-[157px] shadow-2xl"
        >
          <Skiper67
            videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/absen.mp4"
            title="Absensi"
            techStack={["Next.js", "Typescript", "PostgreSQL", "Axios", "TanStack", "Shadcn UI"]}
            description="A comprehensive attendance management application."
          />
        </motion.div>

      </div>
    </div>
  );
}
