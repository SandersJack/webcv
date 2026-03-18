import styles from './ProjectsFloor.module.css';

const PROJECTS = [
  {
    title: 'NA62 K⁺ Analysis',
    desc: 'Ultra-rare kaon decay search at CERN. C++/ROOT pipeline processing 10B+ events to measure BR(K⁺→π⁺νν̄).',
    tags: ['C++', 'ROOT', 'CERN'],
    color: '#e85a20',
  },
  {
    title: 'HEP ML Pipeline',
    desc: 'Particle ID using boosted decision trees & neural networks on NA62 detector data.',
    tags: ['Python', 'XGBoost', 'PyTorch'],
    color: '#c04010',
  },
  {
    title: 'webcv',
    desc: 'This site — pixel-art Tiny Tower CV built with React, Vite & Framer Motion.',
    tags: ['React', 'Vite', 'TS'],
    color: '#e85a20',
  },
  {
    title: 'Data Dashboard',
    desc: 'Real-time NA62 detector monitoring. Aggregates slow control data, alerts on anomalies.',
    tags: ['Python', 'React', 'Grafana'],
    color: '#c04010',
  },
];

export const ProjectsFloor = () => (
  <div className={styles.floor}>
    <div className={styles.header}>
      <div className={styles.floorLabel}>FLOOR 3</div>
      <h2 className={styles.title}>MY WORK</h2>
    </div>
    <div className={styles.grid}>
      {PROJECTS.map(p => (
        <div key={p.title} className={styles.card} style={{ borderColor: p.color }}>
          <div className={styles.cardTitle} style={{ color: p.color }}>{p.title}</div>
          <p className={styles.cardDesc}>{p.desc}</p>
          <div className={styles.cardTags}>
            {p.tags.map(t => <span key={t} className={styles.tag} style={{ borderColor: p.color }}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);
