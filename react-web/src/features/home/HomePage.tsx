import { Link } from 'react-router-dom'

import { ButtonLink } from '../../components/ButtonLink'
import { homePage } from '../../content/pages'

export function HomePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{homePage.eyebrow}</p>
          <h1>{homePage.heading}</h1>
          <p className="page-hero__lede">{homePage.lede}</p>
          <p className="text-muted">{homePage.instruction}</p>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-cards">
            {homePage.paths.map((path) => (
              <Link key={path.to} to={path.to} className="card card--link flow">
                <h2>{path.label}</h2>
                <p>{path.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
