export type RunMode = 'playground' | 'terminal' | 'annotated';

/**
 * The eleven sections of the tour. Kept as a union so a lesson cannot point
 * at a section that does not exist.
 */
export type SectionId =
  | 'fundamentals'
  | 'control-flow'
  | 'composite-types'
  | 'functions'
  | 'interfaces'
  | 'generics'
  | 'errors'
  | 'concurrency'
  | 'packages'
  | 'low-level'
  | 'toolchain';

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
  sectionId: SectionId;
  title: string;
  questions: Question[];
};

export type Lesson = {
  slug: string;
  title: string;
  sectionId: SectionId;
  order: number;
  /** Markdown prose. */
  body: string;
  runMode: RunMode;
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  /** When true the runner replays stdout in the order the program produced it. */
  streamReplay?: boolean;
  /** Italic note rendered above the prose (concurrency lessons carry a disclaimer). */
  note?: string;
  gotcha?: string;
  checkpoint?: Checkpoint;
};
