import { useParams } from "react-router-dom";

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="max-w-[var(--prose-width)] mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">
        Lesson placeholder: <span className="text-[var(--color-gopher-cyan)]">{slug}</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Real lesson content will appear here once the lesson framework is implemented.
      </p>
    </div>
  );
}