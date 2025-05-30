
import { useEffect, useRef } from 'react';

export const useAutoScroll = (
  isUserInteracting: boolean,
  totalItems: number,
  scrollToIndex: (index: number) => void,
  setCurrentIndex: (prev: (prev: number) => number) => void
) => {
  const autoScrollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isUserInteracting) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        const targetIndex = totalItems + next; // Start from middle set
        scrollToIndex(targetIndex);
        return next % totalItems;
      });
    }, 3000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isUserInteracting, scrollToIndex, totalItems, setCurrentIndex]);

  return autoScrollRef;
};
