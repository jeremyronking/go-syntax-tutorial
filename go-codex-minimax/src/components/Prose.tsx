import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProseProps {
  body: string;
}

export function Prose({ body }: ProseProps): JSX.Element {
  return (
    <div className="prose-tour">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
