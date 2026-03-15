import { PixelButton } from '../../atoms/PixelButton';
import styles from './LobbyFloor.module.css';

export const LobbyFloor = ({ onNavigate }) => {
  return (
    <div className={styles.floor}>
      <div className={styles.pixelDeco + ' ' + styles.pixelDecoTL}>[]</div>
      <div className={styles.pixelDeco + ' ' + styles.pixelDecoBR}>[]</div>

      <div className={styles.badge}>// FLOOR 0 — LOBBY</div>

      <h1 className={styles.title}>
        JACK
        <span className={styles.titleAccent}> SANDERS</span>
        <span className={styles.cursor} />
      </h1>

      <p className={styles.subtitle}>
        PhD Researcher @ CERN<br />
        NA62 Experiment · Particle Physics<br />
        Full-Stack Dev · Data Scientist
      </p>

      <div className={styles.actions}>
        <PixelButton onClick={() => onNavigate && onNavigate(1)} variant="primary" size="md">
          &gt; ENTER
        </PixelButton>
        <PixelButton onClick={() => onNavigate && onNavigate(4)} variant="secondary" size="md">
          CONTACT
        </PixelButton>
      </div>

      <div className={styles.scrollHint}>▲ USE ELEVATOR TO EXPLORE ▲</div>
    </div>
  );
};
