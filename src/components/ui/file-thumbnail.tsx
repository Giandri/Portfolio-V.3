"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface FileThumbnailFile {
  name: string
  type: string
}

function FileThumbnail({
  file,
  className,
  previewAspectRatio = 0.78,
  previewClassName,
  previewImageUrl,
  isLoading,
  previewContent,
}: {
  file: FileThumbnailFile
  className?: string
  previewAspectRatio?: number
  previewClassName?: string
  previewImageUrl?: string
  isLoading?: boolean
  previewContent?: React.ReactNode
}) {
  return (
    <div
      data-slot="file-thumbnail"
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/50",
          previewClassName
        )}
        style={{ aspectRatio: previewAspectRatio }}
      >
        {isLoading ? (
          <span role="status" aria-label="Loading" className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        ) : previewImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImageUrl}
            alt={file.name}
            className="size-full object-contain"
          />
        ) : (
          previewContent
        )}
      </div>
    </div>
  )
}

export { FileThumbnail }
