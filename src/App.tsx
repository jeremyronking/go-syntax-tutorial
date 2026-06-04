import { Link } from 'react-router-dom';

export default function App(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-semibold text-white">
        Go<span className="text-gopher-cyan">Tour</span>
      </h1>
      <p className="max-w-prose text-ink-300">
        Hello, GoTour. Project scaffold is up. Routing, theming, and the lesson
        framework land in the next phases.
      </p>
      <Link
        to="/lesson/hello-world"
        className="text-sm text-gopher-cyan underline decoration-gopher-cyan/40 hover:decoration-gopher-cyan"
      >
        Visit the placeholder lesson (coming in Phase 04)
      </Link>
    </main>
  );
}
