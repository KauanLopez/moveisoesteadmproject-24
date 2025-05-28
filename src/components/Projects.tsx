import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import CatalogViewModal from './catalog/CatalogViewModal';
import PdfCatalogModal from './pdf-catalog/PdfCatalogModal';
import ExternalCatalogViewModal from './admin/external-catalog/ExternalCatalogViewModal';
import { useContent } from '@/context/ContentContext';
import { fetchCompletedPdfCatalogs, PdfCatalog } from '@/services/pdfCatalogService';
import { fetchExternalCatalogs } from '@/services/externalCatalogService';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
// Import the IMCAL catalog creator to ensure it's executed
import '@/utils/createImcalCatalog';

interface CarouselProject {
  id: string;
  title: string;
  description: string;
  image: string;
  isPdfCatalog?: boolean;
  isExternalCatalog?: boolean;
  pdfCatalog?: PdfCatalog;
  externalCatalog?: ExternalUrlCatalog;
  objectPosition?: string;
  scale?: number;
}

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
  const [selectedExternalCatalog, setSelectedExternalCatalog] = useState<ExternalUrlCatalog | null>(null);
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalog[]>([]);
  const [externalCatalogs, setExternalCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const { content } = useContent();
  const projects = content.filter(item => item.section === 'projects');
  
  useEffect(() => {
    const loadCatalogs = async () => {
      console.log('Projects: Starting to load catalogs...');
      setLoading(true);
      try {
        // Load PDF catalogs
        const pdfCatalogData = await fetchCompletedPdfCatalogs();
        console.log('Projects: PDF catalogs loaded:', pdfCatalogData.length);
        setPdfCatalogs(pdfCatalogData);
        
        // Load external catalogs
        const externalCatalogData = await fetchExternalCatalogs();
        console.log('Projects: External catalogs loaded:', externalCatalogData.length);
        setExternalCatalogs(externalCatalogData);
      } catch (error) {
        console.error('Projects: Error loading catalogs:', error);
      } finally {
        setLoading(false);
        console.log('Projects: Loading finished');
      }
    };

    loadCatalogs();
  }, []);
  
  // Combine regular projects, PDF catalogs, and external catalogs using the unified type
  const allProjects: CarouselProject[] = [
    // Convert regular projects to CarouselProject type
    ...projects.map(project => ({
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      image: project.image || '/placeholder.svg',
      objectPosition: project.objectPosition,
      scale: project.scale,
      isPdfCatalog: false,
      isExternalCatalog: false
    })),
    // Convert PDF catalogs to CarouselProject type
    ...pdfCatalogs.map(catalog => ({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description || '',
      image: catalog.cover_image_url || '/placeholder.svg',
      isPdfCatalog: true,
      isExternalCatalog: false,
      pdfCatalog: catalog
    })),
    // Convert external catalogs to CarouselProject type
    ...externalCatalogs.map(catalog => ({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description || '',
      image: catalog.external_cover_image_url,
      isPdfCatalog: false,
      isExternalCatalog: true,
      externalCatalog: catalog
    }))
  ];

  console.log('Projects: Final combination results:');
  console.log('Projects: Regular projects count:', projects.length);
  console.log('Projects: PDF catalogs count:', pdfCatalogs.length);
  console.log('Projects: External catalogs count:', externalCatalogs.length);
  console.log('Projects: All projects combined count:', allProjects.length);
  
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

  const handleOpenCatalog = (project: CarouselProject) => {
    if (project.isPdfCatalog && project.pdfCatalog) {
      setSelectedPdfCatalog(project.pdfCatalog);
    } else if (project.isExternalCatalog && project.externalCatalog) {
      setSelectedExternalCatalog(project.externalCatalog);
    } else {
      setSelectedCatalog(project.id);
    }
  };

  const handleCloseCatalog = () => {
    setSelectedCatalog(null);
    setSelectedPdfCatalog(null);
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
              {allProjects.map((project: CarouselProject) => {
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
            {allProjects.map((_: CarouselProject, index: number) => (
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

      {selectedExternalCatalog && (
        <ExternalCatalogViewModal 
          catalog={selectedExternalCatalog}
          isOpen={!!selectedExternalCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}
    </section>
  );
};

export default Projects;
