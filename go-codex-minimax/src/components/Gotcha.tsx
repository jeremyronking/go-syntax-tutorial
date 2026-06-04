interface GotchaProps {
  children: string;
}

export function Gotcha({ children }: GotchaProps): JSX.Element {
  return (
    <aside
      role="note"
      className="my-4 rounded-md border-l-4 border-amber-400 bg-amber-400/5 p-3 text-sm text-amber-700 dark:text-amber-100"
    >
      <div className="mb-1 font-mono text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300">
        Gotcha
      </div>
      <div className="text-amber-700 dark:text-amber-50">{children}</div>
    </aside>
  );
}
