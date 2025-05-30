
import { useRef, useCallback } from 'react';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useScrollLogic = (extendedProducts: Product[], totalItems: number) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / extendedProducts.length;
    const scrollPosition = index * itemWidth;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [extendedProducts.length]);

  const handleScroll = useCallback((setCurrentIndex: (index: number) => void) => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / extendedProducts.length;
    const scrollLeft = container.scrollLeft;
    const centerIndex = Math.round(scrollLeft / itemWidth);
    
    // Handle infinite loop repositioning
    if (centerIndex < totalItems) {
      // If we're in the first set, jump to the middle set
      const newIndex = centerIndex + totalItems;
      setTimeout(() => scrollToIndex(newIndex, false), 0);
    } else if (centerIndex >= totalItems * 2) {
      // If we're in the last set, jump to the middle set
      const newIndex = centerIndex - totalItems;
      setTimeout(() => scrollToIndex(newIndex, false), 0);
    }
    
    // Update current index for indicators
    const actualIndex = centerIndex % totalItems;
    setCurrentIndex(actualIndex);
  }, [extendedProducts.length, totalItems, scrollToIndex]);

  return {
    carouselRef,
    scrollToIndex,
    handleScroll
  };
};
