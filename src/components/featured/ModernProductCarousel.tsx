import React from 'react';
import { useCarouselLogic } from './hooks/useCarouselLogic';
import CarouselItem from './CarouselItem';
import NavigationDots from './NavigationDots';

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
    isMobile,
    extendedProducts,
    totalItems,
    snapToItem,
    handleScroll,
    handleMouseDown,
    handleTouchStart,
    isDragging 
  } = useCarouselLogic(products);

  const handleDotClick = (index: number) => {
    snapToItem(index, true); 
  };

  if (!products || products.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum produto em destaque no momento.</div>;
  }

  return (
    <div className="relative w-full group/carousel">
      <div 
        ref={carouselRef}
        className={`flex overflow-x-auto scrollbar-hide ${
          isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'
        } `} // Adicionado espaço ao final da string de classes
        style={{ touchAction: 'pan-y' }} // Ajuda a separar scroll horizontal do carrossel e vertical da página
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {extendedProducts.map((product, physicalIndex) => (
          <CarouselItem
            key={`${product.id}-idx-${physicalIndex}`} 
            product={product}
            index={physicalIndex % totalItems} 
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
    </div>
  );
};

export default ModernProductCarousel;
