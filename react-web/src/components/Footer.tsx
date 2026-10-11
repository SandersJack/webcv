import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi'

import { profile } from '../content/profile'

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
              <a href={`mailto:${profile.email}`} className="footer-link">
                <FiMail className="footer-link__icon" aria-hidden />
                <span>{profile.email}</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                <FiGithub className="footer-link__icon" aria-hidden />
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                <FiLinkedin className="footer-link__icon" aria-hidden />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </nav>
        <p className="site-footer__small">
          © {new Date().getFullYear()} {profile.name}. Built with React, Three.js, and
          stubborn attention to detail.
        </p>
      </div>
    </footer>
  )
}
