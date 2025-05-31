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
    isMobile,
    extendedProducts,
    totalItems,
    snapToItem, // Agora usamos snapToItem para os dots
    handleScroll,
    handleMouseDown,
    handleTouchStart,
    isDragging 
  } = useCarouselLogic(products);

  const handleDotClick = (index: number) => {
    // handleUserInteraction é chamado dentro de onDragStart, que é parte de handleMouseDown/TouchStart
    // Se o clique no dot não deve ser considerado uma "interação que pausa o auto-scroll" da mesma forma,
    // você pode querer chamar handleUserInteraction() aqui explicitamente.
    // Mas geralmente, clicar nos dots é uma interação do usuário.
    snapToItem(index, true); 
  };

  if (!products || products.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum produto em destaque no momento.</div>;
  }

  return (
    <div className="relative w-full group/carousel">
      <div 
        ref={carouselRef}
        // Removido snap-x snap-mandatory para dar controle ao JS
        className={`flex overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        // onTouchMove e onTouchEnd são gerenciados globalmente pelo hook quando isDragging é true
      >
        {extendedProducts.map((product, physicalIndex) => (
          <CarouselItem
            // Chave mais robusta para loops com itens repetidos
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

      {/* <ItemCounter
        currentIndex={currentIndex}
        totalItems={totalItems}
      />
      */}
    </div>
  );
};

export default ModernProductCarousel;