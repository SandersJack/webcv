import { useEffect, useState } from 'react';
import styles from './SkillBadge.module.css';

export const SkillBadge = ({ name, level = 0, color = 'var(--accent-blue)' }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedLevel(level), 100);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className={styles.badge} style={{ boxShadow: `0 0 0 3px ${color}, 4px 4px 0 0 rgba(0,0,0,0.5)` }}>
      <div className={styles.header}>
        <div className={styles.icon} style={{ background: color }} />
        <span className={styles.name}>{name}</span>
      </div>
      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          style={{ width: `${animatedLevel}%`, background: color }}
        />
      </div>
      <div className={styles.levelText}>{level}%</div>
    </div>
  );
};
