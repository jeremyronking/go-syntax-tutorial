import type { Lesson } from '../types';

export const errorInterface: Lesson = {
  slug: 'error-interface',
  title: 'error — sentinels, errors.Is, errors.As',
  sectionId: 'errors',
  order: 31,
  runMode: 'playground',
  body: `\`error\` is the interface \`{ Error() string }\`. Sentinel errors (\`io.EOF\`, \`sql.ErrNoRows\`, your own \`var ErrNotFound = errors.New("...")\`) let callers compare with \`errors.Is\`. \`errors.As\` extracts a wrapped *type* — useful when you wrap a structured error and want to read its fields.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

type PathError struct {
	Path string
	Err  error
}

func (e *PathError) Error() string { return e.Path + ": " + e.Err.Error() }
func (e *PathError) Unwrap() error { return e.Err }

func find() error {
	return &PathError{Path: "/etc/foo", Err: ErrNotFound}
}

func main() {
	err := find()
	fmt.Println(err)
	fmt.Println("is ErrNotFound:", errors.Is(err, ErrNotFound))

	var pe *PathError
	if errors.As(err, &pe) {
		fmt.Println("path was:", pe.Path)
	}
}
`,
};
