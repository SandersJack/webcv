import { useEffect } from 'react';
import { TowerLayout } from '../../components/templates/TowerLayout';
import { useElevator } from '../../hooks/useElevator';
import { FLOORS } from '../../data/floors';

export const Tower = () => {
  const { currentFloor, direction, goToFloor, goUp, goDown } = useElevator(0);

  const currentFloorDef = FLOORS[currentFloor];
  const FloorComponent = currentFloorDef?.component;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') goUp();
      if (e.key === 'ArrowDown' || e.key === 's') goDown();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goUp, goDown]);

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
