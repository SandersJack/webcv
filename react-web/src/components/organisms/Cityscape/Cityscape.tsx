import styles from './Cityscape.module.css';

export const Cityscape = () => {
  return (
    <div className={styles.cityscapeWrapper}>
      {/* Sky gradient fills the whole viewport via CSS */}

      {/* Clouds */}
      <div className={styles.cloudsLayer}>
        <div className={`${styles.cloud} ${styles.cloud1}`} />
        <div className={`${styles.cloud} ${styles.cloud2}`} />
        <div className={`${styles.cloud} ${styles.cloud3}`} />
      </div>

      {/* SVG: mountains + city silhouette */}
      <svg
        className={styles.cityscapeSvg}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Far mountain layer — lightest */}
        <g fill="#b8d0e8">
          <polygon points="0,220 120,120 240,200 320,140 440,210 560,130 680,200 800,145 920,210 1040,135 1160,205 1280,140 1440,220 1440,320 0,320" />
        </g>

        {/* Mid mountain layer */}
        <g fill="#9ab8d8">
          <polygon points="0,240 80,170 160,210 260,155 380,220 480,160 580,215 680,158 800,225 900,162 1020,230 1120,165 1240,225 1360,170 1440,240 1440,320 0,320" />
        </g>

        {/* City silhouette — left cluster */}
        <g fill="#8aaac8">
          <rect x="0" y="255" width="55" height="65" />
          <rect x="10" y="238" width="6" height="18" />
          <rect x="50" y="235" width="70" height="85" />
          <rect x="75" y="220" width="8" height="16" />
          <rect x="115" y="248" width="50" height="72" />
          <rect x="130" y="235" width="4" height="14" />
          <rect x="158" y="228" width="75" height="92" />
          <rect x="185" y="214" width="10" height="16" />
          <rect x="228" y="242" width="60" height="78" />
          <rect x="245" y="229" width="6" height="14" />
          <rect x="282" y="235" width="80" height="85" />
          <rect x="315" y="220" width="8" height="16" />
          <rect x="355" y="252" width="55" height="68" />
          <rect x="368" y="240" width="4" height="14" />
          <rect x="404" y="238" width="65" height="82" />
          <rect x="425" y="224" width="8" height="16" />
          <rect x="462" y="248" width="45" height="72" />
          <rect x="500" y="260" width="40" height="60" />
        </g>

        {/* City silhouette — right cluster */}
        <g fill="#8aaac8">
          <rect x="900" y="255" width="45" height="65" />
          <rect x="940" y="238" width="70" height="82" />
          <rect x="958" y="224" width="8" height="16" />
          <rect x="1005" y="248" width="55" height="72" />
          <rect x="1020" y="235" width="4" height="14" />
          <rect x="1055" y="230" width="75" height="90" />
          <rect x="1082" y="215" width="10" height="16" />
          <rect x="1125" y="245" width="60" height="75" />
          <rect x="1142" y="232" width="6" height="14" />
          <rect x="1180" y="238" width="75" height="82" />
          <rect x="1210" y="224" width="8" height="16" />
          <rect x="1250" y="252" width="55" height="68" />
          <rect x="1263" y="240" width="4" height="14" />
          <rect x="1300" y="240" width="65" height="80" />
          <rect x="1320" y="225" width="8" height="16" />
          <rect x="1360" y="250" width="45" height="70" />
          <rect x="1400" y="258" width="40" height="62" />
          <rect x="1440" y="262" width="0" height="58" />
        </g>

        {/* Ground level fill behind street */}
        <rect x="0" y="300" width="1440" height="20" fill="#4a4a4a" />

        {/* Window lights on city buildings */}
        <g fill="#ffe08a" opacity="0.7">
          <rect x="55" y="242" width="4" height="3" />
          <rect x="65" y="252" width="4" height="3" />
          <rect x="55" y="262" width="4" height="3" />
          <rect x="163" y="234" width="4" height="3" />
          <rect x="173" y="245" width="4" height="3" />
          <rect x="163" y="255" width="4" height="3" />
          <rect x="288" y="242" width="4" height="3" />
          <rect x="300" y="252" width="4" height="3" />
          <rect x="410" y="245" width="4" height="3" />
          <rect x="422" y="255" width="4" height="3" />
          <rect x="945" y="245" width="4" height="3" />
          <rect x="957" y="255" width="4" height="3" />
          <rect x="1062" y="237" width="4" height="3" />
          <rect x="1074" y="248" width="4" height="3" />
          <rect x="1062" y="258" width="4" height="3" />
          <rect x="1185" y="245" width="4" height="3" />
          <rect x="1198" y="255" width="4" height="3" />
          <rect x="1305" y="247" width="4" height="3" />
          <rect x="1318" y="258" width="4" height="3" />
        </g>
      </svg>
    </div>
  );
};
