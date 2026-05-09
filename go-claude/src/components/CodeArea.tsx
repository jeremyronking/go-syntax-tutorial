import type { Lesson } from '../content/types';
import { CodeRunner } from './CodeRunner';

export function CodeArea({ lesson }: { lesson: Lesson }) {
  if (lesson.runMode === 'playground' && lesson.starterCode) {
    return <CodeRunner lesson={lesson} />;
  }
  if (lesson.runMode === 'terminal' && lesson.terminalOutput) {
    // Phase 06 supplies the real TerminalPane.
    return (
      <div className="rounded-md border border-ink-800 bg-ink-900/40 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-800 px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
            Terminal (preview)
          </span>
        </div>
        <pre className="p-4 text-sm font-mono overflow-x-auto">
          {lesson.terminalOutput.map((l) => l.text).join('\n')}
        </pre>
      </div>
    );
  }
  if (lesson.runMode === 'annotated' && lesson.starterCode) {
    return (
      <pre className="rounded-md border border-ink-800 bg-ink-900/40 p-4 text-sm font-mono overflow-x-auto">
        {lesson.starterCode}
      </pre>
    );
  }
  return null;
}
