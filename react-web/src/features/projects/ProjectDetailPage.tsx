import { Link, useParams } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { getProject, type Project } from '../../content/projects'

type RelatedPath = Exclude<Project['relatedPath'], null>

const relatedRoutes: Record<RelatedPath, { to: string; label: string }> = {
  physics: { to: '/physics', label: 'Explore physics' },
  mobile: { to: '/mobile-development', label: 'Explore mobile development' },
  water: { to: '/water-polo', label: 'Explore water polo' },
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

  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p>
            <Link to="/projects">Back to projects</Link>
          </p>
          <h1>{project.title}</h1>
          <p>
            <span className="tag">{project.status}</span>{' '}
            <small className="text-muted">{project.year}</small>
          </p>
          <p className="page-hero__lede">{project.summary}</p>
        </div>
      </section>

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
            {project.technologies.map((technology) => (
              <li key={technology} className="tag">
                {technology}
              </li>
            ))}
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
