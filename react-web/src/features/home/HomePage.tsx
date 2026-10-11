import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { homePage } from '../../content/pages'
import { pathIcons, toolsAndPlatforms } from '../../lib/icons'

export function HomePage() {
  return (
    <>
      <section className="page-hero page-hero--home">
        <div className="container split split--two split--hero">
          <div className="flow">
            <p className="page-hero__eyebrow">{homePage.eyebrow}</p>
            <h1>{homePage.heading}</h1>
            <p className="page-hero__lede">{homePage.lede}</p>
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
            <div className="home-proof">
              {homePage.proofPoints.map((point) => (
                <div key={point.label} className="home-proof__item">
                  <span className="home-proof__value">{point.value}</span>
                  <span className="home-proof__label">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
          <figure className="home-hero__image">
            <img
              src="/imgs/graduation.png"
              alt="Graduation at the University of Birmingham clock tower."
              width={500}
              height={700}
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-cards">
            {homePage.paths.map((path) => {
              const Icon = pathIcons[path.to]
              return (
                <Link key={path.to} to={path.to} className="card card--link flow">
                  {Icon && <Icon className="path-card__icon" aria-hidden />}
                  <h2>{path.label}</h2>
                  <p>{path.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">Tools and platforms</h2>
          <ul className="skills-grid">
            {toolsAndPlatforms.map(({ name, icon: Icon, gold }) => (
              <li key={name} className={`skills-grid__item${gold ? ' skills-grid__item--gold' : ''}`}>
                <Icon className="skills-grid__icon" aria-hidden />
                <span className="skills-grid__label">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
