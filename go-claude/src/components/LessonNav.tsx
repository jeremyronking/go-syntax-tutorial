import { Link } from 'react-router-dom';
import { lessons } from '../content/lessons';

export function LessonNav({ slug }: { slug: string }) {
  const ordered = [...lessons].sort((a, b) => {
    if (a.sectionId !== b.sectionId) return a.sectionId.localeCompare(b.sectionId);
    return a.order - b.order;
  });
  const idx = ordered.findIndex((l) => l.slug === slug);
  const prev = idx > 0 ? ordered[idx - 1] : undefined;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : undefined;

  return (
    <div className="mt-12 flex items-center justify-between text-sm">
      {prev ? (
        <Link
          to={`/lesson/${prev.slug}`}
          className="text-ink-300 hover:text-gopher transition-colors"
        >
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={`/lesson/${next.slug}`}
          className="text-ink-300 hover:text-gopher transition-colors"
        >
          {next.title} →
        </Link>
      )}
    </div>
  );
}
