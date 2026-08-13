"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Spinner({ className }: { className?: string }) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  )
}

export { Spinner }
