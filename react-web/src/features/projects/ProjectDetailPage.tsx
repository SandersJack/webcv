import { useParams } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { ScreenshotGallery } from '../../components/PlantPulseDemo'
import { getProject, type Project } from '../../content/projects'
import { skills } from '../../lib/icons'

type RelatedPath = Exclude<Project['relatedPath'], null>

const relatedRoutes: Record<RelatedPath, { to: string; label: string }> = {
  physics: { to: '/physics', label: 'Explore physics' },
  software: { to: '/software-development', label: 'Explore software development' },
  water: { to: '/water-polo', label: 'Explore water polo' },
}

const projectScreenshots: Record<string, { src: string; alt: string; label?: string }[]> = {
  plantpulse: [
    { src: '/screenshots/plantpulse/signup-create-account.png', alt: 'PlantPulse sign-up screen', label: 'Sign up' },
    { src: '/screenshots/plantpulse/email-verification.png', alt: 'PlantPulse email verification', label: 'Verification' },
    { src: '/screenshots/plantpulse/plants-home.png', alt: 'PlantPulse home screen with plant overview cards', label: 'Home' },
    { src: '/screenshots/plantpulse/rooms-list.png', alt: 'PlantPulse rooms list', label: 'Rooms' },
    { src: '/screenshots/plantpulse/room-editor-2d-sunlight.png', alt: 'PlantPulse 2D room editor with sunlight simulation', label: 'Room editor' },
    { src: '/screenshots/plantpulse/room-3d-sunlight-view.png', alt: 'PlantPulse 3D sunlight view', label: '3D view' },
    { src: '/screenshots/plantpulse/schedule.png', alt: 'PlantPulse watering schedule calendar', label: 'Schedule' },
    { src: '/screenshots/plantpulse/new-plant-modal.png', alt: 'PlantPulse add new plant flow', label: 'Add plant' },
    { src: '/screenshots/plantpulse/plant-detail-with-sensor.png', alt: 'PlantPulse plant detail with live sensor readings', label: 'Plant detail' },
    { src: '/screenshots/plantpulse/sensors-dashboard.png', alt: 'PlantPulse live sensors dashboard', label: 'Sensors' },
    { src: '/screenshots/plantpulse/settings.png', alt: 'PlantPulse settings screen', label: 'Settings' },
  ],
  polostat: [
    { src: '/screenshots/polostat/league.png', alt: 'PoloStat British water polo league view' },
    { src: '/screenshots/polostat/standings.png', alt: 'PoloStat league standings' },
    { src: '/screenshots/polostat/match.png', alt: 'PoloStat match detail screen' },
    { src: '/screenshots/polostat/player.png', alt: 'PoloStat player statistics' },
    { src: '/screenshots/polostat/stats.png', alt: 'PoloStat team statistics overview' },
  ],
  'polostat-web': [
    { src: '/screenshots/polostat/analytics.png', alt: 'PoloStat admin analytics dashboard' },
    { src: '/screenshots/polostat/playbyplay.png', alt: 'PoloStat admin play by play dashboard' },
    { src: '/screenshots/polostat/gamepanel.png', alt: 'PoloStat admin game dashboard' },
  ],
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projectId === undefined ? undefined : getProject(projectId)

  if (project === undefined) {
    return (
      <section className="page-hero">
        <div className="container flow">
          <h1>Project not found</h1>
          <p className="page-hero__lede">
            The project you are looking for does not exist or is not public.
          </p>
          <div className="button-row">
            <ButtonLink to="/projects">Back to projects</ButtonLink>
          </div>
        </div>
      </section>
    )
  }

  const related =
    project.relatedPath === null ? null : relatedRoutes[project.relatedPath]
  const screenshots = projectScreenshots[project.id]
  const webScreenshots = project.id === 'polostat' ? projectScreenshots['polostat-web'] : undefined

  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <ButtonLink to="/projects" variant="secondary">Back to projects</ButtonLink>
          <h1>{project.title}</h1>
          <p>
            <span className="tag">{project.status}</span>{' '}
            <small className="text-muted">{project.year}</small>
          </p>
          <p className="page-hero__lede">{project.summary}</p>
        </div>
      </section>

      {screenshots && screenshots.length > 0 && (
        <section className="section">
          <div className="container">
            <ScreenshotGallery slides={screenshots} orientation="portrait" />
          </div>
        </section>
      )}

      {webScreenshots && webScreenshots.length > 0 && (
        <section className="section">
          <div className="container">
            <ScreenshotGallery slides={webScreenshots} orientation="landscape" />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">The problem</h2>
          <p>{project.problem}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Role &amp; team</h2>
          <p>{project.role}</p>
          <p className="text-muted">{project.team}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Approach</h2>
          <ul className="list-styled">
            {project.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Result</h2>
          <p>{project.result}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Limitations</h2>
          <p>{project.limitations}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Technologies</h2>
          <ul className="tag-list">
            {project.technologies.map((technology) => {
              const skill = skills.find((s) => s.name.toLowerCase() === technology.toLowerCase())
              return (
                <li key={technology} className="tag">
                  {skill ? <skill.icon className="tag__icon" /> : null}
                  {technology}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {project.links.length > 0 && (
        <section className="section">
          <div className="container flow">
            <h2 className="section__title">Links</h2>
            <ul className="list-styled">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related !== null && (
        <section className="section">
          <div className="container flow">
            <h2 className="section__title">Related path</h2>
            <div className="button-row">
              <ButtonLink to={related.to} variant="secondary">
                {related.label}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
