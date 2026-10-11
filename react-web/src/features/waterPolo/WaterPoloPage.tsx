import { ButtonLink } from '../../components/ButtonLink'
import { waterPoloPage } from '../../content/pages'
import { skills } from '../../lib/icons'
import { LazyWorldCanvas } from '../../world/LazyWorldCanvas'

const waterPoloSkills = [
  'Teamwork',
  'Leadership',
  'Communication',
  'Coaching',
  'Fitness',
  'Strategy',
]

export function WaterPoloPage() {
  const { intro, history, demands, game } = waterPoloPage.sections

  return (
    <>
      <section className="page-hero page-hero--fullbleed">
        <LazyWorldCanvas sceneId="waterpolo_scene" />
        <div className="world-hero__overlay flow">
          <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
          <p className="page-hero__eyebrow">{waterPoloPage.eyebrow}</p>
          <h1>{waterPoloPage.heading}</h1>
          <p className="page-hero__lede">{waterPoloPage.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--water">{intro.title}</span>
          </p>
          <h2 className="section__title">{intro.title}</h2>
          {intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="stats-strip container" aria-label="Water polo at a glance">
        <div className="stats-strip__item">
          <span className="stats-strip__value">4</span>
          <span className="stats-strip__label">clubs and teams</span>
        </div>
        <div className="stats-strip__item">
          <span className="stats-strip__value">Wales</span>
          <span className="stats-strip__label">national representation</span>
        </div>
        <div className="stats-strip__item">
          <span className="stats-strip__value">3D</span>
          <span className="stats-strip__label">thinking above and below water</span>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--water">{history.title}</span>
          </p>
          <h2 className="section__title">{history.title}</h2>
          {history.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {'clubs' in history && Array.isArray(history.clubs) && (
            <ul className="fact-list">
              {history.clubs.map((club) => (
                <li key={club.team} className="fact-list__item">
                  <p>
                    <strong>{club.team}</strong>
                  </p>
                  <p className="fact-list__meta">{club.period}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--water">{demands.title}</span>
          </p>
          <h2 className="section__title">{demands.title}</h2>
          <ul className="list-styled">
            {demands.body.map((demand) => (
              <li key={demand}>{demand}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container">
        <blockquote className="pull-quote">
          <p>
            Six other players need to know your intention before you act. Trust
            is the whole game.
          </p>
        </blockquote>
      </section>

      <section className="section">
        <div className="container flow">
          <p className="section__eyebrow">
            <span className="tag tag--water">Transferable skills</span>
          </p>
          <h2 className="section__title">Transferable skills</h2>
          <ul className="tag-list">
            {waterPoloSkills.map((skill) => {
              const match = skills.find((s) => s.name === skill)
              return (
                <li key={skill} className="tag tag--water">
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
            <span className="tag tag--water">{game.title}</span>
          </p>
          <h2 className="section__title">{game.title}</h2>
          {game.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="button-row">
            <ButtonLink to="/" variant="secondary">Back to portfolio</ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
