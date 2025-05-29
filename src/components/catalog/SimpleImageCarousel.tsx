
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselImage {
  url: string;
  title: string;
}

interface SimpleImageCarouselProps {
  images: CarouselImage[];
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
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

  // Touch/Mouse drag handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50; // Minimum distance to trigger slide change
    
    if (translateX > threshold) {
      goToPrevious();
    } else if (translateX < -threshold) {
      goToNext();
    }
    
    setTranslateX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };
      
      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX]);

  const currentImage = images[currentIndex];

  return (
    <div 
      className="relative w-full h-full bg-gray-100 flex flex-col overflow-hidden"
      ref={containerRef}
    >
      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0">
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-w-full max-h-full object-contain pointer-events-none"
            draggable={false}
            onError={(e) => {
              console.error('SimpleImageCarousel: Failed to load image:', currentImage.url);
              const target = e.target as HTMLImageElement;
              target.style.display = 'block';
              target.alt = 'Erro ao carregar imagem';
            }}
            onLoad={() => {
              console.log('SimpleImageCarousel: Image loaded successfully:', currentImage.url);
            }}
          />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10 border"
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10 border"
                size="icon"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Image title and counter */}
      {currentImage.title && (
        <div className="bg-white border-t p-2 sm:p-3 text-center flex-shrink-0">
          <h4 className="font-medium text-sm sm:text-lg">{currentImage.title}</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            {currentIndex + 1} de {images.length}
          </p>
        </div>
      )}
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-20 bg-black/20 rounded-full px-2 py-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-furniture-yellow' : 'bg-white/60'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleImageCarousel;
