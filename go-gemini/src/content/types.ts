export interface Lesson {
  slug: string;
  title: string;
  section: string;
  order: number;
  body: string;
  runMode: "playground" | "terminal" | "annotated";
  starterCode?: string;
  terminalOutput?: string;
  streamReplay?: boolean;
  gotcha?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkpoint?: any;
}
