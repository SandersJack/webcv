import { Route, Routes } from 'react-router-dom'

import { AboutPage } from '../features/about/AboutPage'
import { ContactPage } from '../features/contact/ContactPage'
import { HomePage } from '../features/home/HomePage'
import { MobileDevelopmentPage } from '../features/mobileDevelopment/MobileDevelopmentPage'
import { NotFoundPage } from '../features/notFound/NotFoundPage'
import { PhysicsPage } from '../features/physics/PhysicsPage'
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage'
import { ProjectsPage } from '../features/projects/ProjectsPage'
import { WaterPoloPage } from '../features/waterPolo/WaterPoloPage'
import { WorldPreviewPage } from '../world/WorldPreviewPage'

/**
 * Primary routes (plan §3 — information architecture).
 * Every route must render useful HTML without JavaScript-driven 3D.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/physics" element={<PhysicsPage />} />
      <Route path="/mobile-development" element={<MobileDevelopmentPage />} />
      <Route path="/water-polo" element={<WaterPoloPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/world-preview" element={<WorldPreviewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
