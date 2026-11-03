export type RunMode = 'playground' | 'terminal' | 'annotated';

export type TerminalLine = {
  kind: 'command' | 'stdout' | 'stderr';
  text: string;
};

export type McqQuestion = {
  kind: 'mcq';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type FillQuestion = {
  kind: 'fill';
  prompt: string;
  acceptedAnswers: string[];
  explanation: string;
};

export type Question = McqQuestion | FillQuestion;

export type Checkpoint = {
  id: string;
  sectionId: string;
  title: string;
  questions: Question[];
};

export type Lesson = {
  slug: string;
  title: string;
  sectionId: string;
  order: number;
  body: string;
  runMode: RunMode;
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  /** Shows the Playground deterministic-clock note on concurrency lessons. */
  concurrencyNote?: boolean;
  gotcha?: string;
  checkpoint?: Checkpoint;
};
