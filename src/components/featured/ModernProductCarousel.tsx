// src/components/featured/ModernProductCarousel.tsx
// ... (imports)

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
        // REMOVA snap-x e snap-mandatory daqui para controle JS total do snap
        className={`flex overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing active:cursor-grabbing' : 'cursor-grab'} `}
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
      {/* ItemCounter opcional */}
    </div>
  );
};

export default ModernProductCarousel;