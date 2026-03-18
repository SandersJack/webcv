import { motion } from 'framer-motion';
import styles from './ElevatorCar.module.css';

interface ElevatorCarProps {
  currentFloor: number;
  totalFloors: number;
}

const FLOOR_H = 56; // must match TowerShaft

export const ElevatorCar = ({ currentFloor, totalFloors }: ElevatorCarProps) => {
  // Rail height = totalFloors * FLOOR_H (px)
  // Floor 0 is at the bottom; floor (totalFloors-1) is at the top.
  // Target Y from top of rail to centre of the car's floor slot:
  const floorIndex = totalFloors - 1 - currentFloor; // 0 = top floor, N-1 = lobby
  const centreY    = floorIndex * FLOOR_H + FLOOR_H / 2; // px from top of rail

  return (
    <motion.div
      className={styles.carWrapper}
      animate={{ top: centreY }}
      initial={{ top: centreY }}
      transition={{
        type: 'spring',
        stiffness: 55,
        damping: 16,
        mass: 1.4,
      }}
    >
      {/* Cable stretches from carWrapper's vertical centre up to the top of the rail */}
      <div className={styles.cable} />

      {/* Floor indicator tag */}
      <div className={styles.floorTag}>{currentFloor}</div>

      {/* Elevator car body */}
      <div className={styles.car}>
        {/* Roof cap */}
        <div className={styles.carRoof} />
        {/* Door panel */}
        <div className={styles.doorPanel}>
          <div className={styles.doorLeft}>
            <div className={styles.handle} />
          </div>
          <div className={styles.doorRight}>
            <div className={styles.handle} />
          </div>
        </div>
        {/* Base sill */}
        <div className={styles.carSill} />
      </div>

      {/* Indicator light pulses when at current floor */}
      <div className={styles.indicator} />
    </motion.div>
  );
};
