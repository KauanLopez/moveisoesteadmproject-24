
import React, { useState, useRef } from 'react';
import { useDragHandlers } from './hooks/useDragHandlers';
import CarouselNavigation from './components/CarouselNavigation';
import CarouselDots from './components/CarouselDots';
import CarouselImage from './components/CarouselImage';
import CarouselImageInfo from './components/CarouselImageInfo';

interface CarouselImage {
  url: string;
  title: string;
}

interface SimpleImageCarouselProps {
  images: CarouselImage[];
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('SimpleImageCarousel: Rendering with', images.length, 'images');

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Nenhuma imagem encontrada.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const {
    isDragging,
    translateX,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDragHandlers({
    onPrevious: goToPrevious,
    onNext: goToNext
  });

  const currentImage = images[currentIndex];

  return (
    <div 
      className="relative w-full h-full bg-gray-100 flex flex-col overflow-hidden"
      ref={containerRef}
    >
      <CarouselNavigation
        onPrevious={goToPrevious}
        onNext={goToNext}
        showNavigation={images.length > 1}
      />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-0">
        <CarouselImage
          imageUrl={currentImage.url}
          imageTitle={currentImage.title}
          isDragging={isDragging}
          translateX={translateX}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      <CarouselImageInfo
        title={currentImage.title}
        currentIndex={currentIndex}
        totalImages={images.length}
      />
      
      <CarouselDots
        totalImages={images.length}
        currentIndex={currentIndex}
        onSlideSelect={goToSlide}
      />
    </div>
  );
};

export default SimpleImageCarousel;
