import React from 'react';
import { useCarouselLogic } from './hooks/useCarouselLogic';
import CarouselItem from './CarouselItem';
import NavigationDots from './NavigationDots';
// import ItemCounter from './ItemCounter'; // Opcional

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
    handleMouseDown,
    handleTouchStart,
    isDragging // Pode ser usado para adicionar classes CSS durante o arraste
  } = useCarouselLogic(products);

  const handleDotClick = (index: number) => {
    // A interação do usuário já é tratada em onDragStart (dentro de handleMouseDown/TouchStart)
    const targetPhysicalIndex = totalItems + index; 
    scrollToIndex(targetPhysicalIndex, true);
    setCurrentIndex(index); 
  };

  if (!products || products.length === 0) {
    return <div className="text-center py-8">Nenhum produto em destaque no momento.</div>;
  }

  return (
    <div className="relative w-full group/carousel">
      <div 
        ref={carouselRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        // onTouchMove e onTouchEnd são gerenciados globalmente pelo hook
      >
        {extendedProducts.map((product, physicalIndex) => (
          <CarouselItem
            key={`${product.id}-loop-${Math.floor(physicalIndex / totalItems)}-${physicalIndex % totalItems}`} 
            product={product}
            index={physicalIndex % totalItems} // Passa o índice lógico para o item
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

      {/* <ItemCounter
        currentIndex={currentIndex}
        totalItems={totalItems}
      />
      */}
    </div>
  );
};

export default ModernProductCarousel;