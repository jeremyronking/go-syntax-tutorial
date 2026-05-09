import { useEffect, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { Lesson } from '../content/types';
import { compile, type PlaygroundEvent, type PlaygroundResponse } from '../lib/playground';

const NS_PER_MS = 1_000_000;

type RunStatus = 'idle' | 'running' | 'replaying' | 'done' | 'error';

type Output =
  | { kind: 'stdout' | 'stderr'; text: string }
  | { kind: 'compile-error'; text: string }
  | { kind: 'vet-error'; text: string };

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export function CodeRunner({
  lesson,
  initialCode,
  onChange,
}: {
  lesson: Lesson;
  initialCode?: string;
  onChange?: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode ?? lesson.starterCode ?? '');
  const [output, setOutput] = useState<Output[]>([]);
  const [status, setStatus] = useState<RunStatus>('idle');
  const replayCancel = useRef<{ cancelled: boolean } | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      void runRef.current?.();
    });
  };

  const runRef = useRef<() => Promise<void>>();

  const skipReplay = () => {
    if (replayCancel.current) replayCancel.current.cancelled = true;
  };

  const reset = () => {
    setCode(lesson.starterCode ?? '');
    setOutput([]);
    setStatus('idle');
    skipReplay();
    onChange?.(lesson.starterCode ?? '');
  };

  const run = async () => {
    skipReplay();
    setOutput([]);
    setStatus('running');
    try {
      const response: PlaygroundResponse = await compile({ body: code });
      const out: Output[] = [];

      if (response.Errors) {
        out.push({ kind: 'compile-error', text: response.Errors });
      }
      if (response.VetErrors) {
        out.push({ kind: 'vet-error', text: response.VetErrors });
      }

      const events = response.Events ?? [];
      const shouldReplay =
        lesson.streamReplay === true && !reducedMotion() && events.some((e) => e.Delay > 0);

      if (!shouldReplay) {
        for (const e of events) {
          out.push({ kind: e.Kind, text: e.Message });
        }
        setOutput(out);
        setStatus('done');
        return;
      }

      // Streaming replay
      setOutput(out);
      setStatus('replaying');
      const cancel = { cancelled: false };
      replayCancel.current = cancel;
      await replayEvents(events, cancel, (ev) => {
        out.push({ kind: ev.Kind, text: ev.Message });
        setOutput([...out]);
      });
      if (!cancel.cancelled) {
        setStatus('done');
      } else {
        // dump remaining
        for (const e of events) {
          if (out.find((o) => o.text === e.Message && o.kind === e.Kind)) continue;
          out.push({ kind: e.Kind, text: e.Message });
        }
        setOutput(out);
        setStatus('done');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput([{ kind: 'compile-error', text: msg }]);
      setStatus('error');
    }
  };

  runRef.current = run;

  useEffect(() => {
    if (initialCode !== undefined && initialCode !== code) setCode(initialCode);
    // we only sync incoming initialCode on mount-ish
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  return (
    <div className="rounded-md border border-ink-800 bg-ink-900/40 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-ink-800 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
          Playground
        </span>
        <div className="ml-auto flex items-center gap-2">
          {status === 'replaying' && (
            <button
              type="button"
              onClick={skipReplay}
              className="rounded px-2 py-1 text-xs text-ink-300 hover:text-gopher"
            >
              Skip animation
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded px-2 py-1 text-xs text-ink-300 hover:text-gopher"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={status === 'running' || status === 'replaying'}
            className="rounded bg-gopher px-3 py-1 text-xs font-medium text-ink-950 hover:bg-gopher-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'running' ? 'Running…' : 'Run ⌘↵'}
          </button>
        </div>
      </div>

      <div className="h-[320px]">
        <Editor
          height="100%"
          defaultLanguage="go"
          theme="vs-dark"
          value={code}
          onChange={(v) => {
            const next = v ?? '';
            setCode(next);
            onChange?.(next);
          }}
          onMount={handleEditorMount}
          options={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            tabSize: 4,
            insertSpaces: false,
            automaticLayout: true,
          }}
        />
      </div>

      {output.length > 0 && (
        <div className="border-t border-ink-800 bg-ink-950 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Output</p>
          <pre className="mt-2 whitespace-pre-wrap break-words text-sm font-mono leading-relaxed">
            {output.map((o, i) => (
              <span
                key={i}
                className={
                  o.kind === 'compile-error' || o.kind === 'vet-error' || o.kind === 'stderr'
                    ? 'text-red-400'
                    : 'text-ink-100'
                }
              >
                {o.text}
              </span>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

async function replayEvents(
  events: PlaygroundEvent[],
  cancel: { cancelled: boolean },
  emit: (ev: PlaygroundEvent) => void
) {
  for (const ev of events) {
    if (cancel.cancelled) return;
    const ms = Math.min(2000, Math.max(0, Math.round(ev.Delay / NS_PER_MS)));
    if (ms > 0) {
      await new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        const checkCancel = () => {
          if (cancel.cancelled) {
            window.clearTimeout(id);
            resolve();
          }
        };
        const interval = window.setInterval(checkCancel, 30);
        Promise.resolve().then(() => {
          window.clearInterval(interval);
        });
      });
      if (cancel.cancelled) return;
    }
    emit(ev);
  }
}
