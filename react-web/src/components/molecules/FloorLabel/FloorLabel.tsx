import { FloorDetail } from '../../atoms/FloorDetail';
import styles from './FloorLabel.module.css';

interface FloorLabelProps {
  number: number;
  name: string;
  floorId: string;
  isActive: boolean;
  onClick: () => void;
}

export const FloorLabel = ({ number, name, floorId, isActive, onClick }: FloorLabelProps) => {
  return (
    <div
      className={`${styles.room} ${isActive ? styles.active : ''} ${styles[`floorBg${number}`]}`}
      onClick={onClick}
      title={name}
    >
      {/* Top label bar: name + stars */}
      <div className={styles.topBar}>
        <span className={styles.roomName}>{name}</span>
        <span className={styles.stars}>★★★</span>
      </div>

      {/* Pixel art detail fills the room */}
      <div className={styles.artArea}>
        <FloorDetail floorId={floorId} isActive={isActive} />
      </div>

      {/* Floor separator plate at bottom */}
      <div className={styles.floorPlate} />

      {/* Active highlight overlay */}
      {isActive && <div className={styles.activeOverlay} />}
    </div>
  );
};
