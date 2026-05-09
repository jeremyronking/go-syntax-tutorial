import type { Lesson } from '../types';

export const stdlibInterfaces: Lesson = {
  slug: 'stdlib-interfaces',
  title: 'Stdlib interfaces — error, Stringer, io.Reader/Writer',
  sectionId: 'interfaces',
  order: 27,
  runMode: 'playground',
  body: `Three interfaces dominate Go: \`error\` (\`Error() string\`), \`fmt.Stringer\` (\`String() string\`, used by \`%v\`/\`%s\`), and the \`io.Reader\`/\`io.Writer\` pair that streaming I/O is built on.

Implement them on your types whenever it makes sense. The compiler line \`var _ io.Reader = (*MyType)(nil)\` is a static assertion.`,
  starterCode: `package main

import (
	"fmt"
	"io"
	"strings"
)

type Money struct{ Cents int }

func (m Money) String() string {
	return fmt.Sprintf("$%d.%02d", m.Cents/100, m.Cents%100)
}

func main() {
	fmt.Println(Money{Cents: 1234}) // calls String() automatically

	r := strings.NewReader("io.Reader is an interface")
	buf, _ := io.ReadAll(r)
	fmt.Println(string(buf))
}
`,
};
