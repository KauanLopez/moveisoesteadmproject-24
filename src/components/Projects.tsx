
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import ExternalCatalogModal from './catalog/ExternalCatalogModal';
import { fetchExternalCatalogs } from '@/services/externalCatalogService';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  const [selectedExternalCatalog, setSelectedExternalCatalog] = useState<ExternalUrlCatalog | null>(null);
  const [externalCatalogs, setExternalCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCatalogs = async () => {
      console.log('Projects: Loading external catalogs...');
      setLoading(true);
      try {
        const catalogData = await fetchExternalCatalogs();
        console.log('Projects: External catalogs loaded:', catalogData.length);
        setExternalCatalogs(catalogData);
      } catch (error) {
        console.error('Projects: Error loading external catalogs:', error);
        setExternalCatalogs([]);
      } finally {
        setLoading(false);
        console.log('Projects: Loading finished');
      }
    };

    loadCatalogs();
  }, []);
  
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

  const handleOpenCatalog = (catalog: ExternalUrlCatalog) => {
    console.log('Projects: Opening catalog:', catalog.title);
    setSelectedExternalCatalog(catalog);
  };

  const handleCloseCatalog = () => {
    setSelectedExternalCatalog(null);
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Catálogos</h2>
            <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Carregando catálogos...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (externalCatalogs.length === 0) {
    console.log('Projects: No catalogs to display - showing empty state');
    return (
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Catálogos</h2>
            <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Nenhum catálogo disponível.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  console.log('Projects: Rendering carousel with', externalCatalogs.length, 'catalogs');
  
  return (
    <section id="projects" className="py-16 bg-gray-50">
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
              {externalCatalogs.map((catalog: ExternalUrlCatalog) => {
                console.log('Projects: Rendering catalog:', catalog.title, 'with cover image:', catalog.external_cover_image_url);
                return (
                  <div key={catalog.id} className="flex-[0_0_100%] min-w-0 px-4 transition-transform duration-300">
                    <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={catalog.external_cover_image_url} 
                        alt={catalog.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Projects: Image load error for', catalog.title, '- URL:', catalog.external_cover_image_url);
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                        onLoad={() => {
                          console.log('Projects: Cover image loaded successfully for', catalog.title);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                        <h3 className="text-2xl font-bold text-white">{catalog.title}</h3>
                        <p className="text-white/80 mt-2">{catalog.description}</p>
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
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            {externalCatalogs.map((_: ExternalUrlCatalog, index: number) => (
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

      {selectedExternalCatalog && (
        <ExternalCatalogModal 
          catalog={selectedExternalCatalog}
          isOpen={!!selectedExternalCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}
    </section>
  );
};

export default Projects;
