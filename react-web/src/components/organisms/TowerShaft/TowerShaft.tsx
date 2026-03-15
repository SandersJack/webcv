import { ElevatorCar } from '../../molecules/ElevatorCar';
import { FloorLabel } from '../../molecules/FloorLabel';
import { Floor } from '../../../data/floors';
import styles from './TowerShaft.module.css';

interface TowerShaftProps {
  floors: Floor[];
  currentFloor: number;
  onFloorSelect: (index: number) => void;
}

export const TowerShaft = ({ floors, currentFloor, onFloorSelect }: TowerShaftProps) => {
  return (
    <div className={styles.towerOuter}>
      {/* Antenna + roof */}
      <div className={styles.antennaWrap}>
        <div className={styles.antenna} />
      </div>
      <div className={styles.roof} />

      {/* Floor rows — highest floor at top */}
      <div className={styles.floorsArea}>
        {[...floors].reverse().map((floor) => (
          <div key={floor.id} className={styles.floorRow}>
            {/* Floor number label — outside left */}
            <div className={styles.floorNumOuter}>{floor.number}</div>

            {/* Room interior */}
            <FloorLabel
              number={floor.number}
              name={floor.shortName || floor.name}
              floorId={floor.id}
              isActive={currentFloor === floor.number}
              onClick={() => onFloorSelect(floor.number)}
            />

            {/* Elevator shaft strip — right side of building */}
            <div className={styles.shaftStrip}>
              {/* ElevatorCar is positioned within this strip via CSS */}
            </div>
          </div>
        ))}

        {/* ElevatorCar rides the full shaft height */}
        <div className={styles.elevatorRail}>
          <ElevatorCar currentFloor={currentFloor} totalFloors={floors.length} />
        </div>
      </div>

      {/* Building base */}
      <div className={styles.base} />
    </div>
  );
};
