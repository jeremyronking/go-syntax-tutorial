import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import LessonPage from './pages/LessonPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lesson/:slug" element={<LessonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-gopher-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold">No such page</h1>
        <a href="/" className="mt-4 inline-block text-sm text-gopher-400 hover:underline">
          Back to GoTour
        </a>
      </div>
    </main>
  );
}
