import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { mobilePage } from '../../content/pages'
import { profile } from '../../content/profile'

export function MobileDevelopmentPage() {
  const { intro, experience, projects, demo } = mobilePage.sections
  const sections = [intro, experience, projects, demo]

  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{mobilePage.eyebrow}</p>
          <h1>{mobilePage.heading}</h1>
          <p className="page-hero__lede">{mobilePage.lede}</p>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="section">
          <div className="container flow">
            <h2 className="section__title">
              <span className="tag tag--mobile">{section.title}</span>
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section === projects && (
              <p>
                <Link to="/projects">View projects</Link>
              </p>
            )}
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="button-row">
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
