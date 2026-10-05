"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/**
 * Penanda item sidebar gaya OpenCode (DESIGN.MD §6 "Daftar fitur dengan
 * bullet `[*]`"). Dipakai menggantikan ikon supaya sidebar terbaca seperti
 * terminal. `w-4` menjaga judul tetap rata antar item.
 */
function Bullet() {
  return (
    <span
      aria-hidden="true"
      className="w-4 shrink-0 text-center text-[11px] leading-none text-faint"
    >
      [*]
    </span>
  );
}

type NavItem = {
  title: string;
  href?: string;
};

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/dashboard" },
      { title: "Profile", href: "/dashboard/profile" },
      { title: "Projects", href: "/dashboard/projects" },
      { title: "Skills", href: "/dashboard/skills" },
      { title: "Experience", href: "/dashboard/experience" },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", href: "/dashboard/settings" }],
  },
];

export function App1Sidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 shrink-0 items-center justify-center rounded-sm">
                  <LayoutDashboard className="size-3.5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Dashboard Portfolio</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Administrator
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    item.href !== undefined && pathname === item.href;

                  if (!item.href) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton disabled>
                          <Bullet />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>Segera</SidebarMenuBadge>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        data-active={active || undefined}
                        className="h-8 group-data-[collapsible=icon]:justify-center"
                      >
                        <Link href={item.href}>
                          <Bullet />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}