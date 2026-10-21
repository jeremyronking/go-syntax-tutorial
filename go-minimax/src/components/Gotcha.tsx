/**
 * The "gotcha" callout. Deliberately loud — this is the part of each lesson
 * the reader is most likely to get bitten by in production.
 */
export function Gotcha({ children }: { children: string }) {
  return (
    <aside
      className="mt-8 rounded-md border border-amber-500/40 bg-amber-500/5 p-4"
      aria-label="Gotcha"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500">Gotcha</p>
      <div className="mt-2 text-sm leading-relaxed text-fg">{children}</div>
    </aside>
  );
}
