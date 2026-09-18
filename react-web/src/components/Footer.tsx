import { profile } from '../content/profile'

/** Intentionally quiet ending (plan §4 — contact page). */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__name">{profile.name}</p>
          <p className="site-footer__tagline">{profile.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="site-footer__links">
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
        </nav>
        <p className="site-footer__small">
          © {new Date().getFullYear()} {profile.name}. Built with React, Three.js, and
          stubborn attention to accessibility.
        </p>
      </div>
    </footer>
  )
}
