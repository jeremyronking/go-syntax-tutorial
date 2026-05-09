import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchLessons } from "../lib/search";
import type { Lesson } from "../content/types";

const sectionNames: Record<string, string> = {
  A: "Language Fundamentals",
  B: "Control Flow",
  C: "Composite Types",
  D: "Functions",
  E: "Interfaces & Polymorphism",
  F: "Generics",
  G: "Errors, Panic, Recover",
  H: "Concurrency",
  I: "Packages & Project Layout",
  J: "Reflection & Low-level",
  K: "Toolchain",
  K1: "Toolchain: build/run/modules",
  K2: "Toolchain: test/format/vet/doc",
  K3: "Toolchain: advanced",
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Lesson[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Open/close with Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setResults(searchLessons(""));
      setActiveIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (!open) return;
    const r = searchLessons(query);
    setResults(r);
    setActiveIndex(0);
  }, [query, open]);

  const selectLesson = useCallback(
    (lesson: Lesson) => {
      navigate(`/lesson/${lesson.slug}`);
      setOpen(false);
      setQuery("");
    },
    [navigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        selectLesson(results[activeIndex]);
      }
    },
    [results, activeIndex, selectLesson],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons…"
          className="w-full px-4 py-3 text-lg bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none placeholder:text-gray-400"
        />

        <ul className="max-h-72 overflow-y-auto">
          {results.map((lesson, i) => (
            <li
              key={lesson.slug}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                i === activeIndex
                  ? "bg-[var(--color-gopher-cyan)]/10 text-[var(--color-gopher-cyan)]"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => selectLesson(lesson)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="w-6 text-xs font-mono text-gray-400 shrink-0">
                {lesson.section}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{lesson.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {sectionNames[lesson.section] ?? `Section ${lesson.section}`}
                </p>
              </div>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-400">
              No lessons found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}