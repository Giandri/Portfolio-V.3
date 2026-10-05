import { IBM_Plex_Mono } from "next/font/google";

import { Cursor } from "@/components/ui/cursor";
import { Frame, FrameHeader } from "@/components/dashboard/frame";
import { ThemeToggleButton } from "@/components/dashboard/theme-toggle";

import "../cms-theme.css";

const plex = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`cms-scope line-grid ${plex.variable}`}>
      <Frame>
        <FrameHeader>
          <span className="text-sm font-medium">Portfolio</span>
          <div className="ml-auto">
            <ThemeToggleButton />
          </div>
        </FrameHeader>

        {children}
      </Frame>

      <Cursor
        className="z-1000 hidden sm:block"
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{ bounce: 0.001 }}
        transition={{ ease: "easeInOut", duration: 0.15 }}
      >
        <div className="size-4 rounded-full bg-black/80 dark:bg-white/80 backdrop-blur-sm mix-blend-difference" />
      </Cursor>
    </div>
  );
}
