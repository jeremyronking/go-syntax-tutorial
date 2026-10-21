import { useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { lessonBySlug, lessons } from '../content/lessons';
import CodeRunner from './CodeRunner';
import TerminalPane from './TerminalPane';
import Checkpoint from './Checkpoint';
import { useProgressStore } from '../store/progress';

export default function LessonView() {
  const { slug } = useParams();
  const lesson = slug ? lessonBySlug(slug) : undefined;
  const setStatus = useProgressStore((s) => s.setStatus);

  if (!lesson) {
    return <div className="p-8 text-fg-muted">Lesson not found.</div>;
  }

  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  return (
    <div className="p-6 grid lg:grid-cols-2 gap-6">
      <article className="prose max-w-prose">
        <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
        <div className="text-fg-muted text-sm mb-4">{lesson.section}</div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
        {lesson.gotcha && (
          <div className="mt-6 border-l-4 border-gopher bg-card p-4 rounded">
            <div className="font-semibold text-gopher mb-1">Gotcha</div>
            <p>{lesson.gotcha}</p>
          </div>
        )}
        {lesson.streamReplay && (
          <p className="mt-4 italic text-fg-subtle text-sm">
            Playground uses a deterministic fake clock; real runtime scheduling will differ.
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStatus(lesson.slug, 'complete')}
            className="text-sm border border-divider rounded px-3 py-1 hover:bg-card"
          >
            Mark complete
          </button>
        </div>
        {lesson.checkpoint && <div className="mt-6"><Checkpoint checkpoint={lesson.checkpoint} /></div>}
        <div className="mt-6 flex justify-between text-sm">
          {prev ? <Link to={`/lesson/${prev.slug}`} className="text-gopher">← {prev.title}</Link> : <span />}
          {next ? <Link to={`/lesson/${next.slug}`} className="text-gopher">{next.title} →</Link> : <span />}
        </div>
      </article>
      <div>
        {lesson.runMode === 'playground' && lesson.starterCode && (
          <CodeRunner lesson={lesson} />
        )}
        {lesson.runMode === 'terminal' && lesson.terminalOutput && (
          <TerminalPane lines={lesson.terminalOutput} />
        )}
        {lesson.runMode === 'annotated' && lesson.starterCode && (
          <pre className="bg-card p-4 rounded overflow-auto text-sm"><code>{lesson.starterCode}</code></pre>
        )}
      </div>
    </div>
  );
}
