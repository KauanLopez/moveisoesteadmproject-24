
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { supabase } from "@/integrations/supabase/client";
import { ImageContent, mapDbContentToImageContent } from '@/types/customTypes';
import CatalogViewModal from './catalog/CatalogViewModal';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  const [projects, setProjects] = useState<ImageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  
  // Load content from Supabase with localStorage fallback
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', 'projects');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setProjects(data.map(mapDbContentToImageContent));
        } else {
          // Fallback to localStorage
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      const storedContent = localStorage.getItem('moveis_oeste_content');
      if (storedContent) {
        const allContent = JSON.parse(storedContent);
        const projectItems = allContent.filter((item: any) => item.section === 'projects');
        setProjects(projectItems);
      }
    };
    
    loadProjects();
  }, []);
  
  React.useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('select', onSelect);
      
      // Adiciona um ouvinte para quando o usuário parar de rolar
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

  const handleOpenCatalog = (id: string) => {
    setSelectedCatalog(id);
  };

  const handleCloseCatalog = () => {
    setSelectedCatalog(null);
  };

  if (loading) {
    return <div className="py-16 text-center">Carregando catálogos...</div>;
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
        
        {projects.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 md:px-16 relative">
            {/* Botões de navegação posicionados fora das imagens, visíveis em todos os dispositivos */}
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
            
            {/* Carrossel centralizado */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {projects.map((project: any) => (
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
                            onClick={() => handleOpenCatalog(project.id)}
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
            
            {/* Indicadores (bolinhas) */}
            <div className="flex justify-center mt-8">
              {projects.map((_: any, index: number) => (
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

      {/* Modal para visualizar o catálogo */}
      {selectedCatalog && (
        <CatalogViewModal 
          catalogId={selectedCatalog}
          isOpen={!!selectedCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}
    </section>
  );
};

export default Projects;
