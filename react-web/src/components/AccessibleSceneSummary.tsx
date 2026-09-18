import { Link } from 'react-router-dom'

type AccessibleSceneSummaryProps = {
  summary: string
  linkTo?: string
  linkLabel?: string
}

export function AccessibleSceneSummary({
  summary,
  linkTo,
  linkLabel,
}: AccessibleSceneSummaryProps) {
  return (
    <aside>
      <h2 className="visually-hidden">Scene description</h2>
      <p>{summary}</p>
      {linkTo !== undefined && linkLabel !== undefined && (
        <p>
          <Link to={linkTo}>{linkLabel}</Link>
        </p>
      )}
    </aside>
  )
}
