import styles from './SkillsFloor.module.css';

const SKILLS = [
  { cat: 'PHYSICS',     items: [['Data Analysis','95'],['ROOT / CERN','90'],['Statistics','85'],['NA62 Framework','88']] },
  { cat: 'CODE',        items: [['Python','92'],['C++','80'],['TypeScript','76'],['Bash','78']] },
  { cat: 'WEB & TOOLS', items: [['React','74'],['Docker','70'],['Git','85'],['Linux','82']] },
];

export const SkillsFloor = () => (
  <div className={styles.floor}>
    <div className={styles.header}>
      <div className={styles.floorLabel}>FLOOR 2</div>
      <h2 className={styles.title}>TECH STACK</h2>
    </div>
    <div className={styles.body}>
      {SKILLS.map(({ cat, items }) => (
        <div key={cat} className={styles.category}>
          <div className={styles.catLabel}>— {cat}</div>
          <div className={styles.grid}>
            {items.map(([name, level]) => (
              <div key={name} className={styles.skill}>
                <div className={styles.skillName}>{name}</div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${level}%` }} />
                </div>
                <div className={styles.skillPct}>{level}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
