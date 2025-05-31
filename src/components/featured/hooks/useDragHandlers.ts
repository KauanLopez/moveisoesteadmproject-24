
import { useState, useCallback, useEffect } from 'react';

export const useDragHandlers = (
  totalItems: number,
  itemWidthRef: { current: number },
  containerWidthRef: { current: number },
  carouselRef: React.RefObject<HTMLDivElement>,
  snapToItem: (index: number, smooth?: boolean) => void,
  handleUserInteraction: () => void,
  isProgrammaticScrollRef: { current: boolean }
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const onDragStart = useCallback((clientX: number) => {
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) return;
    handleUserInteraction();
    setIsDragging(true);
    isProgrammaticScrollRef.current = true;
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems, carouselRef, itemWidthRef, isProgrammaticScrollRef]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const x = clientX;
    const walk = (x - startX); 
    carouselRef.current.scrollLeft = initialScrollLeft - walk;
  }, [isDragging, startX, initialScrollLeft, carouselRef]);

  const onDragEnd = useCallback(() => {
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) {
      setIsDragging(false);
      return;
    }
    
    if (!isDragging) return;

    setIsDragging(false);
    isProgrammaticScrollRef.current = false;

    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      carouselRef.current.style.cursor = 'grab';

      const currentScroll = carouselRef.current.scrollLeft;
      const centerViewportScroll = currentScroll + (containerWidthRef.current / 2);
      const closestPhysicalIndex = Math.round(centerViewportScroll / itemWidthRef.current) - 1;

      let logicalIndexToSnap = closestPhysicalIndex % totalItems;
      if (logicalIndexToSnap < 0) logicalIndexToSnap += totalItems;

      snapToItem(logicalIndexToSnap, true);
    }
  }, [isDragging, totalItems, snapToItem, itemWidthRef, containerWidthRef, carouselRef, isProgrammaticScrollRef]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => onDragMove(e.pageX);
    const handleGlobalMouseUp = () => onDragEnd();
    const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragging) onDragMove(e.touches[0].clientX); };
    const handleGlobalTouchEnd = () => onDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, onDragMove, onDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => onDragStart(e.pageX), [onDragStart]);
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    onDragStart(e.touches[0].clientX);
  }, [onDragStart]);

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart
  };
};
