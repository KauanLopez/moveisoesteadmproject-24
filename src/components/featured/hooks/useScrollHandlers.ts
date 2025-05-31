
import { useCallback, useRef } from 'react';

export const useScrollHandlers = (
  totalItems: number,
  extendedProductsLength: number,
  itemWidthRef: React.RefObject<number>,
  containerWidthRef: React.RefObject<number>,
  carouselRef: React.RefObject<HTMLDivElement>,
  snapToItem: (index: number, smooth?: boolean) => void,
  isProgrammaticScrollRef: React.RefObject<boolean>,
  isDragging: boolean
) => {
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current || isDragging || !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;

    // Infinite scroll teleport logic
    const oneSetWidth = totalItems * itemWidthRef.current;
    if (currentScroll < itemWidthRef.current * 0.5 && totalItems > 0) {
      isProgrammaticScrollRef.current = true;
      container.scrollLeft += oneSetWidth;
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    } else if (currentScroll > (extendedProductsLength - totalItems - 0.5) * itemWidthRef.current && totalItems > 0) {
      isProgrammaticScrollRef.current = true;
      container.scrollLeft -= oneSetWidth;
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    }

    // Debounced magnetic snap after manual scroll
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!isDragging && !isProgrammaticScrollRef.current && carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) - 1;
        
        let finalLogicalIndex = physicalIndexAtCenter % totalItems;
        if (finalLogicalIndex < 0) finalLogicalIndex += totalItems;
        
        snapToItem(finalLogicalIndex, true);
      }
    }, 150);
  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProductsLength, snapToItem, isProgrammaticScrollRef, carouselRef]);

  return {
    handleScroll
  };
};
