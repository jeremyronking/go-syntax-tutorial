import type { Lesson } from '../content/types';
import { CodeRunner } from './CodeRunner';
import { TerminalPane } from './TerminalPane';

export function CodeArea({ lesson }: { lesson: Lesson }) {
  if (lesson.runMode === 'playground' && lesson.starterCode) {
    return <CodeRunner lesson={lesson} />;
  }
  if (lesson.runMode === 'terminal' && lesson.terminalOutput) {
    return <TerminalPane lines={lesson.terminalOutput} />;
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
