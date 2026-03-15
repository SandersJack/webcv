import { AnimatePresence, motion } from 'framer-motion';
import { TowerShaft } from '../../organisms/TowerShaft';
import styles from './TowerLayout.module.css';

const FLOOR_VARIANTS = {
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export const TowerLayout = ({ floors, currentFloor, onFloorSelect, direction, FloorComponent }) => {
  return (
    <div className={styles.layout}>
      <TowerShaft
        floors={floors}
        currentFloor={currentFloor}
        onFloorSelect={onFloorSelect}
      />

      <div className={styles.content}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentFloor}
            className={styles.floorWrapper}
            custom={direction}
            variants={FLOOR_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: 'spring', stiffness: 200, damping: 30 },
              opacity: { duration: 0.15 },
            }}
          >
            <FloorComponent onNavigate={onFloorSelect} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
