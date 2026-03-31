"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Play, Plus, ArrowUpRight } from "lucide-react";
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
  <MediaController
    style={{
      ...style,
    }}
    {...props}
  />
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => (
  <MediaControlBar {...props} />
);

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
  className,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    className={cn(
      "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
      className,
    )}
    {...props}
  />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>;

export const VideoPlayerTimeDisplay = ({
  className,
  ...props
}: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>;

export const VideoPlayerVolumeRange = ({
  className,
  ...props
}: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton className={cn("", className)} {...props} />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>;

export const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>;

export const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton className={cn("", className)} {...props} />
);

export type VideoPlayerContentProps = ComponentProps<"video">;

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  <video className={cn("mb-0 mt-0", className)} {...props} />
);

export const Skiper67 = ({
  videoSrc,
  title,
  techStack,
  description,
  link
}: {
  videoSrc: string;
  title?: string;
  techStack?: string[];
  description?: string;
  link?: string;
}) => {
  const [showVideoPopOver, setShowVideoPopOver] = useState(false);

  const SPRING = {
    mass: 0.1,
  };

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const opacity = useSpring(0, SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    opacity.set(1);
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left);
    y.set(e.clientY - bounds.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeIn" }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <div className="absolute top-1/4 grid content-start justify-items-center gap-6 text-center">

      </div>
      <AnimatePresence>
        {showVideoPopOver && (
          <VideoPopOver
            videoSrc={videoSrc}
            title={title}
            techStack={techStack}
            description={description}
            link={link}
            setShowVideoPopOver={setShowVideoPopOver}
          />
        )}
      </AnimatePresence>
      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          opacity.set(0);
        }}
        onClick={() => setShowVideoPopOver(true)}
        className="absolute inset-0 cursor-none w-full h-full"
      >
        <motion.div
          style={{ x, y, opacity }}
          className="relative z-20 flex w-fit select-none items-center justify-center gap-2 p-2 text-sm text-white mix-blend-exclusion pointer-events-none"
        >
          <Play className="size-4 fill-white " /> Play
        </motion.div>
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.play().catch(() => { });
            }
          }}
          autoPlay
          muted
          playsInline
          loop
          src={videoSrc}
          className="h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
};

const VideoPopOver = ({
  setShowVideoPopOver,
  videoSrc,
  title,
  techStack,
  description,
  link,
}: {
  setShowVideoPopOver: (showVideoPopOver: boolean) => void;
  videoSrc: string;
  title?: string;
  techStack?: string[];
  description?: string;
  link?: string;
}) => {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed left-0 top-0 z-[900] flex h-screen w-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-background/90 absolute left-0 top-0 h-full w-full backdrop-blur-lg"
        onClick={() => setShowVideoPopOver(false)}
      ></motion.div>

      <motion.div
        initial={{ clipPath: "inset(43.5% 43.5% 33.5% 43.5% )", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
        exit={{
          clipPath: "inset(43.5% 43.5% 33.5% 43.5% )",
          opacity: 0,
          transition: {
            duration: 1,
            type: "spring",
            stiffness: 100,
            damping: 20,
            opacity: { duration: 0.2, delay: 0.8 },
          },
        }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="relative flex flex-col items-center justify-center w-full max-w-6xl md:h-auto max-h-[90vh]"
      >
        <div className="relative w-full aspect-video md:h-[70vh] rounded-xl overflow-hidden shadow-2xl bg-black/50">
          <VideoPlayer style={{ width: "100%", height: "100%" }}>
            <VideoPlayerContent
              src={videoSrc}
              autoPlay
              slot="media"
              className="w-full h-full object-contain"
              style={{ width: "100%", height: "100%" }}
            />

            <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-center px-5 mix-blend-exclusion md:px-10 md:py-5">
              <VideoPlayerPlayButton className="h-4 bg-transparent" />
              <VideoPlayerTimeRange className="bg-transparent" />
              <VideoPlayerMuteButton className="size-4 bg-transparent" />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>

        <AnimatePresence>
          {(title || description || techStack) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-2 sm:mt-6 flex flex-col sm:flex-row items-start justify-between w-full px-2 gap-4"
            >
              <div className="flex flex-col gap-3 flex-1 text-center sm:text-left">
                {title && (
                  <h3 className="text-foreground font-bold text-2xl md:text-3xl tracking-tight" style={{ fontFamily: "'Almendra', serif" }}>
                    {title}
                  </h3>
                )}

                {techStack && techStack.length > 0 && (
                  <div className="flex justify-center sm:justify-start flex-wrap gap-3">
                    {techStack.map((tech, idx) => {
                      const normalized = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
                      // Map common tech stack names to simpleicons slugs
                      const map: Record<string, string> = {
                        reactjs: 'react',
                        react: 'react',
                        nodejs: 'nodedotjs',
                        postgresql: 'postgresql',
                        nextjs: 'nextdotjs',
                        tailwindcss: 'tailwindcss',
                        framermotion: 'framer',
                        typescript: 'typescript',
                        javascript: 'javascript',
                        html5: 'html5',
                        css3: 'css3',
                        git: 'git',
                        github: 'github',
                        mongodb: 'mongodb',
                        express: 'express',
                        expressjs: 'express',
                        prisma: 'prisma',
                        mysql: 'mysql',
                        vuejs: 'vuedotjs',
                        vue: 'vuedotjs',
                        angular: 'angular',
                        docker: 'docker',
                        aws: 'amazonaws',
                        firebase: 'firebase',
                      };
                      const iconSlug = map[normalized] || normalized;

                      return (
                        <div
                          key={idx}
                          title={tech}
                          className="flex items-center justify-center p-2 bg-foreground/10 hover:bg-foreground/20 transition-colors rounded-full border border-foreground/20"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://cdn.simpleicons.org/${iconSlug}/black`}
                            alt={tech}
                            className="w-5 h-5 md:w-6 md:h-6 object-contain dark:hidden"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://cdn.simpleicons.org/${iconSlug}/white`}
                            alt={tech}
                            className="w-5 h-5 md:w-6 md:h-6 object-contain hidden dark:block"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {description && (
                  <p className="text-foreground/80 font-mono text-[12px] text-justify md:text-sm leading-relaxed max-w-3xl mt-1">
                    {description}
                  </p>
                )}
              </div>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" py-2 px-4 sm:px-6 bg-foreground text-center font-mono text-background text-[10px] md:text-base font-semibold rounded-full hover:opacity-80 transition-opacity shrink-0 shadow-lg mt-2 sm:mt-0"
                >
                  Visit
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  );
};
