import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi'

import { ContactForm } from '../../components/ContactForm'
import { profile } from '../../content/profile'

export function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <h1>{profile.name}</h1>
          <p className="page-hero__lede">{profile.tagline}</p>
          <ul className="contact-links">
            <li>
              <a href={`mailto:${profile.email}`} className="contact-link">
                <FiMail className="contact-link__icon" aria-hidden />
                <span>{profile.email}</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <FiGithub className="contact-link__icon" aria-hidden />
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <FiLinkedin className="contact-link__icon" aria-hidden />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
