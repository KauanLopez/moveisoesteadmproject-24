import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { fetchCompletedPdfCatalogs, PdfCatalog } from '@/services/pdfCatalogService';
import UniversalCatalogModal from '@/components/catalog/UniversalCatalogModal';
import { useCatalogModal } from '@/hooks/useCatalogModal';

const PdfCatalogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCatalog, isOpen, openPdfCatalog, closeCatalog } = useCatalogModal();
  
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

  useEffect(() => {
    const loadPdfCatalogs = async () => {
      try {
        const catalogs = await fetchCompletedPdfCatalogs();
        setPdfCatalogs(catalogs);
      } catch (error) {
        console.error('Error loading PDF catalogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPdfCatalogs();
  }, []);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  const handleOpenCatalog = (catalog: PdfCatalog) => {
    openPdfCatalog(catalog);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green mx-auto mb-4"></div>
        <p>Carregando catálogos...</p>
      </div>
    );
  }

  if (pdfCatalogs.length === 0) {
    return <div className="py-16 text-center">Nenhum catálogo disponível.</div>;
  }
  
  return (
    <section id="pdf-catalogs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Catálogos</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Navegue por nossos catálogos e veja como nossos móveis transformam espaços.
          </p>
        </div>
        
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
              {pdfCatalogs.map((catalog) => (
                <div key={catalog.id} className="flex-[0_0_100%] min-w-0 px-4 transition-transform duration-300">
                  <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={catalog.cover_image_url || '/placeholder.svg'} 
                      alt={catalog.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white">{catalog.title}</h3>
                      {catalog.description && (
                        <p className="text-white/80 mt-2">{catalog.description}</p>
                      )}
                      <div className="mt-4">
                        <Button 
                          onClick={() => handleOpenCatalog(catalog)}
                          className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black"
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
          
          <div className="flex justify-center mt-8">
            {pdfCatalogs.map((_, index) => (
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
      </div>

      <UniversalCatalogModal 
        catalog={selectedCatalog}
        isOpen={isOpen} 
        onClose={closeCatalog} 
      />
    </section>
  );
};

export default PdfCatalogCarousel;
