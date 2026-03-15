import { motion } from 'framer-motion';
import styles from './ElevatorCar.module.css';

export const ElevatorCar = ({ currentFloor, totalFloors, floorNames }) => {
  // Each floor label area in the shaft is floorSlotHeight px tall
  // The shaft height is 100vh, but floor buttons take up sections
  // We position based on percentage from bottom
  const floorIndex = totalFloors - 1 - currentFloor;
  const slotHeight = 100 / totalFloors; // percentage
  const targetY = `${floorIndex * slotHeight + slotHeight / 2}%`;

  return (
    <motion.div
      className={styles.shaft}
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
      <div className={styles.car}>
        <div className={styles.leftDoor} />
        <div className={styles.rightDoor} />
      </div>
    </motion.div>
  );
};
