import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type * as monacoNs from 'monaco-editor';
import { compileOnPlayground, nanoToMs, type PlaygroundEvent } from '../lib/playground';

interface CodeRunnerProps {
  lessonSlug: string;
  starterCode: string;
  streamReplay: boolean;
  draft: string | undefined;
  onDraftChange: (value: string) => void;
  onStatusChange?: (status: 'idle' | 'running' | 'replaying' | 'done' | 'error') => void;
}

const GOLANG_LANG_ID = 'go';

let goLanguageRegistered = false;
function ensureGoLanguage(monaco: typeof monacoNs): void {
  if (goLanguageRegistered) return;
  if (!monaco.languages.getLanguages().some((l) => l.id === GOLANG_LANG_ID)) {
    monaco.languages.register({ id: GOLANG_LANG_ID, extensions: ['.go'], aliases: ['Go', 'go'] });
  }
  goLanguageRegistered = true;
}

export function CodeRunner({
  lessonSlug,
  starterCode,
  streamReplay,
  draft,
  onDraftChange,
  onStatusChange,
}: CodeRunnerProps): JSX.Element {
  const [output, setOutput] = useState<string>('');
  const [compileErrors, setCompileErrors] = useState<string>('');
  const [vetErrors, setVetErrors] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'replaying' | 'done' | 'error'>('idle');
  const [replaying, setReplaying] = useState<boolean>(false);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const editorRef = useRef<monacoNs.editor.IStandaloneCodeEditor | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const replayTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const value = useMemo(() => draft ?? starterCode, [draft, starterCode]);

  const setExternalStatus = useCallback(
    (s: 'idle' | 'running' | 'replaying' | 'done' | 'error') => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange],
  );

  const clearReplays = useCallback(() => {
    for (const t of replayTimeoutsRef.current) clearTimeout(t);
    replayTimeoutsRef.current = [];
  }, []);

  const dumpEvents = useCallback((events: PlaygroundEvent[]) => {
    return events
      .map((ev) => ev.Message)
      .join('')
      .replace(/\n$/, '');
  }, []);

  const scheduleReplay = useCallback(
    (events: PlaygroundEvent[]) => {
      clearReplays();
      setReplaying(true);
      setOutput('');
      let cumulative = '';
      events.forEach((ev, idx) => {
        const delay = nanoToMs(ev.Delay);
        const t = setTimeout(() => {
          cumulative += ev.Message;
          setOutput(cumulative.replace(/\n$/, ''));
          if (idx === events.length - 1) setReplaying(false);
        }, idx === 0 ? 0 : delay);
        replayTimeoutsRef.current.push(t);
      });
    },
    [clearReplays],
  );

  const run = useCallback(async () => {
    if (!editorRef.current) return;
    const source = editorRef.current.getValue();
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setExternalStatus('running');
    setOutput('');
    setCompileErrors('');
    setVetErrors('');
    try {
      const res = await compileOnPlayground(source, ac.signal);
      setCompileErrors(res.Errors ?? '');
      setVetErrors(res.VetErrors ?? '');
      if (streamReplay && res.Events.length > 0 && !reduceMotion) {
        setExternalStatus('replaying');
        scheduleReplay(res.Events);
        // Finalize after expected end
        const totalMs = res.Events.reduce((acc, e) => acc + nanoToMs(e.Delay), 0);
        setTimeout(() => setExternalStatus(res.Errors ? 'error' : 'done'), totalMs + 50);
      } else {
        setOutput(dumpEvents(res.Events));
        setExternalStatus(res.Errors ? 'error' : 'done');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setCompileErrors(msg);
      setExternalStatus('error');
    }
  }, [dumpEvents, reduceMotion, scheduleReplay, setExternalStatus, streamReplay]);

  const reset = useCallback(() => {
    if (editorRef.current) editorRef.current.setValue(starterCode);
    onDraftChange(starterCode);
    setOutput('');
    setCompileErrors('');
    setVetErrors('');
    setExternalStatus('idle');
  }, [onDraftChange, setExternalStatus, starterCode]);

  const skipReplay = useCallback(() => {
    clearReplays();
    setReplaying(false);
    setExternalStatus('done');
  }, [clearReplays, setExternalStatus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      clearReplays();
    };
  }, [clearReplays]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    ensureGoLanguage(monaco);
  };

  const statusLabel: Record<typeof status, string> = {
    idle: 'Ready',
    running: 'Compiling…',
    replaying: 'Replaying output…',
    done: 'Done',
    error: 'Error',
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-md border border-ink-700 bg-ink-900">
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-800/60 px-3 py-2 text-sm">
        <button
          type="button"
          onClick={run}
          disabled={status === 'running' || status === 'replaying'}
          className="rounded bg-gopher-cyan px-3 py-1 font-medium text-ink-950 hover:bg-gopher-dark disabled:opacity-50"
        >
          Run <span className="ml-1 font-mono text-xs opacity-75">⌘↵</span>
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-ink-600 px-3 py-1 text-ink-100 hover:border-gopher-cyan hover:text-gopher-cyan"
        >
          Reset
        </button>
        {replaying ? (
          <button
            type="button"
            onClick={skipReplay}
            className="rounded border border-amber-400/60 px-3 py-1 text-amber-200 hover:bg-amber-400/10"
          >
            Skip animation
          </button>
        ) : null}
        <span
          className={`ml-auto font-mono text-xs ${
            status === 'error' ? 'text-red-400' : status === 'done' ? 'text-emerald-400' : 'text-ink-400'
          }`}
        >
          {statusLabel[status]}
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
        <Editor
          height="100%"
          defaultLanguage={GOLANG_LANG_ID}
          language={GOLANG_LANG_ID}
          value={value}
          theme="vs-dark"
          onChange={(v) => onDraftChange(v ?? '')}
          onMount={handleMount}
          options={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            renderLineHighlight: 'gutter',
            padding: { top: 8, bottom: 8 },
          }}
          loading={<div className="p-4 text-sm text-ink-400">Loading editor…</div>}
        />
        <div className="flex min-h-0 flex-col border-t border-ink-700 bg-ink-950">
          <div className="border-b border-ink-800 px-3 py-1 text-xs uppercase tracking-wider text-ink-400">
            Output
          </div>
          <pre className="m-0 flex-1 overflow-auto p-3 font-mono text-sm text-ink-100">
            {compileErrors ? (
              <code className="block whitespace-pre text-red-400">{compileErrors}</code>
            ) : null}
            {vetErrors ? (
              <code className="block whitespace-pre text-red-300">{vetErrors}</code>
            ) : null}
            {output ? <code className="block whitespace-pre">{output}</code> : null}
            {!compileErrors && !vetErrors && !output ? (
              <span className="text-ink-500">No output yet — press Run.</span>
            ) : null}
          </pre>
        </div>
      </div>
      <input type="hidden" value={lessonSlug} readOnly aria-hidden />
    </div>
  );
}
