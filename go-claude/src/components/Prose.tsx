import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Prose({ children }: { children: string }) {
  return (
    <div className="prose-gotour max-w-prose text-ink-100 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...rest }) {
            const isBlock = /\n/.test(String(children));
            if (isBlock) {
              return (
                <pre className="my-4 rounded-md bg-ink-900 border border-ink-800 p-4 overflow-x-auto text-sm">
                  <code className={className} {...rest}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-ink-900 px-1.5 py-0.5 text-[0.85em]" {...rest}>
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
          h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-5 text-lg font-semibold">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>,
          p: ({ children }) => <p className="my-3">{children}</p>,
          em: ({ children }) => <em className="italic text-ink-200">{children}</em>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
