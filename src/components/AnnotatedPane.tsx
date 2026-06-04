import Editor from '@monaco-editor/react';

interface AnnotatedPaneProps {
  code: string;
  language?: string;
}

export function AnnotatedPane({ code, language = 'go' }: AnnotatedPaneProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-md border border-ink-700">
      <Editor
        height="320px"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={code}
        options={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 13,
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 4,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
}
