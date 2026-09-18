import { ButtonLink } from '../../components/ButtonLink'
import { notFoundPage } from '../../content/pages'

export function NotFoundPage() {
  return (
    <section className="page-hero">
      <div className="container flow">
        <h1>{notFoundPage.heading}</h1>
        <p className="page-hero__lede">{notFoundPage.body}</p>
        <div className="button-row">
          <ButtonLink to="/">Back to home</ButtonLink>
        </div>
      </div>
    </section>
  )
}
