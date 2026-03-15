import React, { useState, useEffect } from 'react';
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

  // Escape key exits zoom
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedFloor(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleFloorClick = (floorNumber: number) => {
    onFloorSelect(floorNumber);
    setZoomedFloor(floorNumber);
  };

  const zoomedFloorDef = zoomedFloor !== null ? floors.find(f => f.number === zoomedFloor) : null;
  const bgColor = zoomedFloor !== null ? FLOOR_BG_COLORS[zoomedFloor] ?? '#85c1e9' : undefined;

  return (
    <div className={styles.scene}>
      <Cityscape />

      {/* Street — sits at the very bottom, building stands on it */}
      <div className={styles.street}>
        <div className={styles.kerb} />
        <div className={styles.road}>
          <div className={styles.roadDashes} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {zoomedFloor === null ? (
          /* ── TOWER VIEW ── */
          <motion.div
            key="tower-view"
            className={styles.towerView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.buildingWrapper}>
              <TowerShaft
                floors={floors}
                currentFloor={currentFloor}
                onFloorSelect={handleFloorClick}
              />
            </div>
          </motion.div>
        ) : (
          /* ── ZOOMED VIEW ── */
          <motion.div
            key={`zoomed-${zoomedFloor}`}
            className={styles.zoomedView}
            style={{ backgroundColor: bgColor }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {/* Header bar */}
            <div className={styles.zoomedHeader}>
              <button
                className={styles.backButton}
                onClick={() => setZoomedFloor(null)}
              >
                {'<'} BACK
              </button>
              <span className={styles.floorTitle}>
                FLOOR {zoomedFloor} — {zoomedFloorDef?.name?.toUpperCase() ?? ''}
              </span>
            </div>

            {/* CV Content */}
            <div className={styles.zoomedContent}>
              <FloorComponent onNavigate={(f) => {
                onFloorSelect(f);
                setZoomedFloor(f);
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
