
import React from 'react';
import { useCarouselLogic } from './hooks/useCarouselLogic';
import CarouselItem from './CarouselItem';
import NavigationDots from './NavigationDots';
import ItemCounter from './ItemCounter';

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
  const {
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
  } = useCarouselLogic(products);

  const handleDotClick = (index: number) => {
    handleUserInteraction();
    const targetIndex = totalItems + index;
    scrollToIndex(targetIndex);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        {extendedProducts.map((product, index) => (
          <CarouselItem
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            isMobile={isMobile}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      <NavigationDots
        products={products}
        currentIndex={currentIndex}
        totalItems={totalItems}
        onDotClick={handleDotClick}
      />

      <ItemCounter
        currentIndex={currentIndex}
        totalItems={totalItems}
      />
    </div>
  );
};

export default ModernProductCarousel;
