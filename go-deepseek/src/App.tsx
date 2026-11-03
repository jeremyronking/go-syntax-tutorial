export default function App() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-gopher-500">GoTour</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          An interactive Go syntax &amp; toolchain tour
        </h1>
        <p className="mt-3 text-muted">
          Scaffold is up. Lessons, the Playground runner, and the toolchain terminal land next.
        </p>
        <code className="mt-8 inline-block rounded-md border border-divider bg-card px-3 py-2 font-mono text-sm text-gopher-300">
          go run hello.go
        </code>
      </div>
    </main>
  );
}
