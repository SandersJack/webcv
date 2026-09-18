import { ButtonLink } from '../../components/ButtonLink'
import { aboutPage } from '../../content/pages'
import { education, profile, workExperience } from '../../content/profile'

const timeline = [...education, ...workExperience]

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
          <ul className="fact-list">
            {timeline.map((entry) => (
              <li
                key={`${entry.organisation}-${entry.role}-${entry.period}`}
                className="fact-list__item"
              >
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
          <h2 className="section__title">{focus.title}</h2>
          {focus.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Affiliations</h2>
          <ul className="tag-list">
            {profile.affiliations.map((affiliation) => (
              <li key={affiliation} className="tag">
                {affiliation}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Skills</h2>
          <ul className="tag-list">
            {profile.skills.map((skill) => (
              <li key={skill} className="tag">
                {skill}
              </li>
            ))}
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
