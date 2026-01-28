"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Copy } from "lucide-react";
import { MorphingText } from "../ui/morphing-text";
import { CometCard } from "../ui/comet-card";
import { MorphSurface } from "../ui/morph-surface";
import { ConversationBar } from "../ui/conversation-bar";
import { AnimatedChart } from "../animated-chart";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { ShareButton } from "../animate-ui/components/community/share-button";
import Image from "next/image";
import { useState } from "react";


export function InfoScreen() {
  const [isHover, setIsHover] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@yourname.com");
  };

  // Skills data for the animated chart
  const skillsData = [
    { title: "Web Development", value: 80, appendString: "%", animationDelay: 0.4 },
    { title: "Visual Creative", value: 75, appendString: "%", animationDelay: 0.5 },
    { title: "Coffee Enthusiast", value: 65, appendString: "%", animationDelay: 0.6 },
  ];

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:divide-x divide-neutral-800/20 dark:divide-neutral-800 border-neutral-800">

        {/* Left Column */}
        <div className="flex flex-col justify-start h-full pr-0 lg:pr-6 lg:pb-0 pt-0 gap-8 sm:gap-12 lg:gap-16">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[12vw] lg:text-[10rem] leading-[0.8] font-bold text-black dark:text-white tracking-tighter"
          >
            <MorphingText
              texts={["Info", "About Me",]}
              className="text-start"
            />
          </motion.h1>

          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 text-sm md:text-[20px] font-light text-justify text-black dark:text-white/90 max-w-xl lg:mt-0"
            style={{ fontFamily: "'Almendra', serif" }}
          >
            <p>
              I'm <span className="text-black dark:text-white">Giandri Aditio</span>, A Web Developer and Graphic Designer
              with internship experience and independent projects in web development.
              Holds a Bachelor’s degree in Informatics Engineering from ISB Atma Luhur
              Pangkal Pinang with a GPA of 3.84.
            </p>
            <p className="text-black dark:text-white">
              Possesses strong skills in web animation, Tailwind CSS, Next.js, and Laravel.
              Additionally, has a strong interest in graphic design and photography, particularly
              in stage and band photography, which further enhances creative capabilities.
            </p>

          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-full pl-0 lg:pl-12 pt-12 lg:pt-0">
          {/* Photo with CometCard */}
          <div
            className="relative"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CometCard className="w-[300px] sm:w-[350px] h-[180px] sm:h-[200px] max-w-md mx-auto lg:ml-auto lg:mr-1/2 mb-4 sm:mb-6 lg:mb-6">
              <div className="aspect-square lg:aspect-4/4 bg-neutral-200 dark:bg-neutral-800 grayscale relative rounded-2xl overflow-hidden">
                {/* Replace with your actual image */}
                <Image
                  src="/images/fotocv.jpg"
                  alt="Hero"
                  fill
                  className="object-cover"
                />

                {/* Progressive Blur Effect */}
                <ProgressiveBlur
                  className="pointer-events-none absolute bottom-0 left-0 h-[60%] w-full"
                  blurIntensity={0.4}
                  animate={isHover ? 'visible' : 'hidden'}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Hover Content */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 font-mono"
                  animate={isHover ? 'visible' : 'hidden'}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col gap-0">
                      <p className="text-sm font-medium text-white">Giandri Aditio</p>
                      <span className="text-xs text-zinc-300">Web Developer & Designer</span>
                    </div>

                    {/* Share Button */}
                    <ShareButton
                      size="sm"
                      className="bg-white/20 text-white font-mono hover:bg-white/30 border-white/30"
                      onIconClick={(platform: 'github' | 'instagram' | 'linkedin') => {
                        const url = window.location.href;
                        const text = "Check out this amazing portfolio by Giandri Aditio! 🚀";

                        switch (platform) {
                          case 'github':
                            window.open(`https://github.com/Giandri`, '_blank');
                            break;
                          case 'instagram':
                            window.open(`https://www.instagram.com/gndr_dtio/`, '_blank');
                            break;
                          case 'linkedin':
                            window.open(`https://www.linkedin.com/in/giandriaditio/`, '_blank');
                            break;
                        }
                      }}
                    >
                      Get in Touch
                    </ShareButton>
                  </div>
                </motion.div>
              </div>
            </CometCard>
          </div>

          {/* Skills Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="w-full font-mono text-white dark:text-black text-center"
          >
            <AnimatedChart
              columns={skillsData}
              maxValue={130}
              restartOnDataChange={true}
              className="h-55 mt-45"
              valueClassName="text-white dark:text-black"

            />

          </motion.div>


        </div>

      </div>
    </div>
  );
}
