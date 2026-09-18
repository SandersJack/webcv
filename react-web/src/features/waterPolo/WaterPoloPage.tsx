import { waterPoloPage } from '../../content/pages'

export function WaterPoloPage() {
  const { intro, history, demands, tactical } = waterPoloPage.sections

  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{waterPoloPage.eyebrow}</p>
          <h1>{waterPoloPage.heading}</h1>
          <p className="page-hero__lede">{waterPoloPage.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">
            <span className="tag tag--water">{intro.title}</span>
          </h2>
          {intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">
            <span className="tag tag--water">{history.title}</span>
          </h2>
          {history.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">
            <span className="tag tag--water">{demands.title}</span>
          </h2>
          <ul className="list-styled">
            {demands.body.map((demand) => (
              <li key={demand}>{demand}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container flow">
          <h2 className="section__title">
            <span className="tag tag--water">{tactical.title}</span>
          </h2>
          {tactical.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </>
  )
}
