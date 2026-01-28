"use client";

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


  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors z-400 duration-300 overflow-hidden">
      <Spline
        scene="https://prod.spline.design/1PUC3yoNBjKkfudo/scene.splinecode"
        className="w-full h-full overflow-hidden"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[12vw] lg:text-[10rem] leading-[0.8] font-bold text-black dark:text-white tracking-tighter fixed top-32 inset-x-0 z-[500] flex justify-center"
      >
        <MorphingText
          texts={["Works.", "Projects.",]}
          className=""
        />
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.5, duration: 1, ease: "easeIn" }}
        className="fixed left-10 top-1/2 -translate-y-1/2 z-500 w-[420px] h-[200px]"
      >
        <Skiper67 videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/loggs%20maps.mp4" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.5, duration: 1, ease: "easeIn" }}
        className="fixed right-10 top-1/2 -translate-y-1/2 z-500 w-[420px] h-[200px]"
      >
        <Skiper67 videoSrc="https://ywrmvlrvlbxuplck.public.blob.vercel-storage.com/loggs%20video.mp4" />
      </motion.div>


    </div>
  );
}
