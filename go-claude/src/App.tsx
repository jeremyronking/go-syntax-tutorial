export default function App() {
  return (
    <main className="min-h-screen bg-ink-950 text-ink-50 p-10">
      <header className="max-w-prose mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</p>
        <h1 className="mt-2 text-4xl font-semibold">Hello, Go.</h1>
        <p className="mt-4 text-ink-200">
          The scaffold is alive. The next phase brings the Playground proxy online.
        </p>
        <pre className="mt-8 rounded-md bg-ink-900 border border-ink-700 p-4 text-sm font-mono overflow-x-auto">
{`package main

import "fmt"

func main() {
    fmt.Println("hello, world")
}`}
        </pre>
      </header>
    </main>
  );
}
