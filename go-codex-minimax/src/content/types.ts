export type RunMode = 'playground' | 'terminal' | 'annotated';

export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

export interface Section {
  id: SectionId;
  title: string;
  blurb: string;
}

export interface Lesson {
  slug: string;
  title: string;
  section: SectionId;
  order: number;
  body: string; // markdown
  runMode: RunMode;
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  gotcha?: string;
  checkpointId?: string;
  note?: string; // e.g. deterministic clock disclaimer for concurrency lessons
}

export type TerminalLine =
  | { kind: 'command'; text: string }
  | { kind: 'stdout'; text: string }
  | { kind: 'stderr'; text: string };

export type Question =
  | {
      kind: 'mcq';
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      kind: 'fill';
      id: string;
      prompt: string;
      acceptedAnswers: string[];
      explanation: string;
    };

export interface Checkpoint {
  id: string;
  sectionSlug: SectionId;
  title: string;
  questions: Question[];
  passingPct: number; // 0-100
}
