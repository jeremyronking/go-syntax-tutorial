import type { Lesson } from '../types';

export const contextLesson: Lesson = {
  slug: 'context',
  title: 'context.Context — cancellation & deadlines',
  sectionId: 'concurrency',
  order: 40,
  runMode: 'playground',
  body: `\`context.Context\` carries a cancellation signal across API boundaries. Long-running calls accept \`ctx context.Context\` as the **first parameter**. \`ctx.Done()\` is a channel that closes when the context is cancelled or times out.

Derive child contexts: \`context.WithCancel\`, \`WithTimeout\`, \`WithDeadline\`, \`WithValue\`. Always \`defer cancel()\` to release resources, even on the success path.`,
  starterCode: `package main

import (
	"context"
	"fmt"
	"time"
)

func slow(ctx context.Context) error {
	select {
	case <-time.After(200 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	if err := slow(ctx); err != nil {
		fmt.Println("err:", err) // context deadline exceeded
		return
	}
	fmt.Println("ok")
}
`,
  gotcha: `Don't smuggle business data through \`context.WithValue\` — it's for request-scoped metadata only (request IDs, auth tokens). Function parameters are still how you pass actual arguments.`,
  concurrencyNote: true,
};
