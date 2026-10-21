import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LessonView from './components/LessonView';
import Landing from './components/Landing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="lesson/:slug" element={<LessonView />} />
      </Route>
    </Routes>
  );
}
