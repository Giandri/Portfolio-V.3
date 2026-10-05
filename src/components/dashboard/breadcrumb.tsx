"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "": "Overview",
  projects: "Projects",
  skills: "Skills",
  profile: "Profile",
  experience: "Experience",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] ?? "";
  const label = TITLES[current] ?? current;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link
        href="/dashboard"
        className="text-muted-foreground transition-colors duration-[120ms] ease-out hover:text-foreground"
      >
        CMS
      </Link>
      <span aria-hidden="true" className="text-faint">
        /
      </span>
      <span aria-current="page" className="font-medium">
        {label}
      </span>
    </nav>
  );
}