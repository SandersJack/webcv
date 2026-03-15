import { ElevatorCar } from '../../molecules/ElevatorCar';
import { FloorLabel } from '../../molecules/FloorLabel';
import styles from './TowerShaft.module.css';

export const TowerShaft = ({ floors, currentFloor, onFloorSelect }) => {
  return (
    <div className={styles.shaft}>
      <div className={styles.rail} />

      {/* Elevator car renders in absolute position inside the shaft */}
      <div className={styles.elevatorTrack}>
        <ElevatorCar
          currentFloor={currentFloor}
          totalFloors={floors.length}
        />
      </div>

      {/* Floor buttons rendered bottom-to-top via flex-direction: column-reverse */}
      <div className={styles.floorButtons}>
        {floors.map((floor) => (
          <div key={floor.id} className={styles.floorSlot}>
            <FloorLabel
              number={floor.number}
              name={floor.shortName || floor.name}
              isActive={currentFloor === floor.number}
              onClick={() => onFloorSelect(floor.number)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
