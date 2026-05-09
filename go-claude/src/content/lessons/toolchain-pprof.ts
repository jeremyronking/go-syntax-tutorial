import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: '# In your code: import _ "net/http/pprof", expose on :6060' },
  { kind: 'command', text: 'go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30' },
  { kind: 'stdout', text: 'Fetching profile over HTTP from http://localhost:6060/debug/pprof/profile?seconds=30\nDuration: 30.05s, Total samples = 28.4s (94.5%)\nEntering interactive mode (type "help" for commands)\n' },
  { kind: 'command', text: '(pprof) top10' },
  { kind: 'stdout', text: 'Showing nodes accounting for 24.10s, 84.86% of 28.40s total\n      flat  flat%   sum%        cum   cum%\n     8.30s 29.23% 29.23%      8.30s 29.23%  runtime.kevent\n     5.20s 18.31% 47.54%      5.20s 18.31%  syscall.syscall\n     3.40s 11.97% 59.51%      3.40s 11.97%  runtime.pthread_cond_wait\n' },
  { kind: 'command', text: 'go tool trace trace.out' },
  { kind: 'stdout', text: '2026/05/09 10:01:00 Parsing trace...\n2026/05/09 10:01:01 Splitting trace...\n2026/05/09 10:01:01 Opening browser. Trace viewer is listening on http://127.0.0.1:54891\n' },
];

export const toolchainPprof: Lesson = {
  slug: 'toolchain-pprof',
  title: 'go tool pprof & go tool trace',
  sectionId: 'toolchain',
  order: 63,
  runMode: 'terminal',
  body: `\`pprof\` profiles CPU, heap, mutex, and block contention. The runtime exposes them via \`net/http/pprof\` (debugging) or \`runtime/pprof\` (one-shot).

\`go tool trace\` consumes a trace file (collected via \`runtime/trace\`) and opens an interactive browser viewer — goroutine timelines, GC events, scheduler latency. Use it when pprof's flat numbers don't tell the timing story.`,
  terminalOutput: lines,
};
