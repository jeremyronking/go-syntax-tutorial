interface LessonNoteProps {
  children: string;
}

export function LessonNote({ children }: LessonNoteProps): JSX.Element {
  return (
    <p className="my-2 text-xs italic text-ink-400">{children}</p>
  );
}
