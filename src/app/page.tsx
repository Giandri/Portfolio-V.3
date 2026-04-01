"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, time } from "motion/react";
import {
  Dock,
  DockCard,
  DockCardInner,
  DockDivider,
} from "@/components/ui/dock";
import { HomeIcon } from "@/components/ui/home";
import { FoldersIcon } from "@/components/ui/folders";
import { IdCardIcon } from "@/components/ui/id-card";
import { Fps } from "@/components/ui/fps";
import { Cursor } from "@/components/ui/cursor";
import { AppleHelloEnglishEffect } from "@/components/apple-hello-effect";
import { ShimmeringText } from "@/components/shimmering-text";
import { DebugPanel } from "@/components/ui/skiper-ui/skiper102";
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WorksScreen } from "@/components/screens/WorksScreen";
import { InfoScreen } from "@/components/screens/InfoScreen";
import { useMotionValue } from "motion/react";
import { MorphingText } from "@/components/ui/morphing-text";
import { MorphSurface } from "@/components/ui/morph-surface";
import { ConversationBar } from "@/components/ui/conversation-bar";
import { useLanguage } from "@/context/language-provider";
import { LanguageToggle } from "@/components/ui/language-toggle";


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const isMobile = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
        userAgent
      )
    );
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) setIsMobile(isSmall || isMobile);
    setIsMobile(isSmall && isMobile);
  }, []);

  return isMobile;
}

// Data untuk dock items
const dockItems = [
  {
    id: "home",
    gradient: "https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1-p-130x130q80.jpeg",
    icon: <HomeIcon size={32} className="text-black dark:text-white" />,
    title: "Home",
    bgColor: "dark:bg-stone-900 bg-neutral-200",
  },
  {
    id: "works",
    gradient: "https://products.ls.graphics/mesh-gradients/images/04.-Hopbush_1-p-130x130q80.jpeg",
    icon: <FoldersIcon size={32} className="text-black dark:text-white" />,
    title: "Works",
    bgColor: "dark:bg-stone-900 bg-neutral-200",
  },
  {
    id: "divider",
    gradient: null,
    icon: null,
    title: null,
    bgColor: null,
  },
  {
    id: "info",
    gradient: "https://products.ls.graphics/mesh-gradients/images/36.-Pale-Chestnut-p-130x130q80.jpeg",
    icon: <IdCardIcon size={32} className="text-black dark:text-white" />,
    title: "Info",
    bgColor: "dark:bg-stone-900 bg-neutral-200",
  },
];

// Full page container component
function FullPageContainer({
  item,
  onClose,
}: {
  item: (typeof dockItems)[0];
  onClose: () => void;
}) {
  // Allow scroll for Skiper28 component
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
    >
      {/* Background gradient */}
      <motion.div
        initial={{ scale: 0, borderRadius: "50%" }}
        animate={{ scale: 1, borderRadius: "0%" }}
        exit={{ scale: 0, borderRadius: "50%" }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className={`fixed inset-0 ${item.bgColor} cursor-pointer border shadow-2xl`}
        style={{ transformOrigin: "bottom center" }}
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative z-10 min-h-screen w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {item.id === "home" && <HomeScreen />}
          {item.id === "works" && <WorksScreen />}
          {item.id === "info" && <InfoScreen />}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DockWithExpandable({
  expandedItem,
  setExpandedItem
}: {
  expandedItem: (typeof dockItems)[0] | null;
  setExpandedItem: (item: (typeof dockItems)[0] | null) => void;
}) {
  const isMobile = useIsMobile();


  const getResponsiveItems = (): (typeof dockItems) => {
    if (isMobile) {
      return dockItems.filter(item => item.id === 'home' || item.id === 'works' || item.id === 'info' || item.id === 'divider');
    }
    // On larger screens, show all items
    return dockItems;
  };

  const responsiveItems = getResponsiveItems();

  const handleDockClick = (item: (typeof dockItems)[0]) => {
    if (item.gradient) {

      if (expandedItem?.id === item.id) {

        setExpandedItem(null);
      } else {

        setExpandedItem(item);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <Dock className="z-[200] fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2">
        {responsiveItems.map((item, index) =>
          item.gradient ? (
            <div key={item.id} onClick={() => handleDockClick(item)}>
              <DockCard id={`${index}`}>
                <DockCardInner src={item.gradient} id={`${index}`}>
                  {item.icon}
                </DockCardInner>
              </DockCard>
            </div>
          ) : (
            <DockDivider key={item.id} />
          )
        )}
      </Dock>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [isPointer, setIsPointer] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // DebugPanel states
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const [keyPressed, setKeyPressed] = useState("");

  // Expandable screen state
  const [expandedItem, setExpandedItem] = useState<(typeof dockItems)[0] | null>(null);

  // Global ESC key handler for closing expandable screens
  useEffect(() => {
    const handleGlobalEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedItem(null);
      }
    };

    window.addEventListener("keydown", handleGlobalEscape);
    return () => window.removeEventListener("keydown", handleGlobalEscape);
  }, []);

  const handlePositionChange = useCallback((x: number, y: number) => {
    const element = document.elementFromPoint(x, y);
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      const isClickable =
        computedStyle.cursor === 'pointer' ||
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.closest('button') !== null ||
        element.closest('a') !== null;
      setIsPointer(isClickable);
    } else {
      setIsPointer(false);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    setTimeout(() => {
      setShowIntro(false);
    }, 500);
  }, []);


  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);




  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPressed(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 z-1000 transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      {/*Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[500] bg-white dark:bg-black flex items-center justify-center transition-colors duration-300"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <AppleHelloEnglishEffect
              className="h-24 md:h-32 text-black dark:text-white"
              speed={0.8}
              onAnimationComplete={handleIntroComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>



      <Cursor
        className="z-[1000] hidden sm:block"
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.15,
        }}
        onPositionChange={handlePositionChange}
      >
        <motion.div
          animate={{
            width: isPointer ? 48 : 16,
            height: isPointer ? 48 : 16,
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="flex items-center justify-center rounded-full bg-black/80 dark:bg-white/80 backdrop-blur-sm mix-blend-difference"
        >
          <AnimatePresence>
            {isPointer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="flex items-center justify-center"
              >
                <ArrowUpRight className="w-5 h-5 text-white dark:text-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Cursor >
      <Fps position="top-right" label="FPS" className="z-[500] text-black dark:text-white hidden sm:block transition-colors duration-300" />
      {/* Morph Surface*/}
      <div className="fixed top-[-10px] left-1/2 transform -translate-x-1/2 z-[400]">
        <MorphSurface
          triggerLabel="[  ]"
          placeholder={t.contactPlaceholder}
          expandedWidth={320}
          expandedHeight={140}
          renderContent={(props) => (
            <div className="p-2">
              <ConversationBar
                apiKey={process.env.NEXT_PUBLIC_LANGVOICE_API_KEY || "your-api-key-here"}
                voice="echo"
                language="japanese"
                onConnect={() => console.log('Connected to LangVoice')}
                onDisconnect={() => {
                  console.log('Disconnected from LangVoice');

                }}
                onMessage={(message) => console.log('Message received:', message)}
                onSendMessage={(message) => console.log('User sent:', message)}
                onError={(error) => {
                  console.error('Conversation error:', error);

                  if (error.message?.includes('400')) {
                    console.warn('API key invalid. Using default form instead.');
                  }
                }}
              />
            </div>
          )}
          onSubmit={async (data) => {
            console.log('Contact form submitted:', data.get('message'));
          }}
        />
      </div>
      {/* Theme Toggle - Top/Bottom Left */}
      <div className="fixed bottom-3 left-5 sm:top-4 sm:left-4 z-[1000]">
        <ThemeToggleButton variant="rectangle" blur={true} start="top-down" />
      </div>

      {/* Language Toggle - Aligned with Dock on Right */}
      <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-6 z-[1000] flex items-center">
        <LanguageToggle />
      </div>

      {/* Expandable Screens */}
      <AnimatePresence mode="wait">
        {expandedItem && (
          <FullPageContainer
            key={expandedItem.id}
            item={expandedItem}
            onClose={() => setExpandedItem(null)}
          />
        )}
      </AnimatePresence>

      <DockWithExpandable
        expandedItem={expandedItem}
        setExpandedItem={setExpandedItem}
      />

      {/* Debug Panel*/}
      <DebugPanel
        mouseX={mouseX}
        mouseY={mouseY}
        time={time}
        className="fixed hidden lg:block bottom-4 left-4 lg:bottom-20 lg:left-20 z-[400]"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <ShimmeringText text={t.hiImA} className="fixed top-[calc(50%-3.5rem)] sm:top-[calc(50%-4.5rem)] lg:top-[calc(50%-6rem)] left-1/2 transform -translate-x-1/2 z-[10] font-mono text-white dark:text-black text-sm sm:text-xl" />
        <MorphingText
          texts={t.roles}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-[10] text-5xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
        />
      </motion.div>

    </div>
  );
}