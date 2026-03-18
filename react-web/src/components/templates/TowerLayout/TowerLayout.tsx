import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TowerShaft } from '../../organisms/TowerShaft';
import { Cityscape } from '../../organisms/Cityscape';
import { Floor } from '../../../data/floors';
import styles from './TowerLayout.module.css';

const FLOOR_BG_COLORS: Record<number, string> = {
  0: '#4ecdc4',
  1: '#f7dc6f',
  2: '#85c1e9',
  3: '#f0a500',
  4: '#a29bfe',
};

const FLOOR_H   = 56;
const BASE_H    = 12;
const STREET_H  = 56;

const getTowerOrigin = (n: number) =>
  `50% calc(100% - ${BASE_H + n * FLOOR_H + FLOOR_H / 2}px)`;

const floorCentreY = (n: number) =>
  window.innerHeight - STREET_H - BASE_H - n * FLOOR_H - FLOOR_H / 2;

interface TowerLayoutProps {
  floors: Floor[];
  currentFloor: number;
  onFloorSelect: (floor: number) => void;
  direction: number;
  FloorComponent: React.ComponentType<{ onNavigate?: (floor: number) => void }>;
}

export const TowerLayout = ({
  floors,
  currentFloor,
  onFloorSelect,
  FloorComponent,
}: TowerLayoutProps) => {
  const [zoomedFloor, setZoomedFloor] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const lastFloor       = useRef<number>(0);
  const returning       = useRef<boolean>(false);
  const fromElevator    = useRef<boolean>(false);
  const zoomOrigin      = useRef<string>('50% 50%');
  const zoomScaleEnter  = useRef<number>(0.04);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleBack(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll whenever a floor panel is open
  useEffect(() => {
    document.body.style.overflow = zoomedFloor !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [zoomedFloor]);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 280);
  };

  const setPinForFloor = (n: number) => {
    const panelH   = window.innerHeight * 0.5;           // matches 50vh
    const panelTop = window.innerHeight - STREET_H - panelH; // panel's top edge in viewport
    const cy       = floorCentreY(n);                    // floor centre in viewport
    const yInPanel = cy - panelTop;                      // relative to panel top
    zoomOrigin.current     = `50% ${((yInPanel / panelH) * 100).toFixed(2)}%`;
    zoomScaleEnter.current = FLOOR_H / panelH;
  };

  // Called when tapping a floor in the tower view
  const handleFloorClick = (n: number) => {
    returning.current   = false;
    fromElevator.current = false;
    lastFloor.current   = n;
    setPinForFloor(n);
    onFloorSelect(n);
    triggerFlash();
    setZoomedFloor(n);
  };

  // Called from the in-panel elevator buttons
  const handleElevatorNav = (n: number) => {
    if (n === zoomedFloor) return;
    fromElevator.current = true;
    lastFloor.current    = n;
    setPinForFloor(n);
    onFloorSelect(n);
    setZoomedFloor(n);
  };

  const handleBack = () => {
    returning.current = true;
    triggerFlash();
    setZoomedFloor(null);
  };

  const zoomedFloorDef = zoomedFloor !== null
    ? floors.find(f => f.number === zoomedFloor) : null;

  const bgColor = zoomedFloor !== null
    ? (FLOOR_BG_COLORS[zoomedFloor] ?? '#85c1e9') : undefined;

  const maxFloor = floors.length - 1;

  return (
    <div className={styles.scene}>

      <div className={styles.bg}>
        <Cityscape />
        <div className={styles.street}>
          <div className={styles.kerb} />
          <div className={styles.road}><div className={styles.roadDashes} /></div>
        </div>
      </div>

      {/* Tower */}
      <AnimatePresence>
        {zoomedFloor === null && (
          <motion.div
            key="tower"
            className={styles.towerView}
            style={{ transformOrigin: getTowerOrigin(lastFloor.current) }}
            initial={returning.current
              ? { scale: 4, opacity: 0, filter: 'blur(6px)' }
              : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)',
              transition: { duration: 0.45, ease: [0.0, 0.85, 0.2, 1.0] } }}
            exit={{ scale: 4, opacity: 0, filter: 'blur(6px)',
              transition: { duration: 0.32, ease: [0.4, 0.0, 0.8, 0.6] } }}
          >
            <TowerShaft floors={floors} currentFloor={currentFloor}
              onFloorSelect={handleFloorClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dim overlay */}
      <AnimatePresence>
        {zoomedFloor !== null && (
          <motion.div key="overlay" className={styles.dimOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }} />
        )}
      </AnimatePresence>

      {/* Zoomed floor panel */}
      <AnimatePresence>
        {zoomedFloor !== null && zoomedFloorDef && (
          <motion.div
            key={`zoomed-${zoomedFloor}`}
            className={styles.zoomedWrapper}
            style={{ transformOrigin: zoomOrigin.current }}
            initial={fromElevator.current
              ? { opacity: 0, scale: 0.97 }
              : { scale: zoomScaleEnter.current, opacity: 0.7, filter: 'blur(2px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)',
              transition: {
                scale:   { duration: fromElevator.current ? 0.2 : 0.42, ease: [0.0, 0.85, 0.15, 1.0] },
                opacity: { duration: 0.2, ease: 'easeOut' },
                filter:  { duration: 0.25, ease: 'easeOut' },
              }}}
            exit={{ opacity: 0, scale: fromElevator.current ? 0.97 : zoomScaleEnter.current,
              transition: { duration: 0.15, ease: 'easeIn' }}}
          >
            {/* Left building wall */}
            <div className={styles.wallLeft} />

            {/* Floor content */}
            <div className={styles.floorPanel} style={{ backgroundColor: bgColor }}>
              <div className={styles.floorContent}>
                <FloorComponent onNavigate={handleElevatorNav} />
              </div>
            </div>

            {/* Right elevator panel */}
            <div className={styles.elevatorPanel}>
              <button
                className={styles.elevBtn}
                disabled={zoomedFloor >= maxFloor}
                onClick={() => handleElevatorNav(zoomedFloor + 1)}
              >▲</button>

              {[...floors].reverse().map(f => (
                <button
                  key={f.number}
                  className={`${styles.floorBtn} ${f.number === zoomedFloor ? styles.floorBtnActive : ''}`}
                  onClick={() => handleElevatorNav(f.number)}
                  style={f.number === zoomedFloor
                    ? { backgroundColor: FLOOR_BG_COLORS[f.number] } : undefined}
                >
                  {f.number}
                </button>
              ))}

              <button
                className={styles.elevBtn}
                disabled={zoomedFloor <= 0}
                onClick={() => handleElevatorNav(zoomedFloor - 1)}
              >▼</button>

              <button className={styles.backBtn} onClick={handleBack}>✕</button>
            </div>

            {/* Peek of floor below */}
            <div
              className={styles.nextFloorPeek}
              style={{ backgroundColor: zoomedFloor > 0 ? FLOOR_BG_COLORS[zoomedFloor - 1] : '#3a3a3a' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div key="flash" className={styles.flash}
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }} />
        )}
      </AnimatePresence>
    </div>
  );
};
