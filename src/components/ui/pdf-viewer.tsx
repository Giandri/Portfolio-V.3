"use client";

import { useEffect, useRef } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";

export function PDFViewer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;

    void (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const container = containerRef.current;
      if (!container || cancelled) return;

      task = pdfjs.getDocument({ url: src });
      const pdf = await task.promise;

      for (let i = 1; i <= pdf.numPages && !cancelled; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.style.display = "block";
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        container.appendChild(canvas);
      }
    })().catch((err) => console.error("Failed to render PDF:", err));

    return () => {
      cancelled = true;
      containerRef.current?.replaceChildren();
      task?.destroy();
    };
  }, [src]);

  return <div ref={containerRef} className="w-full h-full overflow-y-auto scrollbar-none" />;
}
