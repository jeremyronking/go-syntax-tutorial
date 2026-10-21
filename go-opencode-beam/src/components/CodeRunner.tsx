import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Lesson } from '../content/types';
import { useProgressStore } from '../store/progress';

type PlaygroundResponse = {
  Errors: string;
  Events: Array<{ Message: string; Kind: 'stdout' | 'stderr'; Delay: number }>;
  Status: number;
  IsTest: boolean;
  TestsFailed: number;
  VetErrors?: string;
  VetOK?: boolean;
};

type Props = { lesson: Lesson };

export default function CodeRunner({ lesson }: Props) {
  const draft = useProgressStore((s) => s.editorDrafts[lesson.slug]);
  const setDraft = useProgressStore((s) => s.setDraft);
  const setStatus = useProgressStore((s) => s.setStatus);
  const [code, setCode] = useState(draft ?? lesson.starterCode ?? '');
  const [output, setOutput] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [vetErrors, setVetErrors] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    setCode(draft ?? lesson.starterCode ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.slug]);

  useEffect(() => {
    const t = setTimeout(() => setDraft(lesson.slug, code), 400);
    return () => clearTimeout(t);
  }, [code, lesson.slug, setDraft]);

  const run = async () => {
    setRunning(true);
    setOutput('');
    setErrors('');
    setVetErrors('');
    skipRef.current = false;
    setStatus(lesson.slug, 'in-progress');
    try {
      const body = new URLSearchParams();
      body.set('version', '2');
      body.set('body', code);
      body.set('withVet', 'true');
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const data = (await res.json()) as PlaygroundResponse;
      if (data.Errors) setErrors(data.Errors);
      if (data.VetErrors) setVetErrors(data.VetErrors);
      const events = data.Events ?? [];
      if (lesson.streamReplay) {
        setReplaying(true);
        let acc = '';
        for (const ev of events) {
          if (skipRef.current) break;
          const delay = Math.min(ev.Delay / 1e6, 2000);
          if (delay > 0) await new Promise((r) => setTimeout(r, delay));
          if (skipRef.current) break;
          acc += ev.Message;
          setOutput(acc);
        }
        if (skipRef.current) {
          setOutput(events.map((e) => e.Message).join(''));
        }
        setReplaying(false);
      } else {
        setOutput(events.map((e) => e.Message).join(''));
      }
    } catch (e) {
      setErrors(String(e));
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const reset = () => {
    setCode(lesson.starterCode ?? '');
    setOutput('');
    setErrors('');
    setVetErrors('');
  };

  return (
    <div className="border border-divider rounded bg-elevated">
      <div className="flex items-center gap-2 p-2 border-b border-divider">
        <button onClick={run} disabled={running} className="text-sm bg-gopher text-white px-3 py-1 rounded disabled:opacity-50">
          {running ? 'Running…' : 'Run'}
        </button>
        <button onClick={reset} className="text-sm border border-divider rounded px-3 py-1 hover:bg-card">Reset</button>
        {replaying && (
          <button onClick={() => { skipRef.current = true; }} className="text-sm border border-divider rounded px-3 py-1 hover:bg-card">
            Skip animation
          </button>
        )}
        <span className="text-xs text-fg-subtle ml-auto">⌘/Ctrl+Enter</span>
      </div>
      <Editor
        height="320px"
        defaultLanguage="go"
        value={code}
        onChange={(v) => setCode(v ?? '')}
        theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs'}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
      <div className="p-3 font-mono text-sm bg-card min-h-[80px] whitespace-pre-wrap">
        {errors && <div className="text-red-500">{errors}</div>}
        {vetErrors && <div className="text-red-500">{vetErrors}</div>}
        <div>{output}</div>
      </div>
    </div>
  );
}
