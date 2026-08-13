"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import { FileSystem, fileIconColorVariables, type FileSystemItem } from "@/components/ui/file-system";

const items: FileSystemItem[] = [
  { kind: "folder", path: "Projects/" },
  { kind: "folder", path: "Gallery/" },
  {
    kind: "file",
    path: "resume.pdf",
    contentType: "application/pdf",
    size: 187432,
    url: "/resume.pdf",
    previewAspectRatio: 0.78,
  },
  {
    kind: "file",
    path: "cv.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 93418,
  },
  { kind: "folder", path: "Projects/portfolio-cv/" },
  {
    kind: "file",
    path: "Projects/portfolio-cv/README.md",
    contentType: "text/markdown",
    size: 2048,
  },
  {
    kind: "file",
    path: "Projects/portfolio-cv/package.json",
    contentType: "application/json",
    size: 1536,
  },
  {
    kind: "file",
    path: "Projects/portfolio-cv/src/app/page.tsx",
    contentType: "text/x-typescript",
    size: 8192,
  },
  {
    kind: "file",
    path: "Gallery/fotocv.jpg",
    contentType: "image/jpeg",
    size: 112640,
    previewImageUrl: "/images/fotocv.jpg",
    previewAspectRatio: 0.78,
  },
  {
    kind: "file",
    path: "Gallery/bg.jpg",
    contentType: "image/jpeg",
    size: 204800,
    previewImageUrl: "/images/bg.jpg",
    previewAspectRatio: 1.6,
  },
  {
    kind: "file",
    path: "Gallery/dock/works.png",
    contentType: "image/png",
    size: 5120,
    previewImageUrl: "/images/dock/works.png",
    previewAspectRatio: 1,
  },
  { kind: "folder", path: "Trash/" },
  {
    kind: "file",
    path: "Trash/old-project.zip",
    contentType: "application/zip",
    size: 4521984,
  },
  {
    kind: "file",
    path: "Trash/draft-cv.md",
    contentType: "text/markdown",
    size: 4096,
  },
  {
    kind: "file",
    path: "Trash/notes-2024.txt",
    contentType: "text/plain",
    size: 8192,
  },
];

const Window = styled.div<{ $x: number; $y: number }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  width: min(920px, 100%);
  height: min(540px, 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: #09090b;
  pointer-events: auto;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);

  .dark & {
    border-color: rgba(0, 0, 0, 0.25);
    background: #efebea;
  }
`;

const TitleBar = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #09090b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  .dark & {
    background: #efebea;
    border-bottom-color: rgba(0, 0, 0, 0.25);
  }
`;

const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: ${(props) => props.$color};
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: #e06551;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);

  &:hover svg {
    display: block;
  }

  .dark & {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const CloseIcon = styled(X)`
  width: 8px;
  height: 8px;
  display: none;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);

  .dark & {
    color: rgba(0, 0, 0, 0.8);
  }
`;

const Spacer = styled.div`
  width: 52px;
  flex-shrink: 0;
`;

const FileSystemPane = styled(FileSystem)`
  border: none;
  border-radius: 0;
  color-scheme: dark;
  ${fileIconColorVariables(1)}
  & [data-file-system-on-light] {
    ${fileIconColorVariables(0)}
  }
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.205 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.145 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.205 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);

  .dark & {
    color-scheme: light;
    ${fileIconColorVariables(0)}
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.145 0 0);
    --muted: oklch(1 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.145 0 0);
    --border: oklch(0 0 0 / 10%);
    --input: oklch(0 0 0 / 15%);
  }
`;
export function FileSystemScreen({ onClose, onActivate, defaultPath = "" }: { onClose?: () => void; onActivate?: () => void; defaultPath?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    onActivate?.();

    if ((event.target as HTMLElement).closest("button")) return;

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return;

    setPos({
      x: drag.current.originX + event.clientX - drag.current.startX,
      y: drag.current.originY + event.clientY - drag.current.startY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerId === drag.current?.pointerId) drag.current = null;
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4 pt-10 sm:p-6 sm:pt-12 md:p-8">
      <Window $x={pos.x} $y={pos.y}>
        <TitleBar onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
          <Dot $color="#ECB948" />
          <Dot $color="#62BB4B" />
          <Title>Files</Title>
          <Spacer />
        </TitleBar>
        <FileSystemPane items={items} title="Files" defaultView="columns" defaultPath={defaultPath} className="min-h-0 flex-1" />
      </Window>
    </div>
  );
}
