import { Link } from 'react-router-dom';
import { lessons } from '../content/lessons';

export default function Landing() {
  const sections = Array.from(new Set(lessons.map((l) => l.section)));
  const first = [...lessons].sort((a, b) => a.order - b.order)[0];
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">GoTour</h1>
      <p className="text-fg-muted mb-6">Interactive Go syntax & toolchain tutorial.</p>
      {first && (
        <Link to={`/lesson/${first.slug}`} className="inline-block bg-gopher text-white px-4 py-2 rounded mb-8">
          Start from beginning
        </Link>
      )}
      <h2 className="text-xl font-semibold mb-3">Sections</h2>
      <ul className="space-y-2">
        {sections.map((sec) => (
          <li key={sec}>
            <a href={`#${sec}`} className="text-gopher">{sec}</a>
            <span className="text-fg-muted text-sm ml-2">
              ({lessons.filter((l) => l.section === sec).length} lessons)
            </span>
          </li>
        ))}
      </ul>
      {sections.map((sec) => (
        <div key={sec} id={sec} className="mt-8">
          <h3 className="text-lg font-semibold mb-2">{sec}</h3>
          <ul className="grid md:grid-cols-2 gap-1">
            {lessons
              .filter((l) => l.section === sec)
              .sort((a, b) => a.order - b.order)
              .map((l) => (
                <li key={l.slug}>
                  <Link to={`/lesson/${l.slug}`} className="text-gopher text-sm">{l.order}. {l.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
