import type { ReactNode } from "react";

/**
 * Panel gaya OpenCode (DESIGN.MD §6 "Panel" + §11.4).
 *
 * Sengaja bukan komponen `Card` shadcn: `Card` bring padding besar dan
 * border, sedangkan di sini yang dibutuhkan panel datar: border 1px,
 * radius 6px, tanpa shadow.
 */
export function Panel({ title, description, action, children, className = "" }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const hasHeader = title || description || action;

  return (
    <section className={` border border-border bg-card text-card-foreground ${className}`}>
      {hasHeader ?
        <header className="flex items-start gap-4 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            {title ?
              <h2 className="text-sm font-semibold leading-tight">{title}</h2>
            : null}
            {description ?
              <p className="mt-1 text-xs leading-normal text-muted-foreground">{description}</p>
            : null}
          </div>
          {action ?
            <div className="shrink-0">{action}</div>
          : null}
        </header>
      : null}
      <div className="p-4">{children}</div>
    </section>
  );
}
