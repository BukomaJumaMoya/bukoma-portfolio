import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter, useParams } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'motion/react'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import './index.css'

// Home ships in the main bundle; every other page loads when first visited.
const Work = lazy(() => import('./pages/Work'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const Experience = lazy(() => import('./pages/Experience'))
const Leadership = lazy(() => import('./pages/Leadership'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

function LegacyProject() {
  const { slug } = useParams()
  return <Navigate to={`/work/${slug}`} replace />
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', element: <Work /> },
      { path: 'work/:slug', element: <CaseStudy /> },
      { path: 'experience', element: <Experience /> },
      { path: 'leadership', element: <Leadership /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      // Old URLs from the previous site.
      { path: 'projects', element: <Navigate to="/work" replace /> },
      { path: 'projects/:slug', element: <LegacyProject /> },
      { path: 'biography', element: <Navigate to="/experience" replace /> },
      { path: 'skills', element: <Navigate to="/experience?tab=stack" replace /> },
      { path: 'services', element: <Navigate to="/about#work-with-me" replace /> },
      { path: 'speaking', element: <Navigate to="/leadership#speaking" replace /> },
      { path: 'writing', element: <Navigate to="/leadership#speaking" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
