import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

export default function LessonPlaceholder() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Layout
      aside={
        <div className="p-4">
          <div className="rounded-lg border border-divider bg-card p-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Editor</p>
            <p className="mt-2 text-sm text-muted">
              The Monaco runner arrives with the lesson framework.
            </p>
          </div>
        </div>
      }
    >
      <article className="mx-auto max-w-prose px-5 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Lesson</p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight">{slug}</h1>
        <p className="mt-4 text-muted">
          This route is wired. Lesson prose, code, and gotcha callouts land in the next phases.
        </p>
        <Link to="/" className="mt-8 inline-block text-sm text-gopher-400 hover:underline">
          &larr; Back to overview
        </Link>
      </article>
    </Layout>
  );
}
