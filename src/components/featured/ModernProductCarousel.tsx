
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Expand } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  image: string;
}

interface ModernProductCarouselProps {
  products: Product[];
  onImageClick: (imageUrl: string) => void;
}

const ModernProductCarousel: React.FC<ModernProductCarouselProps> = ({ 
  products, 
  onImageClick 
}) => {
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

  return (
    <div className="relative w-full">
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        {extendedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className={`flex-shrink-0 snap-center px-2 ${
              isMobile ? 'w-full' : 'w-1/3'
            }`}
          >
            <div className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Fullscreen Icon */}
                <button
                  onClick={() => onImageClick(product.image)}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Ver em tela cheia"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              handleUserInteraction();
              const targetIndex = totalItems + index;
              scrollToIndex(targetIndex);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-primary scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir para produto ${index + 1}`}
          />
        ))}
      </div>

      {/* Active Item Indicator */}
      <div className="text-center mt-2 text-sm text-gray-500">
        {currentIndex + 1} de {totalItems}
      </div>
    </div>
  );
};

export default ModernProductCarousel;
