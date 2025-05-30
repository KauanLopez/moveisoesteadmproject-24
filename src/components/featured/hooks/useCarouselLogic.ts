
import { useEffect, useRef, useState, useCallback } from 'react';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useCarouselLogic = (products: Product[]) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout>();
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();

  // Create infinite scroll items (duplicate items for seamless loop)
  const extendedProducts = [...products, ...products, ...products];
  const itemsPerView = isMobile ? 1 : 3;
  const totalItems = products.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Auto-scroll functionality
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
  }, [isUserInteracting, scrollToIndex, totalItems]);

  // Handle user interaction pause
  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000); // Resume auto-scroll after 5 seconds of no interaction
  }, []);

  // Snap to center logic
  const handleScroll = useCallback(() => {
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

  // Touch and drag handlers
  const handleTouchStart = useCallback(() => {
    handleUserInteraction();
  }, [handleUserInteraction]);

  const handleMouseDown = useCallback(() => {
    handleUserInteraction();
  }, [handleUserInteraction]);

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
