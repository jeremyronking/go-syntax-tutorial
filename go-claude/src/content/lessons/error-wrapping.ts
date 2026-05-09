import type { Lesson } from '../types';

export const errorWrapping: Lesson = {
  slug: 'error-wrapping',
  title: 'Wrapping with %w',
  sectionId: 'errors',
  order: 32,
  runMode: 'playground',
  body: `\`fmt.Errorf("loading %s: %w", path, err)\` wraps \`err\` so \`errors.Is\`/\`As\` can walk the chain. Use \`%w\` (one only per format string) when you want callers to pattern-match the cause; use \`%v\` when you only want a string.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
	"io"
)

func openCfg(path string) error {
	// pretend the OS told us EOF:
	return fmt.Errorf("loading %s: %w", path, io.EOF)
}

func main() {
	err := openCfg("/etc/cfg")
	fmt.Println(err)

	if errors.Is(err, io.EOF) {
		fmt.Println("root cause is EOF")
	}
}
`,
};
