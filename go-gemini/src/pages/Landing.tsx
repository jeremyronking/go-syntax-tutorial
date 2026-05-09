import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'a', title: 'Section A — Language fundamentals' },
  { id: 'b', title: 'Section B — Control flow' },
  { id: 'c', title: 'Section C — Composite types' },
  { id: 'd', title: 'Section D — Functions' },
  { id: 'e', title: 'Section E — Interfaces & polymorphism' },
  { id: 'f', title: 'Section F — Generics' },
  { id: 'g', title: 'Section G — Errors, panic, recover' },
  { id: 'h', title: 'Section H — Concurrency' },
  { id: 'i', title: 'Section I — Packages & project layout' },
  { id: 'j', title: 'Section J — Reflection & low-level' },
  { id: 'k', title: 'Section K — Toolchain' },
]

export default function Landing() {
  return (
    <div className="max-w-[72ch] mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4">GoTour</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
        An interactive Go syntax & toolchain tutorial for experienced software engineers.
      </p>

      <div className="flex gap-4 mb-12">
        <Link
          to="/lesson/hello-world"
          className="bg-gotour-cyan text-zinc-900 px-4 py-2 rounded font-medium hover:brightness-110 transition-all"
        >
          Start from beginning
        </Link>
        <a
          href="#topics"
          className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Jump to a topic
        </a>
      </div>

      <h2 id="topics" className="text-2xl font-bold mb-6 pt-4">Course Sections</h2>
      <ul className="space-y-4">
        {SECTIONS.map(s => (
          <li key={s.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold">{s.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  )
}
