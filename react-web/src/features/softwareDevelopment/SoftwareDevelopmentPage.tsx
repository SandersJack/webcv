import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { softwarePage } from '../../content/pages'
import { profile, workExperience } from '../../content/profile'
import { getProject, type Project } from '../../content/projects'
import { skills } from '../../lib/icons'
import { LazyWorldCanvas } from '../../world/LazyWorldCanvas'

const softwareWorkExperience = workExperience.filter((entry) =>
  ['BT', 'EE', 'University of Birmingham'].some((organisation) =>
    entry.organisation.includes(organisation),
  ),
)

const devSkills = [
  'Flutter',
  'React Native',
  'Python',
  'JavaScript',
  'TypeScript',
  'Docker',
  'REST APIs',
  'iOS',
  'Android',
]

const featuredProjectIds = ['polostat', 'plantpulse', 'pico-environment-monitor']

const featuredProjects = featuredProjectIds
  .map((id) => getProject(id))
  .filter((project): project is Project => project !== undefined)

export function SoftwareDevelopmentPage() {
  const { approach } = softwarePage.sections

  return (
    <>
      <section className="page-hero page-hero--fullbleed">
        <LazyWorldCanvas sceneId="software_scene" />
        <div className="world-hero__overlay flow">
          <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
          <p className="page-hero__eyebrow">{softwarePage.eyebrow}</p>
          <h1>{softwarePage.heading}</h1>
          <p className="page-hero__lede">{softwarePage.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--mobile">{approach.title}</span>
          </p>
          <h2 className="section__title">{approach.title}</h2>
          {approach.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--mobile">Professional experience</span>
          </p>
          <h2 className="section__title">Professional experience</h2>
          <ul className="fact-list">
            {softwareWorkExperience.map((entry) => (
              <li key={`${entry.organisation}-${entry.role}`} className="fact-list__item">
                <p>
                  <strong>{entry.role}</strong>, {entry.organisation}
                </p>
                <p className="fact-list__meta">{entry.period}</p>
                <p>{entry.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--mobile">Skills</span>
          </p>
          <h2 className="section__title">Skills</h2>
          <ul className="tag-list">
            {devSkills.map((skill) => {
              const match = skills.find((s) => s.name === skill)
              return (
                <li key={skill} className="tag tag--mobile">
                  {match ? <match.icon className="tag__icon" /> : null}
                  {skill}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--mobile">Selected projects</span>
          </p>
          <h2 className="section__title">Selected projects</h2>
          <div className="grid-cards">
            {featuredProjects.map((project) => (
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
        <div className="container">
          <div className="button-row">
            <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
            <a
              className="button button--primary"
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub profile
            </a>
            <ButtonLink to="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
