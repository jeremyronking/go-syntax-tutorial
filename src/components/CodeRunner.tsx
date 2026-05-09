import { useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { compileGo, type PlaygroundResponse } from "../lib/playground";

interface CodeRunnerProps {
  starterCode: string;
  streamReplay?: boolean;
  onCodeChange?: (code: string) => void;
}

export default function CodeRunner({ starterCode, streamReplay, onCodeChange }: CodeRunnerProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const skipRef = useRef(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput([]);
    setErrors(null);
    skipRef.current = false;

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

      // Stream replay
      setReplaying(true);
      // Stream replay
      const accumulated: string[] = [];
      let elapsed = 0;

      for (const event of res.Events) {
        if (skipRef.current) {
          accumulated.push(event.Message);
          continue;
        }

        // Delay is in nanoseconds — convert to ms
        const delayMs = event.Delay / 1_000_000;
        elapsed += delayMs;

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
  }, [code, streamReplay]);

  const handleReset = useCallback(() => {
    setCode(starterCode);
    setOutput([]);
    setErrors(null);
    setReplaying(false);
    skipRef.current = false;
    onCodeChange?.(starterCode);
  }, [starterCode, onCodeChange]);

  const handleSkip = useCallback(() => {
    skipRef.current = true;
  }, []);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? "";
      setCode(v);
      onCodeChange?.(v);
    },
    [onCodeChange],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
            onClick={handleSkip}
            className="px-3 py-1.5 rounded border border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            Skip animation →
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          ⌘Enter
        </span>
      </div>

      {/* Monaco editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="go"
          theme="vs-dark"
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

      {/* Output pane */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-950 text-gray-100 max-h-48 overflow-y-auto">
        {errors && (
          <pre className="p-3 text-red-400 font-mono text-sm whitespace-pre-wrap">{errors}</pre>
        )}
        {output.length > 0 && (
          <pre className="p-3 font-mono text-sm whitespace-pre-wrap">
            {output.join("")}
          </pre>
        )}
        {!errors && output.length === 0 && !running && (
          <p className="p-3 text-gray-500 text-sm">Output will appear here after running.</p>
        )}
      </div>
    </div>
  );
}