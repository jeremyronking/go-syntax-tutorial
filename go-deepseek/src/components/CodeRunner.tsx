import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Lesson } from '../content/types';
import { delayToMs, runProgram, type PlaygroundEvent, type PlaygroundResponse } from '../lib/playground';
import { useThemeStore } from '../store/theme';
import { useEditorDraft } from '../store/progress';

type CodeRunnerProps = {
  lesson: Lesson;
  onDraftChange?: (source: string) => void;
  onRun?: () => void;
};

type RunState =
  | { phase: 'idle' }
  | { phase: 'running' }
  | { phase: 'replaying' };

export default function CodeRunner({ lesson, onDraftChange, onRun }: CodeRunnerProps) {
  const starter = lesson.starterCode ?? '';
  const savedDraft = useEditorDraft(lesson.slug);
  const [source, setSource] = useState(savedDraft ?? starter);
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [events, setEvents] = useState<PlaygroundEvent[]>([]);
  const [state, setState] = useState<RunState>({ phase: 'idle' });
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const theme = useThemeStore((store) => store.theme);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    setSource(starter);
    setResponse(null);
    setEvents([]);
    setError(null);
    setState({ phase: 'idle' });
    clearTimers();
  }, [starter, clearTimers]);

  const run = useCallback(async () => {
    clearTimers();
    onRun?.();
    setError(null);
    setResponse(null);
    setEvents([]);
    setState({ phase: 'running' });

    try {
      const result = await runProgram(source);
      setResponse(result);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const streamed =
        lesson.streamReplay === true && !reducedMotion && result.Events.some((event) => event.Delay > 0);
      if (!streamed) {
        setEvents(result.Events);
        setState({ phase: 'idle' });
        return;
      }

      setState({ phase: 'replaying' });
      let elapsed = 0;
      result.Events.forEach((event, index) => {
        elapsed += delayToMs(event.Delay);
        const timer = window.setTimeout(() => {
          setEvents((current) => [...current, event]);
          if (index === result.Events.length - 1) setState({ phase: 'idle' });
        }, elapsed);
        timers.current.push(timer);
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not reach the Playground proxy.');
      setState({ phase: 'idle' });
    }
  }, [clearTimers, lesson.streamReplay, onRun, source]);

  const skipReplay = useCallback(() => {
    clearTimers();
    if (response) setEvents(response.Events);
    setState({ phase: 'idle' });
  }, [clearTimers, response]);

  const reset = useCallback(() => {
    clearTimers();
    setSource(starter);
    onDraftChange?.(starter);
    setResponse(null);
    setEvents([]);
    setError(null);
    setState({ phase: 'idle' });
  }, [clearTimers, onDraftChange, starter]);

  const updateSource = useCallback(
    (value: string | undefined) => {
      const next = value ?? '';
      setSource(next);
      onDraftChange?.(next);
    },
    [onDraftChange]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        if (state.phase === 'idle') void run();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [run, state.phase]);

  const busy = state.phase === 'running';

  return (
    <section
      className="flex h-full min-h-[24rem] flex-col bg-app lg:min-h-0"
      aria-label={`Code runner for ${lesson.title}`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-divider px-3 py-2">
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="rounded-md bg-gopher-500 px-3 py-1.5 text-sm font-semibold text-[#06232b] transition-colors hover:bg-gopher-400 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Running…' : 'Run'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-divider bg-elevated px-3 py-1.5 text-sm text-muted transition-colors hover:border-gopher-600 hover:text-fg"
        >
          Reset
        </button>
        {state.phase === 'replaying' ? (
          <button
            type="button"
            onClick={skipReplay}
            className="rounded-md border border-gopher-700 bg-gopher-900/30 px-3 py-1.5 text-sm text-gopher-300 hover:bg-gopher-900/50"
          >
            Skip animation
          </button>
        ) : null}
        <span className="ml-auto hidden font-mono text-[11px] text-subtle sm:inline">
          &#8984;Enter
        </span>
      </div>

      <div className="min-h-[18rem] flex-1 lg:min-h-[16rem]">
        <Editor
          height="100%"
          language="go"
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={source}
          onChange={updateSource}
          loading={
            <span className="grid h-full place-items-center font-mono text-xs text-subtle">
              Loading editor…
            </span>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 10, bottom: 10 },
            renderLineHighlight: 'none',
            wordWrap: 'on',
          }}
        />
      </div>

      <div className="max-h-[16rem] min-h-[5rem] overflow-auto border-t border-divider bg-[#070a12] px-3 py-2 lg:max-h-[14rem]">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Output
        </p>
        {error ? <OutputError text={error} /> : null}
        {response?.Errors ? <OutputError text={response.Errors} /> : null}
        {response?.VetErrors ? <OutputError text={response.VetErrors} prefix="vet: " /> : null}
        {!error && !response?.Errors && !response?.VetErrors && events.length === 0 ? (
          <p className="font-mono text-xs text-slate-500">
            {busy ? 'Compiling and running…' : 'Run the snippet to see output.'}
          </p>
        ) : null}
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
          {events.map((event, index) => (
            <span
              key={`${event.Kind}-${index}`}
              className={event.Kind === 'stderr' ? 'text-red-400' : 'text-slate-200'}
            >
              {event.Message}
            </span>
          ))}
        </pre>
      </div>
    </section>
  );
}

function OutputError({ text, prefix = '' }: { text: string; prefix?: string }) {
  return (
    <pre className="mb-2 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-red-400">
      {prefix}
      {text}
    </pre>
  );
}
