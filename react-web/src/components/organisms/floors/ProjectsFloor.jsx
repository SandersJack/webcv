import { ProjectCard } from '../../molecules/ProjectCard';
import styles from './ProjectsFloor.module.css';

const PROJECTS = [
  {
    title: 'NA62 K+ Analysis',
    description: 'Ultra-rare kaon decay search at CERN NA62. C++/ROOT analysis framework processing 10B+ events to measure BR(K+→π+νν̄).',
    tags: ['C++', 'ROOT', 'CERN', 'Particle Physics'],
    link: 'https://na62.web.cern.ch',
  },
  {
    title: 'HEP ML Pipeline',
    description: 'Machine learning pipeline for particle identification using boosted decision trees and neural networks on NA62 data.',
    tags: ['Python', 'XGBoost', 'PyTorch', 'HEP'],
    link: null,
  },
  {
    title: 'webcv',
    description: 'This very site — a pixel-art Tiny Tower styled personal CV built with React, Vite, and Framer Motion.',
    tags: ['React', 'Vite', 'Framer Motion', 'CSS'],
    link: 'https://github.com/jacksanders',
  },
  {
    title: 'Data Dashboard',
    description: 'Real-time monitoring dashboard for NA62 detector conditions. Aggregates slow control data and alerts on anomalies.',
    tags: ['Python', 'React', 'Docker', 'Grafana'],
    link: null,
  },
];

export const ProjectsFloor = () => {
  return (
    <div className={styles.floor}>
      <div className={styles.floorTag}>// FLOOR 3 — PROJECTS</div>

      <h2 className={styles.heading}>
        MY <span className={styles.headingAccent}>WORK</span>
      </h2>

      <div className={styles.divider} />

      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
};
