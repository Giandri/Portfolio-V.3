/**
 * Statistik gaya OpenCode (DESIGN.MD §6 "Stat dengan caption Fig").
 *
 * Caption `Fig N.` 12px muted, angka 40px weight 600 line-height 1,
 * label 12px muted. Dipisah antar-stat dengan border vertikal 1px.
 */
export function StatFigure({
  index,
  value,
  label,
}: {
  index: number;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <figure className="flex flex-col gap-1 border-l border-border pl-4 first:border-l-0 first:pl-0">
      <figcaption className="text-xs leading-normal text-muted-foreground">
        Fig {index}.
      </figcaption>
      <div className="text-4xl font-semibold leading-none tabular-nums">{value}</div>
      <div className="text-xs leading-normal text-muted-foreground">{label}</div>
    </figure>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">{children}</div>
  );
}