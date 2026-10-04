import type { Metadata } from "next";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { App1Sidebar } from "@/components/ui/app-1-utils/app-1-sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Cursor } from "@/components/ui/cursor";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <SidebarProvider>
      <App1Sidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>
        {children}
      </SidebarInset>
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
