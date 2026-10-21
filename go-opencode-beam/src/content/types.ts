export type RunMode = 'playground' | 'terminal' | 'annotated';

export type TerminalLine = { kind: 'command' | 'stdout' | 'stderr'; text: string };

export type Question =
  | { kind: 'mcq'; prompt: string; options: string[]; correctIndex: number; explanation: string }
  | { kind: 'fill'; prompt: string; acceptedAnswers: string[]; explanation: string };

export type Checkpoint = {
  id: string;
  sectionSlug: string;
  questions: Question[];
};

export type Lesson = {
  slug: string;
  title: string;
  section: string;
  sectionSlug: string;
  order: number;
  body: string;
  runMode: RunMode;
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  gotcha?: string;
  checkpoint?: Checkpoint;
};
