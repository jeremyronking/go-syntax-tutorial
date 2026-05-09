export interface TerminalLine {
  kind: "command" | "stdout" | "stderr";
  text: string;
}

export interface BaseQuestion {
  id: string;
  prompt: string;
  explanation: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  correctIndex: number;
}

export interface FillQuestion extends BaseQuestion {
  type: "fill";
  acceptedAnswers: string[];
}

export type Question = MCQQuestion | FillQuestion;

export interface CheckpointDef {
  id: string;
  questions: Question[];
}

export interface Lesson {
  slug: string;
  title: string;
  section: string;
  order: number;
  body: string;
  runMode: "playground" | "terminal" | "annotated";
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  gotcha?: string;
  checkpoint?: CheckpointDef;
}
