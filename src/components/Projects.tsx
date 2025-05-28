
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import CatalogViewModal from './catalog/CatalogViewModal';
import PdfCatalogModal from './pdf-catalog/PdfCatalogModal';
import { useContent } from '@/context/ContentContext';
import { fetchCompletedPdfCatalogs, PdfCatalog } from '@/services/pdfCatalogService';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [selectedPdfCatalog, setSelectedPdfCatalog] = useState<PdfCatalog | null>(null);
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalog[]>([]);
  const { content } = useContent();
  const projects = content.filter(item => item.section === 'projects');
  
  // Combine regular projects with PDF catalogs
  const allProjects = [
    ...projects,
    ...pdfCatalogs.map(catalog => ({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description || '',
      image: catalog.cover_image_url || '/placeholder.svg',
      isPdfCatalog: true,
      pdfCatalog: catalog
    }))
  ];
  
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
      }
    };

    loadPdfCatalogs();
  }, []);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  const handleOpenCatalog = (project: any) => {
    if (project.isPdfCatalog) {
      setSelectedPdfCatalog(project.pdfCatalog);
    } else {
      setSelectedCatalog(project.id);
    }
  };

  const handleCloseCatalog = () => {
    setSelectedCatalog(null);
    setSelectedPdfCatalog(null);
  };

  if (allProjects.length === 0) {
    return <div className="py-16 text-center">Nenhum catálogo disponível.</div>;
  }
  
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
        
        {allProjects.length > 0 && (
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
                {allProjects.map((project: any) => (
                  <div key={project.id} className="flex-[0_0_100%] min-w-0 px-4 transition-transform duration-300">
                    <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                        style={{ 
                          objectPosition: project.objectPosition || 'center',
                          transform: project.scale ? `scale(${project.scale})` : 'scale(1)'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <p className="text-white/80 mt-2">{project.description}</p>
                        <div className="mt-4">
                          <Button 
                            onClick={() => handleOpenCatalog(project)}
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
              {allProjects.map((_: any, index: number) => (
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
        )}
      </div>

      {selectedCatalog && (
        <CatalogViewModal 
          catalogId={selectedCatalog}
          isOpen={!!selectedCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}

      {selectedPdfCatalog && (
        <PdfCatalogModal 
          catalog={selectedPdfCatalog}
          isOpen={!!selectedPdfCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}
    </section>
  );
};

export default Projects;
