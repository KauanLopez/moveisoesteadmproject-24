
import { useEffect, useRef, useCallback } from 'react';

export const useDimensions = (totalItems: number) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef<number>(0);
  const containerWidthRef = useRef<number>(0);

  const updateDimensions = useCallback(() => {
    if (carouselRef.current) {
      containerWidthRef.current = carouselRef.current.offsetWidth;
      if (carouselRef.current.firstElementChild && totalItems > 0) {
        itemWidthRef.current = (carouselRef.current.firstElementChild as HTMLElement).offsetWidth;
      } else {
        itemWidthRef.current = 0;
      }
    }
  }, [totalItems]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, [updateDimensions]);

  return {
    carouselRef,
    itemWidthRef,
    containerWidthRef,
    updateDimensions
  };
};
