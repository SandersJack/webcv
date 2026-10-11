import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AboutPage } from '../features/about/AboutPage'
import { ContactPage } from '../features/contact/ContactPage'
import { HomePage } from '../features/home/HomePage'
import { SoftwareDevelopmentPage } from '../features/softwareDevelopment/SoftwareDevelopmentPage'
import { NotFoundPage } from '../features/notFound/NotFoundPage'
import { PhysicsPage } from '../features/physics/PhysicsPage'
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage'
import { ProjectsPage } from '../features/projects/ProjectsPage'
import { WaterPoloPage } from '../features/waterPolo/WaterPoloPage'

// Dev-only asset preview: lazy so three.js stays out of the main bundle.
const WorldPreviewPage = lazy(() =>
  import('../world/WorldPreviewPage').then((m) => ({ default: m.WorldPreviewPage })),
)

/**
 * Primary routes (plan §3, information architecture).
 * Every route must render useful HTML without JavaScript-driven 3D.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/physics" element={<PhysicsPage />} />
      <Route path="/software-development" element={<SoftwareDevelopmentPage />} />
      <Route path="/water-polo" element={<WaterPoloPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/world-preview"
        element={
          <Suspense fallback={null}>
            <WorldPreviewPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
