
import { useState, useEffect } from 'react';
import { useMobileDetection } from './useMobileDetection';
import { useAutoScroll } from './useAutoScroll';
import { useDimensions } from './useDimensions';
import { useUserInteraction } from './useUserInteraction';
import { useSnapLogic } from './useSnapLogic';
import { useDragHandlers } from './useDragHandlers';
import { useScrollHandlers } from './useScrollHandlers';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useCarouselLogic = (products: Product[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMobileDetection();
  
  const extendedProducts = products.length > 0 ? [...products, ...products, ...products] : [];
  const totalItems = products.length;

  // Use smaller hooks
  const { carouselRef, itemWidthRef, containerWidthRef } = useDimensions(totalItems);
  const { isUserInteracting, handleUserInteraction } = useUserInteraction();
  const { snapToItem, isProgrammaticScrollRef } = useSnapLogic(
    totalItems, 
    itemWidthRef, 
    containerWidthRef, 
    carouselRef, 
    setCurrentIndex
  );
  
  const { isDragging, handleMouseDown, handleTouchStart } = useDragHandlers(
    totalItems,
    itemWidthRef,
    containerWidthRef,
    carouselRef,
    snapToItem,
    handleUserInteraction,
    isProgrammaticScrollRef
  );

  const { handleScroll } = useScrollHandlers(
    totalItems,
    extendedProducts.length,
    itemWidthRef,
    containerWidthRef,
    carouselRef,
    snapToItem,
    isProgrammaticScrollRef,
    isDragging
  );

  // Auto-scroll hook
  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  // Initialization effect
  useEffect(() => {
    if (totalItems > 0 && itemWidthRef.current > 0 && carouselRef.current) {
      const initTimeout = setTimeout(() => {
        snapToItem(0, false);
      }, 50);
      return () => clearTimeout(initTimeout);
    }
  }, [totalItems, snapToItem]);

  return {
    carouselRef,
    currentIndex,
    isMobile,
    extendedProducts,
    totalItems,
    snapToItem,
    handleScroll,
    handleMouseDown,
    handleTouchStart,
    isDragging
  };
};
