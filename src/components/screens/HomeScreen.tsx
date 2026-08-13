"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "@/context/language-provider";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { CometCard } from "@/components/ui/comet-card";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ShareButton } from "@/components/animate-ui/components/community/share-button";
import { StatusBadge } from "@/components/ui/status-badge";

const tabs = [
  { id: "about", label: "About me", count: "01" },
  { id: "exp", label: "Experience", count: "02" },
  { id: "cv", label: "CV", count: "03" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function HomeScreen({ onClose, onActivate }: { onClose?: () => void; onActivate?: () => void }) {
  const { t } = useLanguage();
  const [active, setActive] = useState<TabId>("about");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    onActivate?.();

    if ((event.target as HTMLElement).closest("button, a, input, select, textarea, [contenteditable=true]")) return;

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return;

    setPos({
      x: drag.current.originX + event.clientX - drag.current.startX,
      y: drag.current.originY + event.clientY - drag.current.startY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerId === drag.current?.pointerId) drag.current = null;
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-3 sm:p-6">
      {/* macOS Window */}
      <div
        className="relative z-[100] w-[min(920px,100%)] h-[min(540px,100%)] rounded-[10px] border border-white/25 bg-[#09090b] dot-grid text-white shadow-[1px_2px_3px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden select-none pointer-events-auto dark:border-black/25 dark:bg-[#EFEBEA] dark:text-black"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}>
        {/* Top Bar */}
        <nav className="shrink-0 bg-[#09090b]/95 border-b border-white/25 cursor-grab active:cursor-grabbing dark:bg-[#EFEBEA]/95 dark:border-black/25">
          <div className="flex items-center justify-between px-3 py-2">
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
            <h1 className="flex-1 text-[13px] font-medium leading-none tracking-tight text-center text-white/80 dark:text-black/80">Information about: Giandri Aditio, halo@giandri.my.id</h1>
            <div className="w-[52px]" />
          </div>
        </nav>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="shrink-0 w-40 sm:w-48 bg-[#09090b]/90 border-r border-white/25 dark:bg-[#EFEBEA]/90 dark:border-black/25">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={
                  "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] font-medium leading-tight tracking-tight transition-colors " +
                  (active === tab.id ? "bg-white text-black dark:bg-white dark:text-black" : "text-white/80 hover:bg-white/10 dark:text-black/80 dark:hover:bg-black/10")
                }>
                <span>{tab.label}</span>
                <span className="text-white/50 dark:text-black/50">{tab.count}</span>
              </button>
            ))}
            <div className="mt-2 border-t border-white/25 dark:border-black/25" />
            <a
              href="/resume.pdf"
              download="Giandri-Aditio-CV.pdf"
              className="mt-2 flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] font-medium leading-tight tracking-tight text-white/80 hover:bg-white/10 dark:text-black/80 dark:hover:bg-black/10">
              <ArrowDownToLine className="w-3.5 h-3.5" />
              Install
            </a>
          </aside>

          {/* Content */}
          <main className="flex-1 overflow-y-auto scrollbar-none bg-transparent border-l border-white/25 dark:border-black/25 p-4 sm:p-6">
            {active === "about" && (
              <div className="text-xs font-medium tracking-[-0.04em] leading-[1.1]">
                <p className="text-white text-justify dark:text-black">{t.bioP1}</p>
                <p className="mt-4 text-white dark:text-black">Technical Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.techStack.map((tech) => (
                    <StatusBadge key={tech} status="success" leftIcon={tech} leftLabel={tech} />
                  ))}
                </div>
              </div>
            )}

            {active === "exp" && (
              <div className="text-xs font-medium tracking-[-0.04em] leading-[1.1]">
                <ul className="mt-4 space-y-5">
                  {t.experience.map((item) => (
                    <li key={item.title}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white dark:text-black">{item.title}</p>
                          <p className="text-white/60 dark:text-black/60">{item.org}</p>
                        </div>
                        <p className="shrink-0 text-white/50 dark:text-black/50">{item.period}</p>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {item.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70 dark:text-black/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FCB726] shrink-0 mt-[2px]" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {active === "cv" && (
              <div className="h-full">
                <PDFViewer src="/resume.pdf" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
