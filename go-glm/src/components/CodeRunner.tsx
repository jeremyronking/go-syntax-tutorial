import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { compileGo, type PlaygroundResponse } from "../lib/playground";
import { useProgressStore } from "../store/progress";

interface CodeRunnerProps {
  starterCode: string;
  streamReplay?: boolean;
  slug: string;
}

export default function CodeRunner({ starterCode, streamReplay, slug }: CodeRunnerProps) {
  const editorDraft = useProgressStore((s) => s.editorDrafts[slug]);
  const [code, setCode] = useState(editorDraft ?? starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const skipRef = useRef(false);
  const [editorTheme, setEditorTheme] = useState(document.documentElement.classList.contains("dark") ? "vs-dark" : "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setEditorTheme(document.documentElement.classList.contains("dark") ? "vs-dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );

  const setEditorDraft = useProgressStore((s) => s.setEditorDraft);
  const setLessonStatus = useProgressStore((s) => s.setLessonStatus);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput([]);
    setErrors(null);
    skipRef.current = false;
    setLessonStatus(slug, "in-progress");

    try {
      const res: PlaygroundResponse = await compileGo(code);

      if (res.Errors) {
        setErrors(res.Errors);
        setRunning(false);
        return;
      }

      if (res.VetErrors) {
        setErrors(res.VetErrors);
      }

      if (!streamReplay || !res.Events?.length) {
        setOutput(res.Events.map((e) => e.Message));
        setRunning(false);
        return;
      }

      if (prefersReducedMotion.current) {
        setOutput(res.Events.map((e) => e.Message));
        setRunning(false);
        return;
      }

      setReplaying(true);
      const accumulated: string[] = [];

      for (const event of res.Events) {
        if (skipRef.current) {
          accumulated.push(event.Message);
          continue;
        }

        const delayMs = event.Delay / 1_000_000;
        if (delayMs > 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
        }
        accumulated.push(event.Message);
        setOutput([...accumulated]);
      }

      setReplaying(false);
      setRunning(false);
    } catch (err) {
      setErrors(err instanceof Error ? err.message : "Unknown error");
      setRunning(false);
    }
  }, [code, streamReplay, slug, setLessonStatus]);

  const handleReset = useCallback(() => {
    setCode(starterCode);
    setOutput([]);
    setErrors(null);
    setReplaying(false);
    skipRef.current = false;
    setEditorDraft(slug, starterCode);
  }, [starterCode, slug, setEditorDraft]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? "";
      setCode(v);
      setEditorDraft(slug, v);
    },
    [slug, setEditorDraft],
  );

  const hasOutput = errors || output.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
        <button
          onClick={handleRun}
          disabled={running}
          className="px-3 py-1.5 rounded bg-[var(--color-gopher-cyan)] text-white text-sm font-medium disabled:opacity-50 hover:bg-[var(--color-gopher-cyan-light)] transition-colors"
        >
          {running && !replaying ? "Running…" : "Run"}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
        {replaying && (
          <button
            onClick={() => { skipRef.current = true; }}
            className="px-3 py-1.5 rounded border border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            Skip animation →
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">⌘Enter</span>
      </div>

      {/* Editor — scrolls when content is long; shrinks when output appears */}
      <div className={hasOutput ? "h-[45%]" : "flex-1"}>
        <Editor
          height="100%"
          language="go"
          theme={editorTheme}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output — always visible; fills remaining space below editor */}
      <div className={hasOutput ? "flex-1 min-h-0" : "h-[120px] shrink-0"}>
        <div className="h-full flex flex-col border-t border-gray-200 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
            Output
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-950 p-3">
            {errors && (
              <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">{errors}</pre>
            )}
            {output.length > 0 && (
              <pre className="font-mono text-sm whitespace-pre-wrap text-gray-100">
                {output.join("")}
              </pre>
            )}
            {!errors && output.length === 0 && !running && (
              <p className="text-gray-500 text-sm">Output will appear here after running.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}