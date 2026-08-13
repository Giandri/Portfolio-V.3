"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  viewportRef,
  viewportClassName,
  viewportProps,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: "vertical" | "horizontal"
  viewportRef?: React.Ref<React.ComponentRef<typeof ScrollAreaPrimitive.Viewport>>
  viewportClassName?: string
  viewportProps?: React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.Viewport
  >
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "h-full w-full overflow-hidden rounded-[inherit]",
          orientation === "vertical" && "overflow-x-hidden",
          orientation === "horizontal" && "overflow-y-hidden",
          viewportClassName
        )}
        {...viewportProps}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        data-slot="scroll-area-scrollbar"
        orientation={orientation}
        className={cn(
          "flex touch-none select-none",
          orientation === "vertical" &&
            "h-full w-2 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "h-2 flex-col border-t border-t-transparent p-[1px]"
        )}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

const ScrollAreaPrimitiveCompat = {
  Content: React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    function ScrollAreaContent({ className, ...props }, ref) {
      return <div data-slot="scroll-area-content" ref={ref} className={className} {...props} />
    }
  ),
}

export { ScrollArea, ScrollAreaPrimitiveCompat as ScrollAreaPrimitive }
