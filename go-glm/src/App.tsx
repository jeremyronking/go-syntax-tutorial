import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

const LandingPage = lazy(() => import("./components/LandingPage"));
const LessonView = lazy(() => import("./components/LessonView"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="lesson/:slug" element={<LessonView />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;