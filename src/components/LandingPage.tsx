import { Link } from "react-router-dom";

const sections = [
  { letter: "A", title: "Language Fundamentals", lessons: 7 },
  { letter: "B", title: "Control Flow", lessons: 7 },
  { letter: "C", title: "Composite Types", lessons: 5 },
  { letter: "D", title: "Functions", lessons: 4 },
  { letter: "E", title: "Interfaces & Polymorphism", lessons: 4 },
  { letter: "F", title: "Generics", lessons: 3 },
  { letter: "G", title: "Errors, Panic, Recover", lessons: 3 },
  { letter: "H", title: "Concurrency", lessons: 7 },
  { letter: "I", title: "Packages & Project Layout", lessons: 4 },
  { letter: "J", title: "Reflection & Low-level", lessons: 4 },
  { letter: "K", title: "Toolchain", lessons: 15 },
];

export default function LandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Learn{" "}
          <span className="text-[var(--color-gopher-cyan)]">Go</span> by{" "}
          <span className="text-[var(--color-gopher-cyan)]">running</span> it
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          An interactive tour of Go's syntax, idioms, and toolchain — built for
          experienced engineers who learn by doing.
        </p>
        <Link
          to="/lesson/hello-world"
          className="inline-block rounded-lg bg-[var(--color-gopher-cyan)] text-white font-semibold px-6 py-3 hover:bg-[var(--color-gopher-cyan-light)] transition-colors"
        >
          Start from the beginning →
        </Link>
      </section>

      {/* Section overview */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Jump to a topic</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.letter}
              to={`/lesson/section-${s.letter.toLowerCase()}`}
              className="group rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-[var(--color-gopher-cyan)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-gopher-cyan)]/10 text-[var(--color-gopher-cyan)] font-mono font-bold text-sm">
                  {s.letter}
                </span>
                <div>
                  <p className="font-semibold group-hover:text-[var(--color-gopher-cyan)] transition-colors">
                    {s.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {s.lessons} lesson{s.lessons !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}