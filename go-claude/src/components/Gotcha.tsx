import { Prose } from './Prose';

export function Gotcha({ children }: { children: string }) {
  return (
    <aside
      role="note"
      aria-label="Gotcha"
      className="mt-8 rounded-md border-l-4 border-gopher bg-elevated/60 p-4"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-gopher">Gotcha</p>
      <div className="mt-2">
        <Prose>{children}</Prose>
      </div>
    </aside>
  );
}
