import { ButtonLink } from '../../components/ButtonLink'
import { aboutPage } from '../../content/pages'
import { education, profile, workExperience } from '../../content/profile'
import { skills } from '../../lib/icons'

const organisationLogos: Record<string, string[]> = {
  'University of Birmingham': ['/logos/uob.png'],
  'EE & BT': ['/logos/EE-Logo-2012.png', '/logos/bt.svg'],
  'ARUP': ['/logos/arup.png'],
  'NEWS-G': ['/logos/cern.svg'],
}

export function AboutPage() {
  const { bio, timeline: timelineSection, focus } = aboutPage.sections
  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{aboutPage.eyebrow}</p>
          <h1>{aboutPage.heading}</h1>
          <p className="page-hero__lede">{aboutPage.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">{bio.title}</h2>
          {bio.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">{timelineSection.title}</h2>
          <h3>Education</h3>
          <ul className="fact-list">
            {education.map((entry) => {
              const logos = organisationLogos[entry.organisation]
              return (
                <li
                  key={`${entry.organisation}-${entry.role}-${entry.period}`}
                  className="fact-list__item"
                >
                  {logos && (
                    <div className="fact-list__logos">
                      {logos.map((logo) => (
                        <img key={logo} src={logo} alt={`${entry.organisation} logo`} className="fact-list__logo" />
                      ))}
                    </div>
                  )}
                  <div className="fact-list__content">
                    <p>
                      <strong>{entry.role}</strong>, {entry.organisation}
                    </p>
                    <p className="fact-list__meta">{entry.period}</p>
                    <p>{entry.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <h3>Work Experience</h3>
          <ul className="fact-list">
            {workExperience.map((entry) => {
              const logos = organisationLogos[entry.organisation]
              return (
                <li
                  key={`${entry.organisation}-${entry.role}-${entry.period}`}
                  className="fact-list__item"
                >
                  {logos && (
                    <div className="fact-list__logos">
                      {logos.map((logo) => (
                        <img key={logo} src={logo} alt={`${entry.organisation} logo`} className="fact-list__logo" />
                      ))}
                    </div>
                  )}
                  <div className="fact-list__content">
                    <p>
                      <strong>{entry.role}</strong>, {entry.organisation}
                    </p>
                    <p className="fact-list__meta">{entry.period}</p>
                    <p>{entry.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">{focus.title}</h2>
          {focus.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Affiliations</h2>
          <ul className="skills-grid">
            {profile.affiliations.map((affiliation) => {
              const match = skills.find((s) => s.name === affiliation)
              const Icon = match?.icon
              return (
                <li key={affiliation} className="skills-grid__item">
                  {Icon && <Icon className="skills-grid__icon" aria-hidden />}
                  <span className="skills-grid__label">{affiliation}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="button-row">
            <ButtonLink to="/contact">Get in touch</ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
