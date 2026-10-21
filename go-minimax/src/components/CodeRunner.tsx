import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { Lesson } from '../content/types';
import { compile, type PlaygroundEvent } from '../lib/playground';
import { useProgressStore } from '../store/progress';

const NS_PER_MS = 1_000_000;
/** Never stall the replay for longer than this on a single event. */
const MAX_EVENT_DELAY_MS = 2_000;
/** How long to wait after the last keystroke before persisting a draft. */
const DRAFT_DEBOUNCE_MS = 500;

type RunStatus = 'idle' | 'running' | 'replaying' | 'done' | 'error';

type OutputBlock =
  | { kind: 'stdout' | 'stderr'; text: string }
  | { kind: 'compile-error'; text: string }
  | { kind: 'vet-error'; text: string };

export type CodeRunnerProps = {
  lesson: Lesson;
  initialCode?: string;
  onChange?: (code: string) => void;
  onRun?: () => void;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

export function CodeRunner({ lesson, initialCode, onChange, onRun }: CodeRunnerProps) {
  const setEditorDraft = useProgressStore((s) => s.setEditorDraft);
  const setLessonStatus = useProgressStore((s) => s.setLessonStatus);
  const persistedDraft = useProgressStore((s) => s.editorDrafts[lesson.slug]);

  const [code, setCode] = useState(
    initialCode ?? persistedDraft ?? lesson.starterCode ?? ''
  );
  const [output, setOutput] = useState<OutputBlock[]>([]);
  const [status, setStatus] = useState<RunStatus>('idle');
  const skipRef = useRef(false);
  const runRef = useRef<() => void>(() => {});
  const codeRef = useRef(code);
  const draftTimer = useRef<number | undefined>(undefined);
  codeRef.current = code;

  // Persist the draft a beat after the last keystroke.
  const scheduleDraft = useCallback(
    (next: string) => {
      window.clearTimeout(draftTimer.current);
      draftTimer.current = window.setTimeout(() => {
        setEditorDraft(lesson.slug, next);
      }, DRAFT_DEBOUNCE_MS);
    },
    [lesson.slug, setEditorDraft]
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(draftTimer.current);
    };
  }, []);

  const skipReplay = useCallback(() => {
    skipRef.current = true;
  }, []);

  const run = useCallback(async () => {
    skipRef.current = false;
    setOutput([]);
    setStatus('running');
    setLessonStatus(lesson.slug, 'in-progress');
    onRun?.();

    let response;
    try {
      response = await compile({ body: codeRef.current });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput([{ kind: 'compile-error', text: message }]);
      setStatus('error');
      return;
    }

    const blocks: OutputBlock[] = [];

    // Compiler and vet diagnostics are rendered verbatim — no friendly wrapper.
    if (response.Errors) {
      blocks.push({ kind: 'compile-error', text: response.Errors });
    }
    if (response.VetErrors) {
      blocks.push({ kind: 'vet-error', text: response.VetErrors });
    }

    const events = response.Events ?? [];
    const wantsReplay = lesson.streamReplay === true;
    const hasDelay = events.some((e) => e.Delay > 0);

    if (!wantsReplay || !hasDelay || prefersReducedMotion()) {
      for (const e of events) {
        blocks.push({ kind: e.Kind, text: e.Message });
      }
      setOutput(blocks);
      setStatus('done');
      return;
    }

    setOutput(blocks);
    setStatus('replaying');

    let emitted = 0;
    for (const event of events) {
      if (skipRef.current) break;
      const delay = Math.min(MAX_EVENT_DELAY_MS, Math.max(0, Math.round(event.Delay / NS_PER_MS)));
      if (delay > 0) {
        await interruptibleSleep(delay, skipRef);
      }
      if (skipRef.current) break;
      blocks.push({ kind: event.Kind, text: event.Message });
      emitted += 1;
      setOutput([...blocks]);
    }

    // "Skip animation" jumps straight to the final state.
    if (skipRef.current) {
      for (let i = emitted; i < events.length; i += 1) {
        const event = events[i];
        if (event) blocks.push({ kind: event.Kind, text: event.Message });
      }
    }

    setOutput(blocks);
    setStatus('done');
  }, [lesson.slug, lesson.streamReplay, onRun, setLessonStatus]);

  runRef.current = () => {
    void run();
  };

  useEffect(() => {
    if (initialCode !== undefined && initialCode !== code) {
      setCode(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const reset = () => {
    const starter = lesson.starterCode ?? '';
    skipRef.current = true;
    setCode(starter);
    setOutput([]);
    setStatus('idle');
    onChange?.(starter);
    setEditorDraft(lesson.slug, starter);
  };

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      void run();
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-surface/40">
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
          Playground
        </span>
        <div className="ml-auto flex items-center gap-2">
          {status === 'replaying' && (
            <button
              type="button"
              onClick={skipReplay}
              className="rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:text-gopher"
            >
              Skip animation
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:text-gopher"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={status === 'running' || status === 'replaying'}
            className="rounded bg-gopher px-3 py-1 text-xs font-medium text-ink-950 transition-colors hover:bg-gopher-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'running' ? 'Running…' : 'Run ⌘↵'}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage="go"
          theme="vs-dark"
          value={code}
          onChange={(v) => {
            const next = v ?? '';
            setCode(next);
            onChange?.(next);
            scheduleDraft(next);
          }}
          onMount={handleMount}
          options={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            tabSize: 4,
            insertSpaces: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {output.length > 0 && (
        <div
          className="max-h-[35vh] shrink-0 overflow-y-auto border-t border-line bg-app"
          role="log"
          aria-live="polite"
          aria-label="Program output"
        >
          <div className="px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">Output</p>
            <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {output.map((block, i) => (
                <span
                  key={i}
                  className={
                    block.kind === 'stdout' ? 'text-fg' : 'text-red-400'
                  }
                >
                  {block.text}
                </span>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sleep that resolves early when the replay is skipped, so the Skip button
 * feels instant rather than waiting out the remaining delay.
 */
function interruptibleSleep(ms: number, skipRef: { current: boolean }): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = window.setInterval(() => {
      if (skipRef.current || Date.now() - started >= ms) {
        window.clearInterval(tick);
        resolve();
      }
    }, 30);
  });
}

export type { PlaygroundEvent };
