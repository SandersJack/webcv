import { motion } from 'framer-motion';
import styles from './ElevatorCar.module.css';

interface ElevatorCarProps {
  currentFloor: number;
  totalFloors: number;
}

export const ElevatorCar = ({ currentFloor, totalFloors }: ElevatorCarProps) => {
  // Floor 0 is at the bottom of the building, highest floor at top.
  // The floorsContainer renders floors in reverse (high floor at top → low floor at bottom).
  // floorIndex=0 means current floor is the highest (top), floorIndex=totalFloors-1 means floor 0 (bottom).
  const floorIndex = totalFloors - 1 - currentFloor;
  const slotHeight = 100 / totalFloors; // percentage of rail height
  const targetY = `${floorIndex * slotHeight + slotHeight / 2}%`;

  return (
    <motion.div
      className={styles.carWrapper}
      animate={{ top: targetY }}
      transition={{
        type: 'spring',
        stiffness: 60,
        damping: 18,
        mass: 1.2,
      }}
      style={{ top: targetY }}
    >
      <div className={styles.cable} />
      <div className={styles.floorDisplay}>
        {currentFloor}
      </div>
      <div className={styles.car} />
    </motion.div>
  );
};
