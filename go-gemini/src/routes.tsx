import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Landing from './pages/Landing'

const LessonView = lazy(() => import('./pages/LessonView'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'lesson/:slug',
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center p-8 text-zinc-500">Loading lesson...</div>}>
            <LessonView />
          </Suspense>
        )
      }
    ]
  }
])

export default function Routes() {
  return <RouterProvider router={router} />
}
