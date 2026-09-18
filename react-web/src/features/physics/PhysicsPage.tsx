import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { homePage, physicsPage } from '../../content/pages'
import { publications } from '../../content/profile'
import { getProject, type Project } from '../../content/projects'

const builtProjectIds = ['flexible-na62-framework', 'slim-mc']

const builtProjects = builtProjectIds
  .map((id) => getProject(id))
  .filter((project): project is Project => project !== undefined)

export function PhysicsPage() {
  const { research, contribution, methods, accuracyNote } = physicsPage.sections

  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{physicsPage.eyebrow}</p>
          <h1>{physicsPage.heading}</h1>
          <p className="page-hero__lede">{physicsPage.lede}</p>
        </div>
      </section>

      {[research, contribution, methods].map((section) => (
        <section key={section.title} className="section">
          <div className="container flow">
            <h2 className="section__title">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">What I built</h2>
          <div className="grid-cards">
            {builtProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="card card--link flow"
              >
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Publications</h2>
          <div className="grid-cards">
            {publications.map((publication) => (
              <article key={publication.link} className="card flow">
                <h3>{publication.title}</h3>
                <p>
                  <small className="text-muted">
                    {publication.venue} · {publication.year} · {publication.role}
                  </small>
                </p>
                <p>{publication.summary}</p>
                <p>
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publication.linkLabel}
                  </a>
                </p>
              </article>
            ))}
          </div>
          <p>
            <small className="text-muted">{accuracyNote}</small>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="button-row">
            {homePage.primaryActions.map((action, index) => (
              <ButtonLink
                key={action.to}
                to={action.to}
                variant={index === 0 ? 'primary' : 'secondary'}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
