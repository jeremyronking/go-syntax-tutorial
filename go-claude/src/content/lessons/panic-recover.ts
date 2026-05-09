import type { Lesson } from '../types';

export const panicRecover: Lesson = {
  slug: 'panic-recover',
  title: 'panic, recover — and when each is right',
  sectionId: 'errors',
  order: 33,
  runMode: 'playground',
  body: `\`panic\` is for **invariants you should never reach** — programmer errors. \`error\` is for predictable failures the caller must handle.

\`recover\` only works inside a deferred function. Idiomatic use: at the boundary of a goroutine or RPC handler, turn an unexpected panic into a structured error and log. Don't reach for panic/recover for control flow — Go is not Python.`,
  starterCode: `package main

import "fmt"

func safeCall(f func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	f()
	return nil
}

func main() {
	err := safeCall(func() { panic("kaboom") })
	fmt.Println("after panic, err:", err)
}
`,
  gotcha: `\`recover\` outside a deferred function is a no-op. It also doesn't recover panics on *other* goroutines — every goroutine you spawn needs its own panic guard if you want to survive its crash.`,
};
