import { Link } from 'react-router-dom';
import { lessons } from '../content/lessons';

const sorted = [...lessons].sort((a, b) => a.order - b.order);

/**
 * Previous / next links. Traversal follows the global lesson order, so it
 * crosses section boundaries without a special case.
 */
export function LessonNav({ slug }: { slug: string }) {
  const index = sorted.findIndex((l) => l.slug === slug);
  if (index < 0) return null;

  const previous = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;

  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-10 flex items-stretch justify-between gap-3 border-t border-line pt-5"
    >
      {previous ? (
        <Link
          to={`/lesson/${previous.slug}`}
          className="group flex max-w-[45%] flex-col rounded-md border border-line px-3 py-2 transition-colors hover:border-gopher"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
            ← Previous
          </span>
          <span className="mt-0.5 truncate text-sm text-fg group-hover:text-gopher">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          to={`/lesson/${next.slug}`}
          className="group ml-auto flex max-w-[45%] flex-col items-end rounded-md border border-line px-3 py-2 text-right transition-colors hover:border-gopher"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
            Next →
          </span>
          <span className="mt-0.5 truncate text-sm text-fg group-hover:text-gopher">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
