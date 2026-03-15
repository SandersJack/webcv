import { useState, useCallback } from 'react';

export const FLOOR_COUNT = 5;

export const useElevator = (initialFloor = 0) => {
  const [currentFloor, setCurrentFloor] = useState(initialFloor);
  const [direction, setDirection] = useState(1); // 1 = going up, -1 = going down

  const goToFloor = useCallback((floor) => {
    if (floor < 0 || floor >= FLOOR_COUNT) return;
    setDirection(floor > currentFloor ? 1 : -1);
    setCurrentFloor(floor);
  }, [currentFloor]);

  const goUp = useCallback(() => {
    if (currentFloor < FLOOR_COUNT - 1) {
      setDirection(1);
      setCurrentFloor((f) => f + 1);
    }
  }, [currentFloor]);

  const goDown = useCallback(() => {
    if (currentFloor > 0) {
      setDirection(-1);
      setCurrentFloor((f) => f - 1);
    }
  }, [currentFloor]);

  return {
    currentFloor,
    direction,
    goToFloor,
    goUp,
    goDown,
  };
};
