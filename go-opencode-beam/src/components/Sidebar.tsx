import { Link, useParams } from 'react-router-dom';
import { lessons } from '../content/lessons';

export default function Sidebar() {
  const { slug } = useParams();
  const sections = Array.from(new Set(lessons.map((l) => l.section)));
  return (
    <nav className="p-3 text-sm">
      {sections.map((sec) => (
        <div key={sec} className="mb-3">
          <div className="font-semibold text-fg-muted mb-1">{sec}</div>
          <ul>
            {lessons
              .filter((l) => l.section === sec)
              .sort((a, b) => a.order - b.order)
              .map((l) => (
                <li key={l.slug}>
                  <Link
                    to={`/lesson/${l.slug}`}
                    className={`block px-2 py-1 rounded hover:bg-card ${slug === l.slug ? 'bg-card text-gopher' : ''}`}
                  >
                    <span className="text-fg-subtle mr-2">{l.order}.</span>
                    {l.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
      {lessons.length === 0 && <p className="text-fg-muted">No lessons yet.</p>}
    </nav>
  );
}
