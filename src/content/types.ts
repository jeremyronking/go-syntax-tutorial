export type RunMode = "playground" | "terminal" | "annotated";

export interface TerminalLine {
  kind: "command" | "stdout" | "stderr";
  text: string;
}

export interface Question {
  type: "mcq" | "fill";
  prompt: string;
  options?: string[]; // mcq only
  correctIndex?: number; // mcq only
  acceptedAnswers?: string[]; // fill only
  explanation: string;
}

export interface Checkpoint {
  id: string;
  sectionSlug: string;
  questions: Question[];
}

export interface Lesson {
  slug: string;
  title: string;
  section: string; // e.g. "A", "B", "K2"
  order: number;
  body: string; // markdown
  runMode: RunMode;
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  gotcha?: string;
  checkpoint?: Checkpoint;
}