export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Go syntax &amp; toolchain, by example
        </h1>
        <p className="mx-auto mt-4 max-w-prose text-fg-muted">
          Phase 01 scaffold. The lesson shell, the Playground runner and the toolchain walkthroughs
          land in the phases that follow.
        </p>
        <p className="mt-6 font-mono text-xs text-fg-subtle">
          The tour is loading… (placeholder build)
        </p>
      </div>
    </main>
  );
}
