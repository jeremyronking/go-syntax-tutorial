import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import LessonView from './pages/LessonView'

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
        element: <LessonView />
      }
    ]
  }
])

export default function Routes() {
  return <RouterProvider router={router} />
}
