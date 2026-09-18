import { Link } from 'react-router-dom'

import type { Project } from '../content/projects'

type ProjectListProps = {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p>No public projects to show yet — please check back soon.</p>
  }

  return (
    <div className="grid-cards">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="card card--link flow"
        >
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <p>
            <span className="tag">{project.status}</span>{' '}
            <small className="text-muted">{project.year}</small>
          </p>
          <ul className="tag-list">
            {project.technologies.map((technology) => (
              <li key={technology} className="tag">
                {technology}
              </li>
            ))}
          </ul>
        </Link>
      ))}
    </div>
  )
}
