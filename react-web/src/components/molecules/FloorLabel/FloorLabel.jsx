import styles from './FloorLabel.module.css';

export const FloorLabel = ({ number, name, isActive, onClick }) => {
  return (
    <div
      className={`${styles.floorLabel} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      title={name}
    >
      <div className={styles.number}>{number}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.indicator} />
    </div>
  );
};
