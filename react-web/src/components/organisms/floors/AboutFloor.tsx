import styles from './AboutFloor.module.css';

export const AboutFloor = () => {
  return (
    <div className={styles.floor}>
      <div className={styles.floorTag}>// FLOOR 1 — ABOUT</div>

      <h2 className={styles.heading}>
        WHO <span className={styles.headingAccent}>AM I?</span>
      </h2>

      <div className={styles.divider} />

      <p className={styles.bio}>
        I'm a PhD researcher at <span className={styles.highlight}>CERN</span>, working on the{' '}
        <span className={styles.highlight}>NA62 experiment</span> — searching for ultra-rare
        kaon decays to probe physics beyond the Standard Model.
        <br /><br />
        When I'm not analysing petabytes of particle collision data, I build
        full-stack web apps, automate things that should be automated, and
        obsess over clean code and pixel-perfect UIs.
        <br /><br />
        Currently based in <span className={styles.highlight}>Geneva, Switzerland</span>.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3+</span>
          <span className={styles.statLabel}>Years at CERN</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>10B+</span>
          <span className={styles.statLabel}>Events analysed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>~0</span>
          <span className={styles.statLabel}>Sleep hrs/night</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>∞</span>
          <span className={styles.statLabel}>Coffee consumed</span>
        </div>
      </div>

      <div className={styles.tagRow}>
        {['Particle Physics', 'Data Analysis', 'C++', 'Python', 'ROOT', 'Geneva'].map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
    </div>
  );
};
