# Contributing to GoTour

Thank you for contributing! This document outlines how to add new lessons to the GoTour platform.

## Adding a Lesson

Lessons are organized into sections inside the \`src/content/lessons\` directory. Each section is a TypeScript file that exports an array of \`Lesson\` objects.

### Step-by-Step Guide

1. **Create or Edit a Section File:**
   Open the appropriate file in \`src/content/lessons\` (e.g., \`section-a.ts\`) or create a new one.

2. **Define the Lesson:**
   Add a new \`Lesson\` object to the exported array. It must conform to the \`Lesson\` interface defined in \`src/content/types.ts\`:

   ```typescript
   import type { Lesson } from '../types'

   export const sectionZLessons: Lesson[] = [
     {
       slug: 'my-new-lesson',
       title: 'My New Lesson',
       section: 'Section Z: Advanced Topics',
       order: 100,
       runMode: 'playground', // or 'terminal'
       body: 'Markdown content goes here...',
       starterCode: 'package main\\n\\nfunc main() {}',
       // Optional fields:
       // gotcha: 'A warning or tip to display in a yellow box.',
       // streamReplay: true, // Auto-plays terminal output
       // terminalOutput: [{ kind: 'command', text: '$ run' }, { kind: 'stdout', text: 'Output' }],
       // checkpoint: { ... } // See Checkpoints below
     }
   ]
   ```

3. **Choose the Run Mode:**
   - \`playground\`: The code is editable and executable by the user via WebAssembly. Use \`starterCode\`.
   - \`terminal\`: The code/command output is pre-baked and displayed in a mocked terminal. Use \`terminalOutput\`.

4. **Register the Lesson (If creating a new file):**
   If you created a new \`section-*.ts\` file, you must import and add its lessons to the main registry in \`src/content/lessons.ts\`:

   ```typescript
   import { sectionZLessons } from './lessons/section-z'
   
   export const lessons: Lesson[] = [
     // ... other lessons
     ...sectionZLessons
   ]
   ```

### Checkpoints

At the end of a section, you can add a \`checkpoint\` property to test the user's knowledge. Checkpoints contain questions (MCQ or Fill-in-the-blank):

```typescript
checkpoint: {
  id: 'checkpoint-z',
  questions: [
    {
      id: 'cp-z-1',
      prompt: 'What does this function do?',
      type: 'mcq',
      options: ['Option 1', 'Option 2', 'Option 3'],
      correctIndex: 1,
      explanation: 'Detailed explanation for the correct answer.'
    },
    {
      id: 'cp-z-2',
      prompt: 'Type the command to build a Go app.',
      type: 'fill',
      acceptedAnswers: ['go build'],
      explanation: 'go build compiles the code.'
    }
  ]
}
```

## Running the Project Locally

To verify your new lesson, run the dev server:

```bash
pnpm install
pnpm dev
```

Visit the app in your browser and ensure your lesson renders correctly, formatting looks good, and code runs as expected.
