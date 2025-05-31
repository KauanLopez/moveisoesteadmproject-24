
import { useCallback, useRef } from 'react';

export const useSnapLogic = (
  totalItems: number,
  itemWidthRef: { current: number },
  containerWidthRef: { current: number },
  carouselRef: React.RefObject<HTMLDivElement>,
  setCurrentIndex: (index: number) => void
) => {
  const isProgrammaticScrollRef = useRef(false);

  const calculateScrollLeftForCenter = useCallback((physicalIndex: number) => {
    if (itemWidthRef.current === 0 || containerWidthRef.current === 0) return 0;
    const itemCenter = (physicalIndex * itemWidthRef.current) + (itemWidthRef.current / 2);
    const containerCenter = containerWidthRef.current / 2;
    return itemCenter - containerCenter;
  }, [itemWidthRef, containerWidthRef]);

  const snapToItem = useCallback((logicalIndexToSnap: number, smooth = true) => {
    if (!carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) return;
    
    isProgrammaticScrollRef.current = true;
    const targetPhysicalIndex = logicalIndexToSnap + totalItems;
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);

    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    setCurrentIndex(logicalIndexToSnap);
    
    if (smooth) {
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 300);
    } else {
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    }
  }, [totalItems, calculateScrollLeftForCenter, carouselRef, itemWidthRef, setCurrentIndex]);

  return {
    snapToItem,
    isProgrammaticScrollRef,
    calculateScrollLeftForCenter
  };
};
