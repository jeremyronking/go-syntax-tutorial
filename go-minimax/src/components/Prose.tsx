import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
const components: Components = {
  code({ className, children, ...rest }) {
    const text = String(children);
    // A fence always contains a newline; inline code never does.
    const isBlock = text.includes('\n') || /language-/.test(className ?? '');
    if (isBlock) {
      return (
        <pre className="my-4 overflow-x-auto rounded-md border border-line bg-surface p-4 text-sm leading-relaxed">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-surface px-1.5 py-0.5 text-[0.875em] text-gopher" {...rest}>
        {children}
      </code>
    );
  },
  a({ children, ...rest }) {
    return (
      <a className="text-gopher underline-offset-4 hover:underline" {...rest}>
        {children}
      </a>
    );
  },
  h2: ({ children }) => <h2 className="mt-8 text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 text-lg font-semibold">{children}</h3>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  p: ({ children }) => <p className="my-4">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line bg-surface px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-line px-3 py-2 align-top">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-gopher pl-4 text-fg-muted">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-line" />,
};

/**
 * The markdown renderer is the single heaviest dependency in the app and
 * it is only needed once a lesson is open, so `Prose` is loaded lazily
 * (see `LessonView`). This module is the chunk it lands in.
 */
export function Prose({ children }: { children: string }) {
  return (
    <div className="max-w-prose text-fg leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
