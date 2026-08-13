import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type StatusBadgeIcon = React.ComponentType<{ className?: string }>

const techSlugs: Record<string, string> = {
  react: "react",
  reactjs: "react",
  next: "nextdotjs",
  nextjs: "nextdotjs",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  postgresql: "postgresql",
  postgres: "postgresql",
  prisma: "prisma",
  git: "git",
  github: "github",
  framermotion: "framer",
  framer: "framer",
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",
  mongodb: "mongodb",
  express: "express",
  mysql: "mysql",
  vue: "vuedotjs",
  vuejs: "vuedotjs",
  docker: "docker",
  aws: "amazonaws",
  firebase: "firebase",
}

function toSlug(name: string) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "")
  return techSlugs[normalized] ?? normalized
}

function TechLogo({ slug, className }: { slug: string; className?: string }) {
  return (
    <img src={`https://cdn.simpleicons.org/${slug}`} alt="" className={`${className ?? ""} object-contain`} />
  )
}

const statusBadgeVariants = cva(
  "inline-flex items-center gap-x-2.5 rounded-full bg-white/20 dark:bg-black/20 px-2.5 py-1.5 text-xs border border-white/25 dark:border-black/25",
  {
    variants: {
      status: {
        success: "",
        error: "",
        default: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  leftIcon?: StatusBadgeIcon | string
  rightIcon?: StatusBadgeIcon | string
  leftLabel: string
  rightLabel?: string
}

export function StatusBadge({
  className,
  status,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  ...props
}: StatusBadgeProps) {
  const iconCls = cn(
    "-ml-0.5 size-4 shrink-0",
    status === "success" && "text-emerald-600 dark:text-emerald-500",
    status === "error" && "text-red-600 dark:text-red-500"
  )

  const LeftIcon = typeof leftIcon === "string" ? undefined : leftIcon
  const RightIcon = typeof rightIcon === "string" ? undefined : rightIcon

  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <span className="inline-flex items-center gap-1.5 font-medium text-white dark:text-black">
        {typeof leftIcon === "string" ? (
          <TechLogo slug={toSlug(leftIcon)} className={iconCls} />
        ) : (
          LeftIcon && <LeftIcon className={iconCls} aria-hidden={true} />
        )}
        {leftLabel}
      </span>
      {rightLabel && (
        <>
          <span className="h-4 w-px bg-white/25 dark:bg-black/25" />
          <span className="inline-flex items-center gap-1.5 text-white/60 dark:text-black/60">
            {typeof rightIcon === "string" ? (
              <TechLogo slug={toSlug(rightIcon)} className="-ml-0.5 size-4 shrink-0" />
            ) : (
              RightIcon && <RightIcon className="-ml-0.5 size-4 shrink-0" aria-hidden={true} />
            )}
            {rightLabel}
          </span>
        </>
      )}
    </span>
  )
}
