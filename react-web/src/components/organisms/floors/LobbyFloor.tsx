import styles from './LobbyFloor.module.css';

interface LobbyFloorProps {
  onNavigate?: (floor: number) => void;
}

const BlueWorker = () => (
  <svg viewBox="0 0 14 30" width="36" height="77"
    overflow="visible"
    style={{ imageRendering: 'pixelated', display: 'block' }}>
    <g>
      <animateTransform attributeName="transform" type="translate"
        values="0 0;0 3;0 0" keyTimes="0;0.5;1"
        calcMode="discrete" dur="0.5s" repeatCount="indefinite" />
      <rect x="2"  y="22" width="5" height="5" fill="#2a3a6a"/>
      <rect x="1"  y="27" width="7" height="3" fill="#1a1010"/>
    </g>
    <g>
      <animateTransform attributeName="transform" type="translate"
        values="0 3;0 0;0 3" keyTimes="0;0.5;1"
        calcMode="discrete" dur="0.5s" repeatCount="indefinite" />
      <rect x="7"  y="22" width="5" height="5" fill="#2a3a6a"/>
      <rect x="6"  y="27" width="7" height="3" fill="#1a1010"/>
    </g>
    <rect x="2" y="0" width="10" height="1" fill="#2a1008"/>
    <rect x="1" y="1" width="12" height="2" fill="#3a1c08"/>
    <rect x="1" y="1" width="2" height="7" fill="#3a1c08"/>
    <rect x="11" y="1" width="2" height="7" fill="#3a1c08"/>
    <rect x="2" y="2" width="10" height="8" fill="#f0c080"/>
    <rect x="3" y="3" width="3" height="1" fill="#3a1c08"/>
    <rect x="8" y="3" width="3" height="1" fill="#3a1c08"/>
    <rect x="3" y="4" width="3" height="3" fill="#e8e8e8"/>
    <rect x="8" y="4" width="3" height="3" fill="#e8e8e8"/>
    <rect x="4" y="5" width="1" height="2" fill="#4a6ab0"/>
    <rect x="9" y="5" width="1" height="2" fill="#4a6ab0"/>
    <rect x="4" y="4" width="1" height="1" fill="#ffffff"/>
    <rect x="9" y="4" width="1" height="1" fill="#ffffff"/>
    <rect x="6" y="7" width="2" height="2" fill="#c88050"/>
    <rect x="4" y="9" width="6" height="1" fill="#a05030"/>
    <rect x="5" y="10" width="4" height="2" fill="#f0c080"/>
    <rect x="6" y="11" width="2" height="8" fill="#e94560"/>
    <rect x="2" y="13" width="10" height="8" fill="#4a90e2"/>
    <rect x="2" y="13" width="2" height="8" fill="#3a78c0"/>
    <rect x="10" y="13" width="2" height="8" fill="#3a78c0"/>
    <rect x="0" y="13" width="3" height="7" fill="#4a90e2"/>
    <rect x="0" y="20" width="3" height="2" fill="#f0c080"/>
    <rect x="11" y="13" width="3" height="7" fill="#4a90e2"/>
    <rect x="11" y="20" width="3" height="2" fill="#f0c080"/>
    <rect x="11" y="19" width="4" height="5" fill="#8b5e1c"/>
    <rect x="12" y="17" width="1" height="7" fill="#c8a030"/>
    <rect x="2" y="21" width="10" height="1" fill="#2a1808"/>
    <rect x="2" y="22" width="10" height="4" fill="#2a3a6a"/>
    <rect x="6" y="22" width="2" height="4" fill="#1a2a5a"/>
  </svg>
);

const PurpleWoman = () => (
  <svg viewBox="0 0 14 30" width="36" height="77"
    overflow="visible"
    style={{ imageRendering: 'pixelated', display: 'block' }}>
    <g>
      <animateTransform attributeName="transform" type="translate"
        values="0 3;0 0;0 3" keyTimes="0;0.5;1"
        calcMode="discrete" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      <rect x="3" y="24" width="4" height="4" fill="#2a1808"/>
      <rect x="2" y="28" width="6" height="2" fill="#e94560"/>
    </g>
    <g>
      <animateTransform attributeName="transform" type="translate"
        values="0 0;0 3;0 0" keyTimes="0;0.5;1"
        calcMode="discrete" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      <rect x="7" y="24" width="4" height="4" fill="#2a1808"/>
      <rect x="6" y="28" width="6" height="2" fill="#e94560"/>
    </g>
    <rect x="1" y="1" width="2" height="14" fill="#1a0c0c"/>
    <rect x="11" y="1" width="2" height="14" fill="#1a0c0c"/>
    <rect x="1" y="1" width="12" height="3" fill="#1a0c0c"/>
    <rect x="2" y="2" width="10" height="8" fill="#c87840"/>
    <rect x="3" y="3" width="3" height="1" fill="#120808"/>
    <rect x="8" y="3" width="3" height="1" fill="#120808"/>
    <rect x="3" y="4" width="3" height="3" fill="#e8e0e0"/>
    <rect x="8" y="4" width="3" height="3" fill="#e8e0e0"/>
    <rect x="3" y="4" width="3" height="1" fill="#120808"/>
    <rect x="8" y="4" width="3" height="1" fill="#120808"/>
    <rect x="4" y="5" width="1" height="2" fill="#6a3a1a"/>
    <rect x="9" y="5" width="1" height="2" fill="#6a3a1a"/>
    <rect x="4" y="5" width="1" height="1" fill="#ffffff"/>
    <rect x="9" y="5" width="1" height="1" fill="#ffffff"/>
    <rect x="4" y="9" width="6" height="1" fill="#e94560"/>
    <rect x="1" y="9" width="1" height="2" fill="#f5d020"/>
    <rect x="12" y="9" width="1" height="2" fill="#f5d020"/>
    <rect x="5" y="10" width="4" height="2" fill="#c87840"/>
    <rect x="2" y="12" width="10" height="9" fill="#9b59b6"/>
    <rect x="2" y="12" width="1" height="9" fill="#7a3090"/>
    <rect x="11" y="12" width="1" height="9" fill="#7a3090"/>
    <rect x="0" y="12" width="3" height="8" fill="#9b59b6"/>
    <rect x="0" y="20" width="3" height="2" fill="#c87840"/>
    <rect x="11" y="12" width="3" height="8" fill="#9b59b6"/>
    <rect x="11" y="20" width="3" height="2" fill="#c87840"/>
    <rect x="11" y="18" width="4" height="5" fill="#e94560"/>
    <rect x="12" y="16" width="1" height="5" fill="#ff6080"/>
    <rect x="1" y="21" width="12" height="7" fill="#7d3f9a"/>
    <rect x="1" y="27" width="12" height="1" fill="#9a50c0"/>
    <rect x="3" y="28" width="8" height="2" fill="#2a1808"/>
  </svg>
);

export const LobbyFloor = ({ onNavigate: _ }: LobbyFloorProps) => (
  <div className={styles.floor}>

    <div className={styles.header}>
      <div className={styles.floorLabel}>FLOOR 0</div>
      <h2 className={styles.title}>RECEPTION</h2>
    </div>

    <div className={styles.body}>

      {/* ── Name plate / hero ── */}
      <div className={styles.namePlate}>
        <div className={styles.namePlateInner}>
          <span className={styles.name}>JACK SANDERS</span>
          <span className={styles.role}>PhD Researcher · CERN NA62 · Full-Stack Dev</span>
        </div>
      </div>

      {/* ── Info cards row ── */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardHead}>⚛ RESEARCH</div>
          <div className={styles.cardLine}>CERN NA62 · Geneva</div>
          <div className={styles.cardLine}>K⁺→π⁺νν̄ search</div>
          <div className={styles.cardLine}>10B+ events</div>
          <div className={styles.cardLine}>Glasgow Uni PhD</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}>💻 CODE</div>
          <div className={styles.cardLine}>Python · C++ · TS</div>
          <div className={styles.cardLine}>React · Docker</div>
          <div className={styles.cardLine}>ML / PyTorch</div>
          <div className={styles.cardLine}>ROOT · Git</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}>🔗 FIND ME</div>
          <div className={styles.cardLine}>⌨ GitHub</div>
          <div className={styles.cardLine}>💼 LinkedIn</div>
          <div className={styles.cardLine}>✉ Email</div>
          <div className={styles.cardLine}>⚛ CERN page</div>
        </div>
      </div>

      {/* ── Walking people strip ── */}
      <div className={styles.lobbyScene}>
        <div className={styles.sceneFloor} />
        <div className={styles.walkerTrack}>
          <div className={styles.walkRight}><BlueWorker /></div>
          <div className={`${styles.walkLeft} ${styles.mirrorX}`}><PurpleWoman /></div>
        </div>
        {/* Reception desk */}
        <div className={styles.receptionDesk}>
          <div className={styles.deskTop}>
            <div className={styles.deskMonitor} />
            <div className={styles.deskSign}>JACK SANDERS</div>
          </div>
          <div className={styles.deskFront} />
        </div>
        {/* Plant left */}
        <div className={styles.plant}>
          <div className={styles.plantLeaves} />
          <div className={styles.plantPot} />
        </div>
        {/* Plant right */}
        <div className={`${styles.plant} ${styles.plantRight}`}>
          <div className={styles.plantLeaves} />
          <div className={styles.plantPot} />
        </div>
      </div>

    </div>
  </div>
);
