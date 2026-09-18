import { ProjectList } from '../../components/ProjectList'
import { projectsPage } from '../../content/pages'
import { projects } from '../../content/projects'

const publicProjects = projects.filter(
  (project) => project.publicityLevel === 'public',
)

export function ProjectsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container flow">
          <p className="page-hero__eyebrow">{projectsPage.eyebrow}</p>
          <h1>{projectsPage.heading}</h1>
          <p className="page-hero__lede">{projectsPage.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProjectList projects={publicProjects} />
        </div>
      </section>
    </>
  )
}
