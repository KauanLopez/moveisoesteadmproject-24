
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PdfCatalog } from '@/services/pdf-catalog/types';
import useEmblaCarousel from 'embla-carousel-react';

interface PdfCatalogCarouselProps {
  catalogs: PdfCatalog[];
}

const PdfCatalogCarousel: React.FC<PdfCatalogCarouselProps> = ({ catalogs }) => {
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
      
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  const handleCatalogClick = (catalog: PdfCatalog) => {
    console.log('PDF Catalog clicked:', catalog.title);
    // Modal functionality has been removed
  };
  
  if (!catalogs || catalogs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600">Nenhum catálogo PDF disponível</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 relative">
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
          {catalogs.map((catalog: PdfCatalog) => (
            <div key={catalog.id} className="flex-[0_0_100%] min-w-0 px-2 sm:px-4 transition-transform duration-300">
              <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                <div className="aspect-[16/9] w-full">
                  <img 
                    src={catalog.cover_image_url || '/placeholder.svg'} 
                    alt={catalog.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{catalog.title}</h3>
                  <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{catalog.description}</p>
                  <div>
                    <Button 
                      onClick={() => handleCatalogClick(catalog)}
                      className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2"
                    >
                      Ver Catálogo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 sm:mt-8">
        {catalogs.map((_: PdfCatalog, index: number) => (
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

export default PdfCatalogCarousel;
