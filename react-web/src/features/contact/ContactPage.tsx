import { ContactForm } from '../../components/ContactForm'
import { profile } from '../../content/profile'

export function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <h1>{profile.name}</h1>
          <p className="page-hero__lede">{profile.tagline}</p>
          <ul>
            <li>
              <a href={`mailto:${profile.email}`}>Email</a>
            </li>
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
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
