
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { ExternalUrlCatalog } from '@/types/customTypes';
import CatalogSlide from './CatalogSlide';

interface CatalogCarouselProps {
  catalogs: ExternalUrlCatalog[];
  onOpenCatalog: (catalog: ExternalUrlCatalog) => void;
}

const CatalogCarousel: React.FC<CatalogCarouselProps> = ({ catalogs, onOpenCatalog }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  
  React.useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('select', onSelect);
      
      const onSettled = () => {
        emblaApi.scrollTo(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('settle', onSettled);
      
      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('settle', onSettled);
      };
    }
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  console.log('CatalogCarousel: Rendering carousel with', catalogs.length, 'catalogs');
  console.log('CatalogCarousel: Catalogs data:', catalogs);
  
  // Add safety check and debugging
  if (!catalogs || catalogs.length === 0) {
    console.log('CatalogCarousel: No catalogs provided, showing debug info');
    return (
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 mb-2">Debug: Carrossel sem catálogos</p>
        <p className="text-sm text-gray-500">Catálogos recebidos: {catalogs ? catalogs.length : 'undefined'}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      {/* Navigation Arrows - Always visible with better positioning */}
      <Button 
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-8 lg:-left-16 bg-white/90 text-gray-800 hover:bg-white rounded-full p-2 sm:p-3 z-20 shadow-lg border"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </Button>
      
      <Button 
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-8 lg:-right-16 bg-white/90 text-gray-800 hover:bg-white rounded-full p-2 sm:p-3 z-20 shadow-lg border"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </Button>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {catalogs.map((catalog: ExternalUrlCatalog) => (
            <CatalogSlide 
              key={catalog.id}
              catalog={catalog}
              onOpenCatalog={onOpenCatalog}
            />
          ))}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-6 sm:mt-8">
        {catalogs.map((_: ExternalUrlCatalog, index: number) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 sm:mx-2 transition-colors ${
              currentIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogCarousel;
