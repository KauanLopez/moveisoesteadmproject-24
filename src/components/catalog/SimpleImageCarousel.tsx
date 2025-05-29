
import React, { useState } from 'react';
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

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full h-full bg-gray-100 flex flex-col">
      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-w-full max-h-full object-contain"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
                size="icon"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Image title */}
      {currentImage.title && (
        <div className="bg-white border-t p-3 text-center flex-shrink-0">
          <h4 className="font-medium text-lg">{currentImage.title}</h4>
          <p className="text-sm text-gray-600">
            {currentIndex + 1} de {images.length}
          </p>
        </div>
      )}
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
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
