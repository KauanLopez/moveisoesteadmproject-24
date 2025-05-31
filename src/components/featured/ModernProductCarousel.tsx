import React from 'react';
import { useCarouselLogic } from './hooks/useCarouselLogic';
import CarouselItem from './CarouselItem';
import NavigationDots from './NavigationDots';
// import ItemCounter from './ItemCounter'; // Opcional, se você decidir usá-lo

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
    snapToItem, // Usado pelos dots e auto-scroll
    handleScroll,
    handleMouseDown,
    handleTouchStart,
    isDragging 
  } = useCarouselLogic(products);

  const handleDotClick = (index: number) => {
    // A função handleUserInteraction é chamada dentro do onDragStart (que é parte do handleMouseDown/TouchStart)
    // e também no onDragEnd se você seguiu a última sugestão de reiniciar o timer lá.
    // Chamar snapToItem aqui é suficiente para a navegação e o auto-scroll será pausado/resetado.
    snapToItem(index, true); 
  };

  if (!products || products.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum produto em destaque no momento.</div>;
  }

  return (
    <div className="relative w-full group/carousel">
      <div 
        ref={carouselRef}
        // CLASSES CSS ATUALIZADAS:
        // Removido snap-x e snap-mandatory para dar controle total ao JavaScript.
        // Adicionado active:cursor-grabbing para feedback visual durante o arraste.
        className={`flex overflow-x-auto scrollbar-hide ${
          isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'pan-y' }} // Permite scroll vertical da página em touch, enquanto o carrossel lida com o horizontal
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
            index={physicalIndex % totalItems} // Passa o índice lógico para o item
            isMobile={isMobile}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      <NavigationDots
        products={products} // Usa os produtos originais para a contagem de dots
        currentIndex={currentIndex}
        totalItems={totalItems}
        onDotClick={handleDotClick}
      />

      {/* Se você quiser usar o contador de itens:
      <ItemCounter
        currentIndex={currentIndex}
        totalItems={totalItems}
      />
      */}
    </div>
  );
};

export default ModernProductCarousel;