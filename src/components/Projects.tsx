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
  const [loading, setLoading] = useState(true);
  const { content } = useContent();
  const projects = content.filter(item => item.section === 'projects');
  
  // Load PDF catalogs first
  useEffect(() => {
    const loadPdfCatalogs = async () => {
      console.log('Projects: Starting to load PDF catalogs...');
      setLoading(true);
      try {
        const catalogs = await fetchCompletedPdfCatalogs();
        console.log('Projects: Received catalogs from service:', catalogs);
        console.log('Projects: Number of catalogs received:', catalogs.length);
        
        // Check if SAMEC catalog is in the results
        const samecCatalog = catalogs.find(cat => cat.title === 'Catalogo SAMEC');
        console.log('Projects: SAMEC catalog in results:', samecCatalog);
        
        if (samecCatalog) {
          console.log('Projects: SAMEC catalog details:', {
            id: samecCatalog.id,
            title: samecCatalog.title,
            cover_image_url: samecCatalog.cover_image_url,
            content_image_urls: samecCatalog.content_image_urls
          });
        } else {
          console.log('Projects: SAMEC catalog NOT FOUND in results');
          console.log('Projects: Available catalog titles:', catalogs.map(c => c.title));
        }
        
        setPdfCatalogs(catalogs);
        console.log('Projects: PDF catalogs state updated');
      } catch (error) {
        console.error('Projects: Error loading PDF catalogs:', error);
      } finally {
        setLoading(false);
        console.log('Projects: Loading finished');
      }
    };

    loadPdfCatalogs();
  }, []);
  
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

  console.log('Projects: Final combination results:');
  console.log('Projects: Regular projects count:', projects.length);
  console.log('Projects: PDF catalogs count:', pdfCatalogs.length);
  console.log('Projects: All projects combined count:', allProjects.length);
  console.log('Projects: Combined projects:', allProjects.map(p => ({ 
    id: p.id, 
    title: p.title, 
    isPdfCatalog: p.isPdfCatalog || false,
    image: p.image 
  })));
  
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

  if (allProjects.length === 0) {
    console.log('Projects: No projects to display - showing empty state');
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
  
  console.log('Projects: Rendering carousel with', allProjects.length, 'projects');
  
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
              {allProjects.map((project: any) => {
                console.log('Projects: Rendering project:', project.title, 'with image:', project.image);
                return (
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
                        onError={(e) => {
                          console.error('Projects: Image load error for', project.title, '- URL:', project.image);
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                        onLoad={() => {
                          console.log('Projects: Image loaded successfully for', project.title);
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
                );
              })}
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
