import { TowerLayout } from '../../components/templates/TowerLayout';
import { useElevator } from '../../hooks/useElevator';
import { FLOORS } from '../../data/floors';

export const Tower = () => {
  const { currentFloor, direction, goToFloor } = useElevator(0);

  const currentFloorDef = FLOORS[currentFloor];
  const FloorComponent = currentFloorDef?.component;

  if (!FloorComponent) return null;

  return (
    <TowerLayout
      floors={FLOORS}
      currentFloor={currentFloor}
      onFloorSelect={goToFloor}
      direction={direction}
      FloorComponent={FloorComponent}
    />
  );
};
