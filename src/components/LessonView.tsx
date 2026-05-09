import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { lessonBySlug, lessons } from "../content/lessons";
import { useState } from "react";

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = lessonBySlug(slug ?? "");

  const [currentSlug] = useState(slug);

  if (!lesson) {
    return (
      <div className="max-w-[var(--prose-width)] mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No lesson with slug "<code className="text-[var(--color-gopher-cyan)]">{slug}</code>"
          exists yet.
        </p>
        <Link to="/" className="text-[var(--color-gopher-cyan)] hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  // Find prev/next lessons across section boundaries
  const currentIndex = lessons.findIndex((l) => l.slug === currentSlug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Prose pane */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[var(--prose-width)] mx-auto px-6 py-8">
          <span className="text-sm text-[var(--color-gopher-cyan)] font-mono">
            Section {lesson.section}
          </span>
          <h1 className="text-3xl font-bold mt-1 mb-6">{lesson.title}</h1>

          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.body}
            </ReactMarkdown>
          </div>

          {/* Gotcha callout */}
          {lesson.gotcha && (
            <div className="mt-8 rounded-lg border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-4">
              <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                ⚠ Gotcha
              </p>
              <p className="text-amber-900 dark:text-amber-200 text-sm">
                {lesson.gotcha}
              </p>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            {prevLesson ? (
              <Link
                to={`/lesson/${prevLesson.slug}`}
                className="text-sm text-[var(--color-gopher-cyan)] hover:underline"
              >
                ← {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link
                to={`/lesson/${nextLesson.slug}`}
                className="text-sm text-[var(--color-gopher-cyan)] hover:underline"
              >
                {nextLesson.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>

      {/* Code / terminal pane placeholder */}
      <div className="lg:w-[480px] xl:w-[560px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          {lesson.runMode === "playground"
            ? "Code runner will appear here"
            : lesson.runMode === "terminal"
              ? "Terminal pane will appear here"
              : "Annotated code will appear here"}
        </p>
      </div>
    </div>
  );
}