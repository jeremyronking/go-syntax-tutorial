import { tokenizeGo, type TokenKind } from '../lib/highlight';

const CLASSES: Record<TokenKind, string> = {
  plain: 'text-slate-200',
  keyword: 'text-[#7fd6f7]',
  string: 'text-[#a5d6a7]',
  comment: 'text-slate-500 italic',
  number: 'text-[#f0b37e]',
};

type AnnotatedPaneProps = {
  source: string;
};

/** Static, read-only snippet. No editor, no controls. */
export default function AnnotatedPane({ source }: AnnotatedPaneProps) {
  const tokens = tokenizeGo(source);

  return (
    <section
      className="flex h-full min-h-[16rem] flex-col bg-[#070a12]"
      aria-label="Annotated code"
    >
      <div className="border-b border-slate-800 px-3 py-2 font-mono text-[11px] text-slate-500">
        annotated — read only
      </div>
      <pre className="flex-1 overflow-auto px-4 py-3 font-mono text-xs leading-relaxed">
        <code>
          {tokens.map((token, index) => (
            <span key={index} className={CLASSES[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
