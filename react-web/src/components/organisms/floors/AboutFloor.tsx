import styles from './AboutFloor.module.css';

export const AboutFloor = () => (
  <div className={styles.floor}>
    <div className={styles.header}>
      <div className={styles.floorLabel}>FLOOR 1</div>
      <h2 className={styles.title}>ABOUT ME</h2>
    </div>

    <div className={styles.body}>
      <div className={styles.bioSection}>
        <p className={styles.bio}>
          PhD researcher at <span className={styles.hi}>CERN</span>, working on the{' '}
          <span className={styles.hi}>NA62 experiment</span> — searching for ultra-rare
          kaon decays to probe physics beyond the Standard Model.
        </p>
        <p className={styles.bio}>
          Full-stack developer &amp; data scientist based in{' '}
          <span className={styles.hi}>Geneva, Switzerland</span>.
          I build things that are both scientifically rigorous and pixel-perfect.
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statVal}>3+</span>
          <span className={styles.statKey}>YRS AT CERN</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>10B+</span>
          <span className={styles.statKey}>EVENTS ANALYSED</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>PhD</span>
          <span className={styles.statKey}>PHYSICS · GLASGOW</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>∞</span>
          <span className={styles.statKey}>COFFEE CONSUMED</span>
        </div>
      </div>

      <div className={styles.tags}>
        {['Particle Physics','CERN NA62','C++','Python','ROOT','React','Geneva'].map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);
