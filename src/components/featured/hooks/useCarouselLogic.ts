
import { useEffect, useState } from 'react';
import { useMobileDetection } from './useMobileDetection';
import { useUserInteraction } from './useUserInteraction';
import { useScrollLogic } from './useScrollLogic';
import { useAutoScroll } from './useAutoScroll';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useCarouselLogic = (products: Product[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMobileDetection();
  
  // Create infinite scroll items (duplicate items for seamless loop)
  const extendedProducts = [...products, ...products, ...products];
  const totalItems = products.length;

  const {
    isUserInteracting,
    handleUserInteraction,
    handleTouchStart,
    handleMouseDown
  } = useUserInteraction();

  const {
    carouselRef,
    scrollToIndex,
    handleScroll: baseHandleScroll
  } = useScrollLogic(extendedProducts, totalItems);

  const handleScroll = () => baseHandleScroll(setCurrentIndex);

  useAutoScroll(isUserInteracting, totalItems, scrollToIndex, setCurrentIndex);

  // Initialize position to middle set
  useEffect(() => {
    if (carouselRef.current) {
      setTimeout(() => {
        scrollToIndex(totalItems, false); // Start at middle set
      }, 100);
    }
  }, [scrollToIndex, totalItems]);

  return {
    carouselRef,
    currentIndex,
    setCurrentIndex,
    isMobile,
    extendedProducts,
    totalItems,
    scrollToIndex,
    handleScroll,
    handleTouchStart,
    handleMouseDown,
    handleUserInteraction
  };
};
