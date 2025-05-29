
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
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
  
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-16 relative">
      <Button 
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-14 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2 z-10 shadow-md"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
      
      <Button 
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-14 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2 z-10 shadow-md"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
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
      
      <div className="flex justify-center mt-8">
        {catalogs.map((_: ExternalUrlCatalog, index: number) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full mx-2 transition-colors ${
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
