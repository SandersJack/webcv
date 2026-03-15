import { SkillBadge } from '../../molecules/SkillBadge';
import styles from './SkillsFloor.module.css';

const SKILLS = {
  'Research & Physics': [
    { name: 'Data Analysis', level: 95, color: 'var(--accent-blue)' },
    { name: 'ROOT / CERN', level: 90, color: 'var(--accent-blue)' },
    { name: 'Statistics', level: 85, color: 'var(--accent-blue)' },
    { name: 'Particle Physics', level: 88, color: 'var(--accent-blue)' },
  ],
  'Programming': [
    { name: 'Python', level: 92, color: 'var(--accent-yellow)' },
    { name: 'C++', level: 80, color: 'var(--accent-yellow)' },
    { name: 'JavaScript', level: 75, color: 'var(--accent-yellow)' },
    { name: 'Bash / Shell', level: 78, color: 'var(--accent-yellow)' },
  ],
  'Web & Tools': [
    { name: 'React', level: 72, color: 'var(--accent-green)' },
    { name: 'Docker', level: 70, color: 'var(--accent-green)' },
    { name: 'Git', level: 85, color: 'var(--accent-green)' },
    { name: 'Linux', level: 82, color: 'var(--accent-green)' },
  ],
};

export const SkillsFloor = () => {
  return (
    <div className={styles.floor}>
      <div className={styles.floorTag}>// FLOOR 2 — SKILLS</div>

      <h2 className={styles.heading}>
        TECH <span className={styles.headingAccent}>STACK</span>
      </h2>

      <div className={styles.divider} />

      {Object.entries(SKILLS).map(([category, skills]) => (
        <div key={category} className={styles.category}>
          <div className={styles.categoryLabel}>— {category}</div>
          <div className={styles.skillsGrid}>
            {skills.map((skill) => (
              <SkillBadge key={skill.name} {...skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
