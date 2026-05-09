import type { Lesson } from '../types';

export const stringsRunesBytes: Lesson = {
  slug: 'strings-runes-bytes',
  title: 'Strings, runes, bytes',
  sectionId: 'fundamentals',
  order: 6,
  runMode: 'playground',
  body: `A \`string\` is an immutable sequence of bytes. \`len(s)\` returns bytes, not characters. Indexing \`s[i]\` returns a \`byte\`. To iterate codepoints, \`for i, r := range s\` decodes UTF-8 and yields a \`rune\` (an alias for \`int32\`) along with its **byte** offset \`i\`.

\`[]byte(s)\` and \`string(b)\` allocate copies — Go strings are immutable on purpose. \`strings.Builder\` is the idiomatic way to assemble strings without quadratic concatenation.`,
  starterCode: `package main

import "fmt"

func main() {
	s := "héllo"
	fmt.Println("len(bytes):", len(s)) // 6, not 5

	for i, r := range s {
		fmt.Printf("byte=%d rune=%U %q\\n", i, r, string(r))
	}

	// Byte indexing, not rune indexing:
	fmt.Printf("s[0]=%v (byte) %q\\n", s[0], string(s[0]))
}
`,
  gotcha: `\`s[i]\` is a byte, not a character. For non-ASCII you'll get a fragment of a UTF-8 sequence. Always \`range\` for codepoints.`,
};
