import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { App1Sidebar } from "@/components/ui/app-1-utils/app-1-sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { ThemeToggleButton } from "@/components/dashboard/theme-toggle";
import { requireAdmin } from "@/lib/admin";
import { DashboardBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Frame, FrameHeader, FrameRow } from "@/components/dashboard/frame";
import { Cursor } from "@/components/ui/cursor";

import "../cms-theme.css";

const plex = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <SidebarProvider className={`cms-scope ${plex.variable}`}>
      <Frame>
        <FrameRow>
          <App1Sidebar />
          <SidebarInset className="bg-background">
            <FrameHeader className="sticky top-0 z-20 bg-card">
              <SidebarTrigger className="-ml-1 size-8" />
              <DashboardBreadcrumb />
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggleButton />
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {session.user.email}
                </span>
                <LogoutButton />
              </div>
            </FrameHeader>
            {children}
          </SidebarInset>
        </FrameRow>
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
    </SidebarProvider>
  );
}