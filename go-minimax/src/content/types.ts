export type RunMode = 'playground' | 'terminal' | 'annotated';

export type TerminalLine =
  | { kind: 'command'; text: string }
  | { kind: 'stdout'; text: string }
  | { kind: 'stderr'; text: string };

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
  /** Concurrency lessons carry the deterministic-clock disclaimer. */
  note?: string;
  gotcha?: string;
  checkpoint?: Checkpoint;
};
