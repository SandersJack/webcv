import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { physicsPage } from '../../content/pages'
import { publications } from '../../content/profile'
import { getProject, type Project } from '../../content/projects'
import { skills } from '../../lib/icons'
import { LazyWorldCanvas } from '../../world/LazyWorldCanvas'

const builtProjectIds = ['flexible-na62-framework', 'slim-mc']

const builtProjects = builtProjectIds
  .map((id) => getProject(id))
  .filter((project): project is Project => project !== undefined)

const physicsSkills = [
  'C++',
  'Python',
  'Geant4',
  'Monte Carlo',
  'Data analysis',
  'Scientific writing',
  'Presenting',
  'CERN',
  'Particle physics',
]

export function PhysicsPage() {
  const { research, contribution, methods, accuracyNote } = physicsPage.sections

  return (
    <>
      <section className="page-hero page-hero--fullbleed">
        <LazyWorldCanvas sceneId="detector_scene" />
        <div className="world-hero__overlay flow">
          <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
          <p className="page-hero__eyebrow">{physicsPage.eyebrow}</p>
          <h1>{physicsPage.heading}</h1>
          <p className="page-hero__lede">{physicsPage.lede}</p>
        </div>
      </section>

      <section className="stats-strip container" aria-label="Key numbers">
        <div className="stats-strip__item">
          <span className="stats-strip__value">3×</span>
          <span className="stats-strip__label">MC compression ratio</span>
        </div>
        <div className="stats-strip__item">
          <span className="stats-strip__value">6 months</span>
          <span className="stats-strip__label">at CERN on attachment</span>
        </div>
        <div className="stats-strip__item">
          <span className="stats-strip__value">CEDAR-H</span>
          <span className="stats-strip__label">kaon tagger installed</span>
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
          <h2 className="section__title">Doctoral thesis</h2>
          <p>
            <a
              href="https://repository.cern/records/5tz1q-dkr44"
              target="_blank"
              rel="noreferrer"
            >
              Kaon Identification Upgrade and Search for the Dark Photon Production in the π⁰ → γA&apos; Decay, at NA62
            </a>
          </p>
          <p className="text-muted">
            University of Birmingham, 2025. Supervisors: Evgueni Goudzovski, Cristina Lazzeroni, Angela Romano.
          </p>
          <div className="thesis-preview">
            <iframe
              src="/pdfs/thesis.pdf#toolbar=0&navpanes=0&scrollbar=0"
              title="Doctoral thesis PDF preview"
              aria-label="Preview of doctoral thesis: Kaon Identification Upgrade and Search for the Dark Photon Production in the π⁰ → γA&apos; Decay, at NA62"
              loading="lazy"
            />
            <p className="text-muted">
              <a
                href="/pdfs/thesis.pdf"
                download
              >
                Download the PDF
              </a>
              {' '}· Official source:{' '}
              <a
                href="https://repository.cern/records/5tz1q-dkr44"
                target="_blank"
                rel="noreferrer"
              >
                CERN Repository
              </a>
            </p>
          </div>
        </div>
      </section>

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
          <h2 className="section__title">Tools and methods</h2>
          <ul className="tag-list">
            {physicsSkills.map((skill) => {
              const match = skills.find((s) => s.name === skill)
              return (
                <li key={skill} className="tag">
                  {match ? <match.icon className="tag__icon" /> : null}
                  {skill}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="container">
        <blockquote className="pull-quote">
          <p>Measuring the rarest decays in physics, one in ten billion, to test the limits of the Standard Model.</p>
        </blockquote>
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
            <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
